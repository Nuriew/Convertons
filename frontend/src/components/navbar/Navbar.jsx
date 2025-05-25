import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import './NavbarResponsive.css';

const Navbar = () => {
    return (
        <div className="header">
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <nav>
                    <Link to="/" className="logo" translate='no'><img src="/assets/logo.png" alt="logo" width={25} /> CONVERT<b translate='no' style={{ color: "rgb(0, 129, 227)" }}>ONS</b></Link>
                    <ul className="nav-links" >
                        <li><Link to="/video-to-mp3" translate='no'>Home</Link></li>
                        <li><Link to="/terms-of-use">Terms of Use</Link></li>
                        <li><Link to="/contact-us">Contact Us</Link></li>
                    </ul>
                </nav>
            </div>

            <div className='menuContainer'>
                <ul className='menuBar' translate='no'>
                    <li><Link to="/video-to-mp3"><img src="/assets/mp3.png" alt='mp3' width={27} /> Video to MP3</Link></li>
                    <li><Link to="/convert-to-pdf"><img src="/assets/pdf.png" alt='pdf' width={27} />Convert to PDF</Link></li>
                    <li><Link to="/image-to-text"><img src="/assets/txt.png" alt='gif' width={27} />Image to TEXT</Link></li>
                </ul>
            </div>
            
        </div>
    );
}

export default Navbar;