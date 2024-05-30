export function getBrowserName() {
  
}

function isChrome() {
  const userAgent = navigator.userAgent;
  const isChromium = userAgent.indexOf('Chrome') > -1 || userAgent.indexOf('CriOS') > -1; // CriOS is Chrome on iOS
  const isSafari = userAgent.indexOf('Safari') > -1;
  const isOpera = userAgent.indexOf('OPR') > -1 || userAgent.indexOf('Opera') > -1;
  const isEdge = userAgent.indexOf('Edg') > -1 || userAgent.indexOf('Edge') > -1;

  if (isChromium && isSafari && !isOpera && !isEdge) {
    return true;
  }
  return false;
}

export function getNarrateSupported() {
  return isChrome();
}