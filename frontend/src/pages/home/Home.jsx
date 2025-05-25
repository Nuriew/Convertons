import { useState, useRef, useEffect } from 'react';
import { MdAddBox } from "react-icons/md";
import './Home.css';
import './HomeResponsive.css';
import FAQ from '../../components/faq/FAQ.jsx';
import HowItWorks from '../../components/how-works/HowItWorks';

const Home = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [audioURL, setAudioURL] = useState(null);
    const [fileName, setFileName] = useState('');
    const [isConverting, setIsConverting] = useState(false);
    const [videoPreviewURL, setVideoPreviewURL] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const audioRef = useRef(null);
    const videoRef = useRef(null);

    const MAX_FILE_SIZE_MB = 50;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                setErrorMessage(`Dosya çok büyük! En fazla ${MAX_FILE_SIZE_MB} MB yükleyebilirsiniz.`);
                return;
            }

            setVideoFile(file);
            setErrorMessage('');

            const shortName = file.name;
            setFileName(shortName.length > 60 ? shortName.slice(0, 60) + "..." : shortName);

            setAudioURL(null);
            const previewURL = URL.createObjectURL(file);
            setVideoPreviewURL(previewURL);
        }
    };

const handleConvert = async () => {
    if (!videoFile) return;

    setIsConverting(true);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', videoFile);

    try {
        const response = await fetch('/api/video-to-mp3', {
            method: 'POST',
            body: formData
        });

        if (response.status === 413) {
            setErrorMessage("Please try uploading a smaller file (max 50MB).");
            return;
        }

        if (!response.ok) {
            setErrorMessage("An error occurred. Please try again.");
            return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
    } catch (error) {
        setErrorMessage("Please try uploading a smaller file (max 50MB).");
        console.error('Conversion error:', error);
    } finally {
        setIsConverting(false);
    }
};

    useEffect(() => {
        const audio = audioRef.current;
        const video = videoRef.current;

        if (audio && video) {
            const handlePlay = () => {
                video.currentTime = audio.currentTime;
                video.play();
            };

            const handlePause = () => {
                video.pause();
            };

            const handleSeek = () => {
                video.currentTime = audio.currentTime;
            };

            audio.addEventListener('play', handlePlay);
            audio.addEventListener('pause', handlePause);
            audio.addEventListener('seeked', handleSeek);
            audio.addEventListener('timeupdate', handleSeek);

            return () => {
                audio.removeEventListener('play', handlePlay);
                audio.removeEventListener('pause', handlePause);
                audio.removeEventListener('seeked', handleSeek);
                audio.removeEventListener('timeupdate', handleSeek);
            };
        }
    }, [audioURL]);

    const handleReset = () => {
        setVideoFile(null);
        if (audioURL) {
            URL.revokeObjectURL(audioURL);
        }
        setAudioURL(null);

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
            audioRef.current.load();
        }

        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.src = '';
            videoRef.current.load();
        }

        if (videoPreviewURL) {
            URL.revokeObjectURL(videoPreviewURL);
        }
        setVideoPreviewURL(null);
        setFileName('');
        setErrorMessage('');
        setIsConverting(false);
    };

    return (
        <div className="homeContainer">
            <h1>Video to MP3</h1>
            <div className="uploadContainer">
                <div className="uploadBar">
                    {!videoFile && (
                        <>
                            <input
                                type="file"
                                className='videotomp3Input'
                                id="file"
                                accept=".mp4,.mkv,.mov,.avi"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="file" className='videotomp3Label'><MdAddBox /> Click to upload file</label>
                        </>
                    )}

                    {videoPreviewURL && (
                        <div className="videoPreview">
                            <video
                                ref={videoRef}
                                src={videoPreviewURL}
                                muted
                                width={"99.9%"}
                                height="176px"
                                controls={false}
                                onContextMenu={(e) => e.preventDefault()}
                                controlsList="nodownload nofullscreen noremoteplayback"
                            />
                        </div>
                    )}

                    <div className="convertContainer">
                        {fileName && <div className="audioName"><b>File Name:</b> {fileName}</div>}

                        <div className="audioBar">
                            <audio ref={audioRef} controls src={audioURL}></audio>
                        </div>

                    {errorMessage && (
                        <div  style={{ color: 'red', fontSize: '12px', marginTop: '10px', fontWeight: 'bold', textAlign: 'center' }}>
                            {errorMessage}
                        </div>
                    )}

                        <div className="audioButtonBar">
                            <div className="audioButtons">
                                {!audioURL && (
                                    <button
                                        className='videotomp3Button'
                                        onClick={handleConvert}
                                        disabled={!videoFile || isConverting}
                                    >
                                        {isConverting ? 'Converting...' : 'Convert'}
                                    </button>
                                )}

                                {videoFile && (
                                    <button type="button" className="resetButton" onClick={handleReset}>
                                        Clear
                                    </button>
                                )}

                                {audioURL && (
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                        <a href={audioURL} download="convertons-com.mp3" className='downloadButtons'>
                                            <button>Download MP3</button>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>        
                </div>
            </div>
            <HowItWorks />
            <FAQ />
        </div>
    );
};

export default Home;
