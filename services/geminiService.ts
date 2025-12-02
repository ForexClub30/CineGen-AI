import { GoogleGenAI, Type } from "@google/genai";
import { VisualStyleTemplate, ScriptStyleTemplate, GeneratedScene, ProjectSettings } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeVisualRef = async (base64Image: string, mimeType: string): Promise<VisualStyleTemplate> => {
  const model = "gemini-2.5-flash"; // Capable of multimodal analysis

  const prompt = `Analyze this reference image. Extract the art style, lighting, colors, framing, textures, character design, and mood. 
  Your goal is to create a visual style template for future image generation.
  Return JSON only.`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          artStyle: { type: Type.STRING },
          lighting: { type: Type.STRING },
          colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
          cameraAngle: { type: Type.STRING },
          texture: { type: Type.STRING },
          backgroundDetail: { type: Type.STRING },
          characterDesign: { type: Type.STRING },
          mood: { type: Type.STRING },
        },
        required: ["artStyle", "lighting", "colorPalette", "cameraAngle", "texture", "backgroundDetail", "characterDesign", "mood"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as VisualStyleTemplate;
};

export const analyzeScriptRef = async (scriptText: string): Promise<ScriptStyleTemplate> => {
  const model = "gemini-2.5-flash";

  const prompt = `Analyze the following reference script. Extract the storytelling style, pacing, tone, structure, transitions, and dialogue style.
  Your goal is to create a script style template for future writing generation.
  
  SCRIPT:
  ${scriptText}
  
  Return JSON only.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          narrativeTone: { type: Type.STRING },
          sceneStructure: { type: Type.STRING },
          emotionalPacing: { type: Type.STRING },
          dialogueFormat: { type: Type.STRING },
          transitions: { type: Type.STRING },
          sceneLength: { type: Type.STRING },
          voiceOverTone: { type: Type.STRING },
        },
        required: ["narrativeTone", "sceneStructure", "emotionalPacing", "dialogueFormat", "transitions", "sceneLength", "voiceOverTone"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as ScriptStyleTemplate;
};

export const generateFullProject = async (
  visualStyle: VisualStyleTemplate,
  scriptStyle: ScriptStyleTemplate,
  settings: ProjectSettings
): Promise<GeneratedScene[]> => {
  const model = "gemini-2.5-flash"; // Using flash for speed/cost, switch to pro if logic is very complex

  const systemInstruction = `You are a Multi-Stage Cinematic AI. 
  You have been provided with a VISUAL STYLE TEMPLATE and a SCRIPT STYLE TEMPLATE.
  You must generate a project consisting of ${settings.sceneCount} scenes about "${settings.title}".
  
  Adhere strictly to these rules:
  1. Script: Match the tone, pacing, and formatting of the script template.
  2. Image Prompts: Match the art style, lighting, colors, and mood of the visual template.
  3. Animation Prompts: Describe camera movement and motion matching the visual style.
  4. Voice Over: Match the narrator's voice and flow from the script template.
  `;

  const prompt = `
  VISUAL STYLE TEMPLATE:
  ${JSON.stringify(visualStyle)}

  SCRIPT STYLE TEMPLATE:
  ${JSON.stringify(scriptStyle)}

  PROJECT DETAILS:
  Title: ${settings.title}
  Scenes: ${settings.sceneCount}
  Characters: ${settings.characters || "Create appropriate characters"}

  Generate the output as a JSON array of scenes.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            sceneNumber: { type: Type.INTEGER },
            script: { type: Type.STRING },
            imagePrompt: { type: Type.STRING },
            animationPrompt: { type: Type.STRING },
            voiceOver: { type: Type.STRING },
          },
          required: ["sceneNumber", "script", "imagePrompt", "animationPrompt", "voiceOver"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]') as GeneratedScene[];
};
