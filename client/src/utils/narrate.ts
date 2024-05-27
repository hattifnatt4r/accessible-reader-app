
export function speakAll(text: string[], cb?: () => void,) {
  speechSynthesis.cancel();
  const volume = (window.app.userSettings.globalVolume ?? 100) / 100;
  const n = text.length;

  text.forEach((t, ii) => {
    const utterance = new SpeechSynthesisUtterance(t);
    utterance.volume = volume ?? 1;
    if (cb && ii === n - 1) {
      utterance.onend = cb;
    }
    speechSynthesis.speak(utterance);
  });
}