import React, { useState, useRef } from 'react';
import { Product } from '../types';
import { Button } from './Button';
import { fileToBase64, urlToBase64, resizeImage } from '../utils/imageUtils';
import { generateTryOnImage } from '../services/geminiService';

interface TryOnModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
}

export const TryOnModal: React.FC<TryOnModalProps> = ({ isOpen, product, onClose }) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Simple validation
        if (file.size > 10 * 1024 * 1024) {
            setError("File size too large. Please upload an image under 10MB.");
            return;
        }
        const base64 = await fileToBase64(file);
        setUserImage(base64);
        setResultImage(null); // Clear previous result
        setError(null);
      } catch (err) {
        setError("Failed to read file.");
      }
    }
  };

  const handleGenerate = async () => {
    if (!userImage || !product) return;

    setIsGenerating(true);
    setError(null);

    try {
      // 1. Prepare User Image: Resize to ensure it doesn't exceed API token/size limits
      // This is crucial for reliability with high-res phone camera photos
      const optimizedUserImage = await resizeImage(userImage, 800, 800);

      // 2. Prepare Product Image
      const productBase64 = await urlToBase64(product.imageUrl);
      const optimizedProductImage = await resizeImage(productBase64, 800, 800);
      
      // 3. Construct a simplified visual description. 
      // Marketing fluff can confuse the AI, so we focus on visual traits.
      const productFullDescription = `${product.name} (${product.category}). Color: ${product.name.split(' ')[0] || 'match image'}. Style: ${product.description}`;

      // 4. Call Gemini Service with description
      const generatedImg = await generateTryOnImage(optimizedUserImage, optimizedProductImage, productFullDescription);
      
      setResultImage(generatedImg);
    } catch (err) {
      console.error("Generation failed:", err);
      setError("Generation failed. Please try again or use a clearer photo.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-900/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row rounded-sm">
        
        {/* Close Button (Mobile) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 md:hidden p-2 bg-white/80 rounded-full text-brand-900"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Left Side: Instructions & Upload */}
        <div className="w-full md:w-1/3 bg-brand-50 p-8 flex flex-col border-b md:border-b-0 md:border-r border-brand-200">
          <h2 className="font-serif text-2xl text-brand-900 mb-2">Virtual Fitting Room</h2>
          <p className="text-brand-600 mb-6 text-sm">
            See yourself in the <span className="font-semibold text-brand-800">{product.name}</span>.
          </p>

          {/* Selected Product Preview (Small) */}
          <div className="mb-6">
            <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">1. The Dress</label>
            <div className="p-3 bg-white shadow-sm border border-brand-100 flex items-center gap-4">
                <img src={product.imageUrl} alt={product.name} className="w-16 h-20 object-cover" />
                <div>
                <p className="font-serif text-sm text-brand-900 line-clamp-1">{product.name}</p>
                <p className="text-xs text-brand-500">${product.price.toFixed(2)}</p>
                </div>
            </div>
          </div>

          {/* Upload Control */}
          <div className="mt-2 flex-grow flex flex-col">
            <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">2. Your Photo</label>
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange} 
            />
            
            {!userImage ? (
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-brand-300 hover:border-brand-500 hover:bg-brand-100 transition-all flex flex-col items-center justify-center gap-2 text-brand-500 bg-white"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-sm font-medium uppercase tracking-wide">Upload Photo</span>
                </button>
            ) : (
                <div className="space-y-4 flex-grow flex flex-col">
                    {/* User Image Preview - using object-contain to respect portraits/landscape */}
                    <div className="relative w-full flex-grow min-h-[200px] bg-brand-100 border border-brand-200 flex items-center justify-center overflow-hidden">
                        <img 
                          src={userImage} 
                          alt="You" 
                          className="w-full h-full object-contain p-2" 
                        />
                        <button 
                            onClick={() => { setUserImage(null); setResultImage(null); }}
                            className="absolute top-2 right-2 bg-white/90 p-2 rounded-full hover:bg-white text-brand-900 transition-colors shadow-sm"
                        >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>

                    <Button 
                        onClick={handleGenerate} 
                        isLoading={isGenerating} 
                        className="w-full mt-auto"
                        disabled={isGenerating || !!resultImage}
                    >
                        {resultImage ? "Try Another Photo" : "Generate Try-On"}
                    </Button>
                    {resultImage && (
                         <button 
                         onClick={() => { setResultImage(null); }}
                         className="w-full text-xs uppercase tracking-widest text-brand-500 hover:text-brand-800 mt-2"
                     >
                         Reset Result
                     </button>
                    )}
                </div>
            )}
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded">
                <p className="text-red-600 text-xs text-center font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: The Result Area */}
        <div className="w-full md:w-2/3 bg-white p-4 md:p-8 flex flex-col items-center justify-center relative min-h-[400px] bg-[radial-gradient(#f2efe9_1px,transparent_1px)] [background-size:16px_16px]">
            
            {/* Close Button (Desktop) */}
            <button 
                onClick={onClose}
                className="hidden md:block absolute top-4 right-4 p-2 text-brand-400 hover:text-brand-900 transition-colors"
            >
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Main Display Area */}
            <div className="w-full h-full flex items-center justify-center">
                {!userImage ? (
                     <div className="text-center text-brand-300">
                        <svg className="w-24 h-24 mx-auto mb-4 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                        <p className="font-serif text-2xl opacity-40">Your fitting awaits</p>
                     </div>
                ) : (
                    <div className="relative w-full h-full max-h-[85vh] flex items-center justify-center">
                        {isGenerating ? (
                            <div className="flex flex-col items-center bg-white/80 p-8 rounded-lg backdrop-blur-sm shadow-xl">
                                <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                                <p className="font-serif text-lg text-brand-600 animate-pulse">Styling your look...</p>
                                <p className="text-xs text-brand-400 mt-2">Tailoring the dress to your photo</p>
                            </div>
                        ) : resultImage ? (
                            <div className="relative w-full h-full flex items-center justify-center animate-fade-in">
                                <img 
                                    src={resultImage} 
                                    alt="Virtual Try-On Result" 
                                    className="max-w-full max-h-[85vh] object-contain shadow-2xl"
                                />
                                <div className="absolute bottom-6 right-6 bg-white/90 px-4 py-2 text-xs font-bold tracking-widest text-brand-900 shadow-sm uppercase border border-brand-100">
                                    AI Generated Preview
                                </div>
                            </div>
                        ) : (
                            <div className="text-center opacity-50">
                                <p className="font-serif text-xl text-brand-800">Ready to style</p>
                                <p className="text-sm mt-2">Click "Generate Try-On" to see the result</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};