import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Navbar from './components/navbar/Navbar';
import ConvertPDF from './pages/convertPDF/ConvertPDF';
import ImageToText from './pages/imageText/ImageToText';
import Footer from './components/footer/Footer';
import Contact from './pages/contact/Contact';
import PrivacyPolicy from './pages/terms-privacy/PrivacyPolicy';
import TermsOfUse from './pages/terms-privacy/TermsOfUse';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/video-to-mp3" element={<Home />} />
          <Route path="/convert-to-pdf" element={<ConvertPDF />} />
          <Route path="/image-to-text" element={<ImageToText />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
