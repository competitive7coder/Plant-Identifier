import { GoogleGenAI, Type } from "@google/genai";
import type { PlantData, AnalysisResult } from "../types";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzePlantImage = async (imageFile: File): Promise<AnalysisResult> => {
    const modelName = 'gemini-flash-latest';
    const apiKey = import.meta.env.VITE_API_KEY;

    if (!apiKey) {
        throw new Error("VITE_API_KEY is not set. Please create a .env file in the project root and add VITE_API_KEY=YOUR_API_KEY.");
    }
    
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert botanist. Identify the plant in this image. Provide its details. If the image is not a plant or is unclear, set the isPlant property to false and provide placeholder text.`;
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            commonName: { type: Type.STRING, description: "Common name of the plant." },
            scientificName: { type: Type.STRING, description: "Scientific name of the plant." },
            description: { type: Type.STRING, description: "A brief paragraph about the plant's characteristics." },
            benefits: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of key benefits or common uses." },
            habitat: { type: Type.STRING, description: "Where this plant is typically found." },
            isPlant: { type: Type.BOOLEAN, description: "True if the image contains a plant, false otherwise." },
        },
        required: ["commonName", "scientificName", "description", "benefits", "habitat", "isPlant"]
    };

    try {
        const imagePart = await fileToGenerativePart(imageFile);
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: modelName,
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema,
            }
        });

        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);

        if (!data.isPlant) {
            return {
                isPlant: false,
                message: "The uploaded image does not appear to be a plant or could not be clearly identified. Please try a different photo."
            };
        }

        const plantData: PlantData = {
            commonName: data.commonName,
            scientificName: data.scientificName,
            description: data.description,
            benefits: data.benefits,
            habitat: data.habitat,
        };

        return {
            isPlant: true,
            data: plantData
        };

    } catch (error) {
        console.error("Error analyzing image with Gemini:", error);
        if (error instanceof SyntaxError) {
             throw new Error(`Failed to parse the response from the AI. It might be an issue with the image. Please try another one.`);
        }
        if (error instanceof Error) {
            throw new Error(`${error.message}`);
        }
        throw new Error("An unknown error occurred while analyzing the image.");
    }
};
