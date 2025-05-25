import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState(null); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            setStatus(result.detail);
        } catch (error) {
            setStatus('Message could not be sent. Try again later.');
            console.error(error);
        }

        setFormData({ name: '', email: '', message: '' }); // formu sıfırla
    };

    return (
        <div className='contactContainer'>
            <div className='contactHeader'>
                <h1>Contact Us</h1>
                <p>Please feel free to send us your suggestions or complaints. We will respond as soon as possible.</p>
            </div>
            <div className='contactForm'>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="message"
                        placeholder="Message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    ></textarea>
                    <button type="submit">Send</button>
                </form>
                {status && <p style={{ marginTop: '10px', color: 'green' }}>{status}</p>}
            </div>
        </div>
    );
};

export default Contact;