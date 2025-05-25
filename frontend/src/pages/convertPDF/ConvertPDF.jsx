import React, { useState } from 'react';
import { MdAddBox } from "react-icons/md";
import './ConvertPDF.css';
import './ConvertPDFres.css';
import FAQ from '../../components/faq/FAQ.jsx';
import HowItWorks from '../../components/how-works/HowItWorks';

const ConvertPDF = () => {
    const [file, setFile] = useState(null);
    const [pdfURL, setPdfURL] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setPdfURL(null);
    };

const MAX_FILE_SIZE_MB = 10;

const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    setErrorMessage('');
    setPdfURL(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:8000/api/convert-to-pdf', {
            method: 'POST',
            body: formData
        });

        if (response.status === 413) {
            setErrorMessage(`Please try uploading a smaller file (max ${MAX_FILE_SIZE_MB}MB).`);
            return;
        }

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                setErrorMessage(errorData.error || "An error occurred.");
            } else {
                setErrorMessage("An unexpected response was received from the server.");
            }
            return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfURL(url);
    } catch (error) {
        setErrorMessage(`Please try uploading a smaller file (max ${MAX_FILE_SIZE_MB}MB).`);
        console.error('Conversion error:', error);
    } finally {
        setIsConverting(false);
    }
};

    const getShortFileName = (name) => {
        const maxLength = 30;
        return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
    };

    const handleReset = () => {
        setFile(null);
        setPdfURL(null);
        setIsConverting('');
    };

    return (
        <div className="pdfContainer">
            <h1>Convert File to PDF</h1>
            <div className="pdfConvertBar">
                <b>DOC, DOCX, XLS, XLSX and TXT files are supported</b><br />

                <input
                    type="file"
                    className="pdfInput"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    id="file"
                    accept=".doc,.docx,.xls,.xlsx,.txt"
                />

                <label className="pdfLabel" htmlFor="file">
                    {file ? getShortFileName(file.name) : <MdAddBox />} {file ? '' : 'Click to upload file'}
                </label>


                {errorMessage && <p className='errorMessage'>{errorMessage}</p>}


                <div className="buttonContainer">
                  <div className="buttonWrapper">
                    {!pdfURL && (
                        <button onClick={handleConvert} disabled={!file || isConverting} style={{ marginBottom: '10px' }}>
                            {isConverting ? 'Converting...' : 'Convert to PDF'}
                        </button>
                    )}

                    {pdfURL && (
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <div style={{ width: '220px', marginBottom: '10px' }}>
                                <a href={pdfURL} download="converted.pdf" className="downloadButtons">
                                    <button>Download PDF</button>
                                </a>
                            </div>
                        </div>
                    )}

                    {file && (
                        <button type="button" className="resetButton" onClick={handleReset}>
                            Clear
                        </button>
                    )}
                  </div>
                </div>
            </div>

            <HowItWorks />
            <FAQ />
        </div>
    );
};

export default ConvertPDF;
