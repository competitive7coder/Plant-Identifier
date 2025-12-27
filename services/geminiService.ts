import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AnalysisResult, PlantData } from "../types";

const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
  throw new Error("VITE_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzePlantImage(
  imageFile: File
): Promise<AnalysisResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const base64Image = await fileToBase64(imageFile);

  const prompt = `
You are a plant identification expert.

If the image is a plant, respond ONLY with valid JSON:
{
  "commonName": "",
  "scientificName": "",
  "description": "",
  "benefits": [],
  "habitat": ""
}

If it is NOT a plant, respond ONLY with:
{ "error": "Not a plant" }
`;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: imageFile.type,
          data: base64Image,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    if (!text) {
      return {
        isPlant: false,
        message: "Empty response from AI",
      };
    }

    const cleanedText = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanedText);

    if (parsed.error) {
      return {
        isPlant: false,
        message: "The image does not appear to be a plant",
      };
    }

    return {
      isPlant: true,
      data: parsed as PlantData,
    };
  } catch (error) {
    console.error("Analysis Error:", error);
    return {
      isPlant: false,
      message: error instanceof Error ? error.message : "Failed to analyze image",
    };
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result.split(",")[1]);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}