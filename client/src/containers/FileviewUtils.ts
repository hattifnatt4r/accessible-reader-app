import { toJS } from "mobx";

export type TextVarType = { maxP: number, maxS: number, maxW: number, pID: number, sID: number, wID: number };
export type TextParagraphsType = string[];
export type SelectionTypeType = 'w' | 's' | 'p';

export function getParagraphs(text: string | null): string[] {
  if (!text) return [];
  const paragraphs = text.split(/<br>|\n|\rn|<br\/>|<br \/>/);
  return paragraphs;
}

export function getSentences(text: string | null): string[] {
  if (!text) {
    return [' '];
  }
  const regex = /(?<!\b(?:Mr|Mrs|Ms|Dr|Sr|Jr|Prof|Inc)\.)(?<=[.?!])\s+(?=[A-Z])|(?<=[.?!])\s*$/g;
  const sentences = text.split(regex).filter(d => d);
  return sentences;
}

export function getSplitParagraph(text: string | null): string[][] {
  const sentences = getSentences(text);
  const words = sentences.map(s => (s > ' ' ? s.split(' ').filter(word => word) : [' ']));
  return words;
}

export function setTextParams(textVar: TextVarType, paragraphs: TextParagraphsType) : TextVarType {
  const newVar = { ...textVar };

  newVar.maxP = paragraphs.length - 1;
  const sentences = getSplitParagraph(paragraphs[newVar.pID]);
  newVar.maxS = Math.max(0, sentences.length - 1);
  const s = sentences[newVar.sID];
  if (s) {
    newVar.maxW = Math.max(0, s.length - 1);
  } else {
    newVar.maxW = 0;
  }
  return newVar;
}

export function changeSelectionP(diff: number, textVar: TextVarType, paragraphs: TextParagraphsType ) : TextVarType {
  let newVar = { ...textVar };

  let pID = newVar.pID + diff;
  newVar.pID = Math.min(Math.max(0, pID), newVar.maxP);
  newVar.sID = 0;
  newVar.wID = 0;
  newVar = setTextParams(newVar, paragraphs);
  return newVar;
}

export function changeSelectionS(diff: number, textVar: TextVarType, paragraphs: TextParagraphsType) : TextVarType {
  let newVar = { ...textVar };

  let sID = newVar.sID + diff;
  if (sID < 0 && newVar.pID <= 0 || sID > newVar.maxS && newVar.pID >= newVar.maxP) {
    return newVar;
  }
  if (sID < 0) {
    newVar = changeSelectionP(-1, newVar, paragraphs);
    newVar.sID = newVar.maxS;
  }
  else if (sID > newVar.maxS) {
    newVar = changeSelectionP(1, newVar, paragraphs); 
    newVar.sID = 0;
  } else {  
    newVar.sID = sID;
  }
  newVar = setTextParams(newVar, paragraphs);
  return newVar;
}

export function changeSelectionW(diff: number, textVar: TextVarType, paragraphs: TextParagraphsType) : TextVarType {
  let newVar = { ...textVar };

  let wID = newVar.wID + diff;

  if (wID < 0 && newVar.sID <= 0 && newVar.pID <=0) {
    return newVar;
  }

  if (wID < 0) {
    newVar = changeSelectionS(-1, newVar, paragraphs);
    newVar.wID = newVar.maxW;
  }
  else if (wID > textVar.maxW) {
    newVar = changeSelectionS(1, newVar, paragraphs);
    newVar.wID = 0;
  } else {  
    newVar.wID = wID;
  }
  return newVar;
}


export function replaceText(textEdited: string, selectionType: SelectionTypeType, textVar: TextVarType, paragraphsOld: TextParagraphsType) : [string, string] {

  const sentencesOld = getSplitParagraph(paragraphsOld[textVar.pID]);

  if (selectionType === 'w') {
    sentencesOld[textVar.sID][textVar.wID] = textEdited;
  }
  const sentences = sentencesOld.map((words: string[]) => words.join(' '));

  if (selectionType === 's') {
    sentences[textVar.sID] = textEdited;
  }
  let paragraphText = sentences.join(' ');
  
  if (selectionType === 'p') {
    paragraphText = textEdited;
  }

  const paragraphs = [...paragraphsOld];
  paragraphs[textVar.pID] = paragraphText;
  const titleToSave = paragraphs[0];
  const textToSave = paragraphs.slice(1).join('<br>');
  
  return [titleToSave, textToSave];
}