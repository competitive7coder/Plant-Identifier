// src/services/geminiService.ts

import { GoogleGenerativeAI } from "@google/genai";
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
If the image is a plant, respond with JSON:
{
  "commonName": "",
  "scientificName": "",
  "description": "",
  "benefits": [],
  "habitat": ""
}
If not a plant, respond with:
{ "error": "Not a plant" }
`;

  const result = await model.generateContent([
    { text: prompt },
    {
      inlineData: {
        mimeType: imageFile.type,
        data: base64Image,
      },
    },
  ]);

  if (!result || typeof result.response?.text !== "function") {
    return {
      isPlant: false,
      message: "Invalid response from AI",
    };
  }

  const text = result.response.text();

  if (!text) {
    return {
      isPlant: false,
      message: "Empty response from AI",
    };
  }

  try {
    const parsed = JSON.parse(text);

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
  } catch {
    return {
      isPlant: false,
      message: "Failed to parse AI response",
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
