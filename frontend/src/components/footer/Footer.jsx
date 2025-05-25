import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
            <div className='footerLine'></div>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-use">Terms of Use</Link>
            <Link to="/contact-us">Contact Us</Link>

            <p>&copy; 2025 Convertons. All rights reserved.</p>
        </footer>
    );
}

export default Footer;
