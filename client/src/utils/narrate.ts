import { franc } from 'franc';


const getVoicesForLanguage = (language: string) => {
  const v = speechSynthesis.getVoices().filter(voice => voice.lang.startsWith(language));
  return v;
};

const detectLanguage = (text: string) => {
  // todo: setup for languages - it doesn't always detect correctly
  const languageMap: { [key: string]: string } = {
    'eng': 'en-US',
    'rus': 'ru-RU',
    // 'spa': 'es-ES',
    // 'fra': 'fr-FR',
    // 'deu': 'de-DE',
  };
  let langCode = franc(text, { minLength: 3 });
  return languageMap[langCode] || 'en-US';
};

export function speakAll(text: string[], cb?: () => void, lang?: string) {
  speechSynthesis.cancel();
  const volume = (window.app.userSettings.globalVolume ?? 100) / 100;
  const rate = (window.app.userSettings.globalNarrateRate ?? 100) / 100;
  const n = text.length;

  text.forEach((t, ii) => {
    const utterance = new SpeechSynthesisUtterance(t);
    utterance.volume = volume ?? 1;
    utterance.rate = rate ?? 1;

    // set language
    const language = lang || detectLanguage(t);
    const voices = getVoicesForLanguage(language);
    if (voices.length > 0) {
      utterance.voice = voices[0];
    }
  
    if (cb && ii === n - 1) {
      utterance.onend = cb;
    }
    speechSynthesis.speak(utterance);
  });
}