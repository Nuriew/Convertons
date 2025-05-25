import React from 'react';
import './TermsPrivacy.css';

const PrivacyPolicy = () => {
  return (
    <div className="contextContainer">
      <h1 style={{ textAlign: 'center' }}>Privacy Policy</h1>
      <div className="contextBar">
        <p className="date">Last Updated: May 30, 2025</p>

        <p>
          At <strong>convertons.com</strong>, we respect your privacy. This Privacy Policy explains what data we collect, how we use it, and how we protect it.
        </p>

        <h2>1. Information We Collect</h2>
        <ul>
          <li>
            <strong>Contact Information:</strong> If you contact us, we may collect your name and email address for communication purposes.
          </li>
          <li>
            <strong>Uploaded Files:</strong> Files are temporarily stored on our servers for conversion and are automatically deleted within 10 minutes after processing.
          </li>
          <li>
            <strong>Rate Limiting Data:</strong> To prevent abuse, we may implement request-limiting mechanisms. However, we do not log or store user IP addresses permanently.
          </li>
        </ul>

        <h2>2. Data Sharing</h2>
        <p>Your personal data is not sold or shared with third parties, except if required by law.</p>

        <h2>3. File Security</h2>
        <p>
          Files are processed on secure servers and deleted automatically after conversion. While we take reasonable security measures, no method of transmission over the internet is 100% secure.
        </p>

        <h2>4. External Links</h2>
        <p>
          Our website may contain links to external sites. We are not responsible for the privacy practices or content of those sites.
        </p>

        <h2>5. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Users are encouraged to review this page periodically for any changes.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
