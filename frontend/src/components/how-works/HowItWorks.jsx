import React from 'react';
import './HowItWorks.css';

const steps = [
{
  title: "1. Upload Your File",
  description:
    "Choose the file you want to convert from your computer, phone, or tablet.",
},
{
  title: "2. Select Conversion Format",
  description:
    "Choose whether you want to convert video to audio, image to text, or document to PDF.",
},
{
  title: "3. Click the button to convert",
  description:
    "The system processes your file and prepares the result within seconds.",
},
{
  title: "4. Download Your File",
  description:
    "Securely download the converted file and start using it right away.",
},
];

const HowItWorks = () => {
  return (
    <div className="howContainer">
      <h2 className="how-title">How Does It Work?</h2>
      <div className="how-steps">
        {steps.map((step, index) => (
          <div className="how-step" key={index}>
 
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
