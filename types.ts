export interface VisualStyleTemplate {
  artStyle: string;
  lighting: string;
  colorPalette: string[];
  cameraAngle: string;
  texture: string;
  backgroundDetail: string;
  characterDesign: string;
  mood: string;
}

export interface ScriptStyleTemplate {
  narrativeTone: string;
  sceneStructure: string;
  emotionalPacing: string;
  dialogueFormat: string;
  transitions: string;
  sceneLength: string;
  voiceOverTone: string;
}

export interface GeneratedScene {
  sceneNumber: number;
  script: string;
  imagePrompt: string;
  animationPrompt: string;
  voiceOver: string;
}

export interface ProjectSettings {
  title: string;
  sceneCount: number;
  characters?: string;
}

export enum AppStep {
  UPLOAD_IMAGE = 1,
  PASTE_SCRIPT = 2,
  GENERATE_PROJECT = 3,
  OUTPUT = 4
}
