import { toJS } from "mobx";
import { dataExampleJsonfile } from "../consts/dataExamples";
import { ReaderContentItemType, ReaderParagraphType } from "../consts/dataTypes";

export type TextVarType = { maxP: number, maxS: number, maxW: number, pID: number, sID: number, wID: number };
export type TextParagraphsType = string[];
export type SelectionTypeType = 'w' | 's' | 'p';

export function getTitleParagraph(title: string): ReaderParagraphType {
  return { id: 0, type: '', content: title };
}

export function getParagraphs(text: string | null): ReaderParagraphType[] {
  if (!text) return [];
  const paragraphs = text.split(/<br>|\n|\rn|<br\/>|<br \/>/);
  return paragraphs.map((p: string, ii: number) => ({ id: ii + 1, type: '', content: p }));
}

export function getSentences(text: string | null): string[] {
  if (!text) {
    return [' '];
  }
  const regex = /(?<!\b(?:Mr|Mrs|Ms|Dr|Sr|Jr|Prof|Inc)\.)(?<=[.?!])\s+(?=[A-Z])|(?<=[.?!])\s*$/g;
  const sentences = text.split(regex).filter(d => d);
  return sentences;
}

export function getSplitParagraph(paragraph: ReaderParagraphType | null): string[][] {
  if (!paragraph) return [[' ']];
  const text = paragraph.content;
  const sentences = getSentences(text);
  const words = sentences.map(s => (s > ' ' ? s.split(' ').filter(word => word) : [' ']));
  return words;
}

export function setTextParams(textVar: TextVarType, paragraphs: ReaderParagraphType[]) : TextVarType {
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

export function changeSelectionP(diff: number, textVar: TextVarType, paragraphs: ReaderParagraphType[] ) : TextVarType {
  let newVar = { ...textVar };

  let pID = newVar.pID + diff;
  newVar.pID = Math.min(Math.max(0, pID), newVar.maxP);
  newVar.sID = 0;
  newVar.wID = 0;
  newVar = setTextParams(newVar, paragraphs);
  return newVar;
}

export function changeSelectionS(diff: number, textVar: TextVarType, paragraphs: ReaderParagraphType[]) : TextVarType {
  let newVar = { ...textVar };

  let sID = newVar.sID + diff;
  if ((sID < 0 && newVar.pID <= 0) || (sID > newVar.maxS && newVar.pID >= newVar.maxP)) {
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

export function changeSelectionW(diff: number, textVar: TextVarType, paragraphs: ReaderParagraphType[]) : TextVarType {
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



function getReplaceParagraphs(textEdited: string, selectionType: SelectionTypeType, textVar: TextVarType, paragraphsOld: ReaderParagraphType[]): ReaderParagraphType[] { 
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

  // avoid mutating paragraphsOld
  const paragraphs = paragraphsOld.map(p => ({...p}));
  paragraphs[textVar.pID].content = paragraphText;
  return paragraphs;
}

export function replaceText(textEdited: string, selectionType: SelectionTypeType, textVar: TextVarType, paragraphsOld: ReaderParagraphType[]) : [string, string] {
  const paragraphs = getReplaceParagraphs(textEdited, selectionType, textVar, paragraphsOld);
  const titleToSave = paragraphs[0].content;
  const textToSave = paragraphs.slice(1).map((p:ReaderParagraphType) => p.content).join('<br>');
  
  return [titleToSave, textToSave];
}

export function replaceTextJson(textEdited: string, selectionType: SelectionTypeType, textVar: TextVarType, paragraphsOld: ReaderParagraphType[]): [string, string] {
  let paragraphs = getReplaceParagraphs(textEdited, selectionType, textVar, paragraphsOld);

  // combine question+answer into one item
  let paragraphsNew = paragraphs.map(p => ({ type: p.type, answer: '', content: p.content }));
  paragraphsNew.forEach((p, ii: number) => {
    if (p.type === 'answer') { paragraphsNew[ii-1].answer = p.content; }
  });
  paragraphsNew = paragraphsNew.filter(p => p.type !== 'answer');

  const titleToSave = paragraphsNew[0].content;
  const itemsToSave = paragraphsNew.slice(1);
  const textToSave = JSON.stringify({items: itemsToSave});

  return [titleToSave, textToSave]
}

export function getParagraphsFromJSON(content: string): ReaderParagraphType[] {

  const contentJson = content ? JSON.parse(content) : {};
  const items = contentJson.items || [];

  const paragraphs: ReaderParagraphType[] = [];
  items.forEach((item: ReaderContentItemType, ii:number) => {
    if (item.type === 'question') {
      const p: ReaderParagraphType = { id: ii + 1, type: 'question', content: item.content };
      const answer: ReaderParagraphType = { id: ii + 1, type: 'answer', content: item.answer || '' };
      paragraphs.push(p);
      paragraphs.push(answer);
    }
    else {
      const p: ReaderParagraphType = { id: ii + 1, type: '', content: item.content };
      paragraphs.push(p);
    }
  });

  paragraphs.forEach((p: ReaderParagraphType, id: number) => { p.id = id + 1; });
  return paragraphs;
}