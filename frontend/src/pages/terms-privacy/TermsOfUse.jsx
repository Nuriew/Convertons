import React from 'react';
import './TermsPrivacy.css';

const TermsOfUse = () => {
  return (
    <div className="contextContainer">
      <h1 style={{ textAlign: 'center' }}>Terms of Use</h1>
      <div className="contextBar">
        <p className="date">Effective Date: May 30, 2025</p>

        <p>
          By using <strong>convertons.com</strong>, you agree to the following terms and conditions.
        </p>

        <h2>1. Use of Service</h2>
        <p>
          Our platform allows you to convert video, image, and document files into various formats. You are responsible for ensuring that the files you upload are lawful and that you have the appropriate rights to use them. The service is provided free of charge, and we do not guarantee uninterrupted availability.
        </p>

        <h2>2. User Responsibilities</h2>
        <ul>
          <li>You must not use the service for illegal, harmful, or abusive activities.</li>
          <li>You may not upload content protected by copyright unless you have permission.</li>
          <li>You are solely responsible for the files you upload and the outputs you generate.</li>
        </ul>

        <h2>3. Disclaimer</h2>
        <p>
          <strong>convertons.com</strong> is not liable for any data loss, service downtime, or damages resulting from the use of the service. We do not guarantee the accuracy, quality, or completeness of the converted content.
        </p>

        <h2>4. Service Modifications</h2>
        <p>
          We reserve the right to change, suspend, or terminate the service at any time without prior notice.
        </p>

        <h2>5. Changes to Terms</h2>
        <p>
          These terms may be updated without notice. You are responsible for reviewing this page regularly to stay informed of any changes.
        </p>
      </div>
    </div>
  );
};

export default TermsOfUse;
