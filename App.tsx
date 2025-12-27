import React, { useState, useCallback, useRef, ChangeEvent, DragEvent } from 'react';
import { analyzePlantImage } from './services/geminiService';
import type { PlantData } from './types';
import { LeafIconSolid, UploadIcon, SpinnerIcon } from './components/icons';

// Component to display plant data, memoized for performance.
const ResultDisplay: React.FC<{ data: PlantData }> = React.memo(({ data }) => (
    <div className="space-y-4 text-left animate-fade-in">
        <div>
            <h3 className="text-2xl font-bold text-green-800">{data.commonName || "N/A"}</h3>
            <p className="text-md italic text-gray-600">{data.scientificName || "N/A"}</p>
        </div>
        <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-1">Description</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{data.description || "No description available."}</p>
        </div>
        <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-2">Benefits & Uses</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                {data.benefits?.length > 0 ? data.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                )) : <li>No benefits listed.</li>}
            </ul>
        </div>
        <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-1">Habitat & Origin</h4>
            <p className="text-gray-600 text-sm">{data.habitat || "Habitat information not available."}</p>
        </div>
    </div>
));
ResultDisplay.displayName = "ResultDisplay";


const App: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<PlantData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setAnalysisResult(null);
            setError(null);
            setWarning(null);
        } else {
            setError("Please select a valid image file (e.g., PNG, JPG).");
            if(fileInputRef.current) fileInputRef.current.value = "";
            setImageFile(null);
            setPreviewUrl(null);
        }
    };

    const onFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            handleFileChange(files[0]);
        }
    };

    const onDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileChange(files[0]);
        }
    };

    const triggerFileSelect = () => fileInputRef.current?.click();
    
    const handleAnalyze = useCallback(async () => {
        if (!imageFile) {
            setError("Please upload an image first.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setWarning(null);
        setAnalysisResult(null);
        try {
            const result = await analyzePlantImage(imageFile);
            // FIX: Use the 'in' operator to correctly narrow the discriminated union type `AnalysisResult`.
            if ("data" in result) {
                setAnalysisResult(result.data);
            } else {
                setWarning(result.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [imageFile]);

    const handleReset = () => {
        imageFile && previewUrl && URL.revokeObjectURL(previewUrl);
        setImageFile(null);
        setPreviewUrl(null);
        setAnalysisResult(null);
        setError(null);
        setWarning(null);
        setIsLoading(false);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    return (
        <div className="bg-green-50 min-h-screen text-gray-800 font-sans">
            <header className="bg-white shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
                    <LeafIconSolid className="w-8 h-8 text-green-600 mr-3" />
                    <h1 className="text-2xl font-bold text-green-800">Plant Identifier AI</h1>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col space-y-6">
                        <h2 className="text-xl font-semibold text-gray-700">1. Upload a Plant Photo</h2>
                        {!previewUrl ? (
                             <div 
                                onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onClick={triggerFileSelect}
                                className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer transition-colors ${isDragging ? 'border-green-500 bg-green-100' : 'border-gray-300 hover:border-green-400'}`}>
                                <UploadIcon className="w-12 h-12 text-gray-400 mb-2" />
                                <p className="text-gray-500 text-center"><span className="font-semibold text-green-600">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP, etc.</p>
                                <input type="file" ref={fileInputRef} onChange={onFileSelect} className="hidden" accept="image/*" />
                             </div>
                        ) : (
                            <div className="w-full space-y-4">
                                <div className="w-full h-64 relative rounded-lg overflow-hidden border bg-gray-100">
                                    <img src={previewUrl} alt="Plant preview" className="w-full h-full object-contain" />
                                </div>
                                <button onClick={handleReset} className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium">Choose Another Photo</button>
                            </div>
                        )}
                        <button onClick={handleAnalyze} disabled={!imageFile || isLoading} className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 text-lg">
                            {isLoading ? (<> <SpinnerIcon className="w-5 h-5 mr-3" /> Analyzing... </>) : ( 'Analyze Plant' )}
                        </button>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">2. AI Analysis</h2>
                        <div className="bg-gray-50 p-4 rounded-lg min-h-[360px] max-w-none flex flex-col justify-center">
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <SpinnerIcon className="w-10 h-10 text-green-600 animate-spin" />
                                    <p className="mt-4 text-gray-600">Gemini is identifying your plant...</p>
                                    <p className="text-sm text-gray-500">This might take a moment.</p>
                                </div>
                            )}
                            {error && (
                                <div className="text-red-600 bg-red-100 p-4 rounded-md text-center">
                                    <h3 className="font-bold mb-2">Analysis Failed</h3>
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}
                            {warning && (
                                <div className="text-amber-700 bg-amber-100 p-4 rounded-md text-center">
                                    <h3 className="font-bold mb-2">Identification Unsuccessful</h3>
                                    <p className="text-sm">{warning}</p>
                                </div>
                            )}
                            {analysisResult && <ResultDisplay data={analysisResult} />}
                            {!isLoading && !error && !warning && !analysisResult && (
                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 px-4">
                                   <LeafIconSolid className="w-16 h-16 text-gray-300 mb-4"/>
                                   <p>Your plant's details will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;