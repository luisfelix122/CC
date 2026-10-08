const KEY = 'nd.device_id';

export function getDeviceId(): string {
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

export const aiSettings = {
  get key() {
    return localStorage.getItem('nd.gemini_key') ?? '';
  },
  set key(v: string) {
    localStorage.setItem('nd.gemini_key', v.trim());
  },
  get model() {
    return localStorage.getItem('nd.gemini_model') || 'gemini-2.5-flash';
  },
  set model(v: string) {
    localStorage.setItem('nd.gemini_model', v.trim());
  },
};
