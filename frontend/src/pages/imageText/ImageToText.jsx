import React, { useState } from "react";
import { AiOutlineCopy} from 'react-icons/ai';
import { MdAddPhotoAlternate } from "react-icons/md";
import "./ImageToText.css";
import "./ImgTextRes.css"
import FAQ from '../../components/faq/FAQ.jsx';
import HowItWorks from '../../components/how-works/HowItWorks';

export default function ImageToText() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult("");
    setError("");
    setCopied(false);
  };

const MAX_FILE_SIZE_MB = 10;

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!file) {
    setError("Please select an image file.");
    return;
  }

  const maxSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    setError(`Please upload a smaller image (max ${MAX_FILE_SIZE_MB}MB).`);
    return;
  }

  setLoading(true);
  setError("");
  setResult("");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:8000/api/image-to-text", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      setResult(data.text);
    } else {
      setError(data.error || "An error occurred. Please try again.");
    }
  } catch (err) {
    setError("An error occurred. Please try again.");
  }

  setLoading(false);
};

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult("");
    setError("");
    setCopied(false);
  };

  const downloadAs = (type) => {
    let blob;
    if (type === "txt") {
      blob = new Blob([result], { type: "text/plain" });
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `extracted_text.${type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="imageToTextContainer">
      <h1>Extracting Text from Photo (OCR)</h1>
      <div className="imageToTextBar">
        <form onSubmit={handleSubmit} className="form">
          {!preview && (
            <>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".jpg,.jpeg,.webp"
                onChange={handleFileChange}
              />
              <label className="textLabel" htmlFor="file">
                <MdAddPhotoAlternate size={40}/> Click to select image file
              </label>
              <p style={{ color: "gray" }}>Only .jpg, .jpeg and .webp files are supported</p>
            </>
          )}

          {preview && (
            <div className="previewContainer">
              <img src={preview} alt="Preview" className="previewImage" />
            </div>
          )}

          {error && <div className="errorMessage">{error}</div>}

          <div className="buttonContainer">
            <div className="buttonWrapper">
              {!result && (
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? "Extracting..." : "Extract Text"}
                </button>
              )}
              
              {file && (
                <button type="button" className="resetButton" onClick={handleReset}>
                  Clear
                </button>
              )}
            </div>
          </div>
        </form>

        {result && (
          <div className="resultContainer">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>Extracted Text:</h3>
              <button onClick={handleCopy} className="copyButton">
                {copied ? "" : <AiOutlineCopy size={18} />} {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="resultText">{result}</pre>

            <div className="textDownloadButtons">
              <button onClick={() => downloadAs("txt")}>Download as TXT</button>
            </div>
          </div>
        )}
      </div>
        <HowItWorks />
        <FAQ /> 
    </div>
  );
}
