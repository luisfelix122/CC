const KEY = 'nd.device_id';

export function getDeviceId(): string {
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

/** Configuración de IA desde variables de entorno (no editable desde la UI). */
export const aiSettings = {
  key: (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) ?? '',
  model: (import.meta.env.VITE_GEMINI_MODEL as string | undefined) || 'gemini-3.8-flash',
};
