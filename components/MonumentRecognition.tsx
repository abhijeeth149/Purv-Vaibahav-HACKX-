import React, { useState, useRef, useCallback } from 'react';
import { identifyMonument } from '../services/geminiService';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Spinner } from './common/Spinner';

interface MonumentRecognitionProps {
    onRecognitionSuccess: (monumentName: string) => void;
}

const MonumentRecognition: React.FC<MonumentRecognitionProps> = ({ onRecognitionSuccess }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (file.size > 10 * 1024 * 1024) {
                setError("File size exceeds 10MB limit.");
                return;
            }
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError(null);
            if (isCameraOpen) stopCamera();
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCameraOpen(true);
            setPreviewUrl(null);
            setImageFile(null);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access the camera. Please check permissions.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
        setIsCameraOpen(false);
    };
    
    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            
            canvas.toBlob(blob => {
                if (blob) {
                    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                    setImageFile(file);
                    setPreviewUrl(URL.createObjectURL(file));
                }
            }, 'image/jpeg');
            stopCamera();
        }
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1];
                resolve(base64String);
            };
            reader.onerror = error => reject(error);
        });
    };
    
    const handleIdentify = async () => {
        if (!imageFile) {
            setError("Please select an image first.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const base64Image = await convertFileToBase64(imageFile);
            const result = await identifyMonument(base64Image, imageFile.type);
            onRecognitionSuccess(result);
        } catch (err: any) {
            setError(err.message || "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const triggerFileUpload = () => fileInputRef.current?.click();

    return (
        <div>
            <h2 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 dark:from-primary-400 dark:to-secondary-400 mb-2">Monument Recognition</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Upload a photo or use your camera to identify an Indian monument.</p>
            
            <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div 
                        className="relative w-full h-80 rounded-lg flex items-center justify-center overflow-hidden bg-gray-500/10 cursor-pointer group"
                        onClick={!isCameraOpen && !previewUrl ? triggerFileUpload : undefined}
                    >
                        {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />}
                        {isCameraOpen && <video ref={videoRef} autoPlay className="w-full h-full object-cover"></video>}
                        {!previewUrl && !isCameraOpen && (
                           <div className="text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-xl w-full h-full flex flex-col justify-center items-center transition-all duration-300 group-hover:border-primary-500 group-hover:bg-primary-500/10">
                               <i className="ph-bold ph-om text-6xl mb-2 transition-transform duration-300 group-hover:scale-110 text-secondary-500"></i>
                               <p className="font-semibold text-lg">Namaste!</p>
                               <p>Click to upload an image</p>
                               <p className="text-sm mt-2">PNG, JPG, JPEG up to 10MB</p>
                           </div>
                        )}
                        <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>
                    
                    <div className="flex flex-col space-y-4">
                         <h3 className="text-xl font-bold text-center">Choose an Option</h3>
                        <input type="file" accept="image/jpeg, image/png, image/jpg" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        
                        <div className="grid grid-cols-2 gap-4">
                             <Button onClick={triggerFileUpload} icon={<i className="ph-bold ph-upload-simple"></i>} variant="secondary">
                                Upload
                            </Button>
                            
                            {isCameraOpen ? (
                                 <Button onClick={capturePhoto} icon={<i className="ph-bold ph-camera-rotate"></i>} variant="secondary">Capture</Button>
                            ) : (
                                <Button onClick={startCamera} variant="secondary" icon={<i className="ph-bold ph-camera"></i>}>
                                    Use Camera
                                </Button>
                            )}
                        </div>

                        {isCameraOpen && <Button onClick={stopCamera} variant="danger" icon={<i className="ph-bold ph-x-circle"></i>} className="w-full">Close Camera</Button>}
                        
                        {error && <p className="text-red-500 dark:text-red-400 text-sm bg-red-500/10 dark:bg-red-400/10 p-2 rounded-lg text-center">{error}</p>}
                        
                        <Button onClick={handleIdentify} isLoading={isLoading} disabled={!imageFile || isLoading} className="w-full py-3 text-base">
                            {isLoading ? 'Identifying...' : 'Identify Monument'}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default MonumentRecognition;