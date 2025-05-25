from fastapi import FastAPI, File, UploadFile, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText

import pytesseract
from PIL import Image
from io import BytesIO
import numpy as np
from pathlib import Path
from moviepy import VideoFileClip
import subprocess
import uuid
import os
import cv2
import threading
import time

app = FastAPI()

# CORS Ayarı
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://173.249.60.195/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate Limiting Ayarı
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Klasörler
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR / "outputs"
TEMP_DIR = BASE_DIR / "temp"

for directory in [UPLOAD_DIR, OUTPUT_DIR, TEMP_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

# Tesseract Yolu (Windows)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Dosya silme zamanlayıcı
def delayed_file_delete(path, delay_seconds=300):
    def _delete():
        time.sleep(delay_seconds)
        try:
            path.unlink(missing_ok=True)
        except Exception:
            pass
    threading.Thread(target=_delete, daemon=True).start()

# Middleware: Dosya boyutu sınırı
class LimitUploadSizeMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        route_limits = {
            "/api/video-to-mp3": 50 * 1024 * 1024,       # 50 MB
            "/api/convert-to-pdf": 0.05 * 1024 * 1024,     # 10 MB
            "/api/image-to-text": 10 * 1024 * 1024       # 10 MB
        }

        content_length = request.headers.get("content-length")
        if content_length:
            max_size = route_limits.get(request.url.path)
            if max_size and int(content_length) > max_size:
                return JSONResponse(
                    content={ "error": "File too large" },
                    status_code=413
                )

        return await call_next(request)

app.add_middleware(LimitUploadSizeMiddleware)

# 🎞 Video'dan MP3'e
@app.post("/api/video-to-mp3")
@limiter.limit("7/minute")
async def video_to_mp3(request: Request, file: UploadFile = File(...)):
    allowed_ext = {"mp4", "mov", "avi", "mkv"}
    allowed_mime = {
        "video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska"
    }

    file_ext = file.filename.split(".")[-1].lower()
    if file_ext not in allowed_ext or file.content_type not in allowed_mime:
        return JSONResponse(content={"error": "Desteklenmeyen video formatı"}, status_code=400)

    temp_path = UPLOAD_DIR / f"{uuid.uuid4()}.{file_ext}"
    with open(temp_path, "wb") as f:
        f.write(await file.read())

    mp3_path = OUTPUT_DIR / f"{uuid.uuid4()}.mp3"

    try:
        video = VideoFileClip(str(temp_path))
        video.audio.write_audiofile(str(mp3_path))
        video.close()
        delayed_file_delete(mp3_path)
        response = FileResponse(mp3_path, media_type="audio/mpeg", filename="converted.mp3")
        return response
    except Exception as e:
        return JSONResponse(content={"error": f"İşlem hatası: {str(e)}"}, status_code=500)
    finally:
        temp_path.unlink(missing_ok=True)

# 📄 PDF Dönüştürme
@app.post("/api/convert-to-pdf")
@limiter.limit("7/minute")
async def convert_to_pdf(request: Request, file: UploadFile = File(...)):
    allowed_ext = {"doc", "docx", "xls", "xlsx", "txt"}
    allowed_mime = {
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain"
    }

    file_ext = file.filename.split(".")[-1].lower()
    if file_ext not in allowed_ext or file.content_type not in allowed_mime:
        return JSONResponse(content={"error": "Desteklenmeyen dosya türü"}, status_code=400)

    input_path = TEMP_DIR / f"{uuid.uuid4()}.{file_ext}"
    with open(input_path, "wb") as f:
        f.write(await file.read())

    try:
        subprocess.run([
            "C:/Program Files/LibreOffice/program/soffice.exe",
            "--headless",
            "--convert-to", "pdf",
            "--outdir", str(OUTPUT_DIR),
            str(input_path)
        ], check=True)
        pdf_path = OUTPUT_DIR / f"{input_path.stem}.pdf"
        if not pdf_path.exists():
            return JSONResponse(content={"error": "PDF bulunamadı"}, status_code=500)
        delayed_file_delete(pdf_path)
        return FileResponse(pdf_path, media_type="application/pdf", filename="converted.pdf")
    except subprocess.CalledProcessError as e:
        return JSONResponse(content={"error": "PDF dönüştürme başarısız", "details": str(e)}, status_code=500)
    finally:
        input_path.unlink(missing_ok=True)

# 🖼 OCR
@app.post("/api/image-to-text")
@limiter.limit("7/minute")
async def image_to_text(request: Request, file: UploadFile = File(...)):
    ext = file.filename.split(".")[-1].lower()
    if ext not in ["jpg", "jpeg", "webp"]:
        return JSONResponse(content={"error": "Unsupported image format"}, status_code=400)

    image_path = UPLOAD_DIR / f"{uuid.uuid4()}.{ext}"
    with open(image_path, "wb") as f:
        f.write(await file.read())

    try:
        image = cv2.imread(str(image_path))
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        text_normal = pytesseract.image_to_string(gray, lang="eng+tur+aze+deu+fra+ita+jpn+spa", config="--psm 6")
        inverted = cv2.bitwise_not(gray)
        text_inverted = pytesseract.image_to_string(inverted, lang="eng+tur+aze+deu+fra+ita+jpn+spa")

        text = text_normal.strip() if len(text_normal.strip()) > len(text_inverted.strip()) else text_inverted.strip()
        return {"text": text}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    finally:
        image_path.unlink(missing_ok=True)

# 📧 E-Posta
class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str

@app.post("/api/contact")
async def send_email(data: ContactForm):
    sender_email = "frednuri0@gmail.com"
    sender_password = "ddnl ujvb yjty tuqf"
    receiver_email = "frednuri0@gmail.com"

    subject = f"İletişim Formu: {data.name} ({data.email})"
    msg = MIMEText(data.message)
    msg["Subject"] = subject
    msg["From"] = data.email
    msg["To"] = receiver_email

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, sender_password)
            server.sendmail(data.email, receiver_email, msg.as_string())
        return {"detail": "Message sent successfully."}
    except Exception as e:
        return {"detail": f"Email could not be sent: {str(e)}"}
