export interface PlantData {
    commonName: string;
    scientificName: string;
    description: string;
    benefits: string[];
    habitat: string;
}

export type AnalysisResult = {
    isPlant: true;
    data: PlantData;
} | {
    isPlant: false;
    message: string;
};
