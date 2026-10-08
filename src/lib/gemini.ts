import { aiSettings } from './device';
import type { FoodItem, Macros } from './types';

export interface ImageData {
  mime: string;
  base64: string;
}

export interface LabelEstimate {
  enough: boolean;
  missing: string;
  name: string;
  per100g: Macros;
  suggested_grams: number;
}

export interface PlateEstimate {
  name: string;
  items: FoodItem[];
  notes: string;
}

const MACRO_PROPS = {
  kcal: { type: 'NUMBER' },
  protein_g: { type: 'NUMBER' },
  carbs_g: { type: 'NUMBER' },
  fat_g: { type: 'NUMBER' },
};
const MACRO_REQ = ['kcal', 'protein_g', 'carbs_g', 'fat_g'];

const LABEL_SCHEMA = {
  type: 'OBJECT',
  properties: {
    enough: { type: 'BOOLEAN' },
    missing: { type: 'STRING' },
    name: { type: 'STRING' },
    per100g: { type: 'OBJECT', properties: MACRO_PROPS, required: MACRO_REQ },
    suggested_grams: { type: 'NUMBER' },
  },
  required: ['enough', 'missing', 'name', 'per100g', 'suggested_grams'],
};

const PLATE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    name: { type: 'STRING' },
    notes: { type: 'STRING' },
    items: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: { name: { type: 'STRING' }, grams: { type: 'NUMBER' }, ...MACRO_PROPS },
        required: ['name', 'grams', ...MACRO_REQ],
      },
    },
  },
  required: ['name', 'items', 'notes'],
};

async function generate<T>(prompt: string, images: ImageData[], schema: object): Promise<T> {
  const key = aiSettings.key;
  if (!key) throw new Error('Configura tu API key de Gemini en Ajustes.');
  const model = encodeURIComponent(aiSettings.model);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            ...images.map((i) => ({ inline_data: { mime_type: i.mime, data: i.base64 } })),
          ],
        },
      ],
      generationConfig: { responseMimeType: 'application/json', responseSchema: schema },
    }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.error?.message ?? `Error de Gemini (${res.status})`);
  const text: string | undefined = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('La IA no devolvió resultado. Intenta con otra foto.');
  return JSON.parse(text) as T;
}

const LABEL_PROMPT = `Eres nutricionista. Analiza la(s) foto(s) de un producto envasado.
Decide si con ellas se puede conocer su valor calórico y nutricional con confianza.
- Si se ve la tabla nutricional, o el producto es inequívoco y muy conocido: enough=true; llena name,
  per100g (kcal, proteína, carbohidratos y grasa por 100 g o 100 ml) y suggested_grams (porción típica o contenido neto).
- Si NO basta: enough=false y en "missing" indica en español, en una frase, qué foto adicional necesitas
  (por ejemplo: "Toma una foto de la tabla de información nutricional del reverso"). Igual da tu mejor estimación.
Responde solo JSON.`;

export function analyzeLabel(images: ImageData[]): Promise<LabelEstimate> {
  return generate<LabelEstimate>(LABEL_PROMPT, images, LABEL_SCHEMA);
}

export function analyzePlate(images: ImageData[], description: string): Promise<PlateEstimate> {
  const prompt = `Eres nutricionista. Estima las calorías del plato de la foto.
Descripción del usuario: ${JSON.stringify(description)}.
Desglosa en ingredientes visibles con gramos estimados y kcal/macros correspondientes a ESOS gramos.
name: nombre corto del plato en español. notes: supuestos relevantes en una frase. Responde solo JSON.`;
  return generate<PlateEstimate>(prompt, images, PLATE_SCHEMA);
}

export function fileToImage(file: File, max = 1024): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(img.src);
      resolve({ mime: 'image/jpeg', base64: canvas.toDataURL('image/jpeg', 0.85).split(',')[1] });
    };
    img.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    img.src = URL.createObjectURL(file);
  });
}
