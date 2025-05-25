import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const faqItems = [
    {
      question: "What file types do you support?",
      answer:
        "Video → MP3: Popular video formats such as MP4, MOV, AVI, and MKV are supported.\nImage → Text: Text can be extracted from images like JPG, JPEG and WEBP.\nDocument → PDF: Files such as DOC, DOCX, XLS, XLSX and TXT can be converted to PDF.",
    },
    {
      question: "How long does the conversion take?",
      answer:
        "Most files are converted within a few seconds. However, larger files or slower internet connections may take longer.",
    },
    {
      question: "Are my uploaded files secure?",
      answer:
        "Yes. Your files are processed temporarily for conversion purposes only and are completely deleted from the system shortly after.",
    },
    {
      question: "Is this service free?",
      answer: "Yes, convertons.com is completely free to use.",
    },
    {
      question: "Why did the conversion fail?",
      answer:
        "The file type might not be supported, the file size could be too large, or there may have been a temporary issue with your internet connection.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      {faqItems.map((item, index) => (
        <div
          className={`faq-item ${openIndex === index ? 'open' : ''}`}
          key={index}
        >
          <div className="faq-question" onClick={() => toggleIndex(index)}>
            <span>{item.question}</span>
            <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
          </div>
          {openIndex === index && (
            <div className="faq-answer">
              {item.answer.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
