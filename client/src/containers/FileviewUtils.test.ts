import { changeSelectionP, changeSelectionS, changeSelectionW, getParagraphs, getSplitParagraph, setTextParams } from "./FileviewUtils"; 


const textAll = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. <br/><br/>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;

const paragraphs = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ",
  "",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "",
]

describe('getParagraphs', () => {
  it('should split into paragraphs', () => {
    expect(getParagraphs(textAll)).toEqual(paragraphs);
  });
})

describe('getSplitParagraph', () => {
  it('should split into sentences/words', () => {
    const p1 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';
    const w1 = [
      ["Lorem","ipsum","dolor","sit","amet,","consectetur","adipiscing","elit."],
      ["Ut","enim","ad","minim","veniam,","quis","nostrud","aliquip","ex","ea","commodo","consequat."],
      ["Duis","aute","irure","dolor","in","reprehenderit","in","voluptate","velit","esse","cillum","dolore","eu","fugiat","nulla","pariatur."]
    ];
    expect(getSplitParagraph(p1)).toEqual(w1);
    expect(getSplitParagraph('')).toEqual([[' ']]);
    expect(getSplitParagraph(null)).toEqual([[' ']]);
  });
})

describe('setTextParams', () => {
  it('should set text parameters', () => {
    expect(setTextParams({ maxP: 4, maxS: 2, maxW: 7, pID: 0, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 2, maxW: 7, pID: 0, sID: 0, wID: 0 });
    expect(setTextParams({ maxP: 4, maxS: 2, maxW: 7, pID: 0, sID: 1, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 2, maxW: 11, pID: 0, sID: 1, wID: 0 });
    expect(setTextParams({ maxP: 4, maxS: 2, maxW: 7, pID: 1, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 0, maxW: 16, pID: 1, sID: 0, wID: 0 });
    expect(setTextParams({ maxP: 4, maxS: 2, maxW: 7, pID: 2, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 0, maxW: 0, pID: 2, sID: 0, wID: 0 });
  });
})

describe('changeSelection', () => {
  const initialTextVar = { maxP: 4, maxS: 2, maxW: 7, pID: 0, sID: 0, wID: 0 };

  it('should increment pID', () => {
    const res1 = changeSelectionP(1, { ...initialTextVar }, paragraphs);
    expect(res1.pID).toBe(1);
    const res2 = changeSelectionP(1, { ...initialTextVar, pID: 4 }, paragraphs);
    expect(res2.pID).toBe(4);
  });

  it('should decrement pID', () => {
    const res1 = changeSelectionP(-1, { ...initialTextVar }, paragraphs);
    expect(res1.pID).toBe(0);
    const res2 = changeSelectionP(-1, { ...initialTextVar, pID: 1 }, paragraphs);
    expect(res2.pID).toBe(0);
  }); 

  it('should increment sID', () => {
    expect(changeSelectionS(1, { maxP: 4, maxS: 2, maxW: 7, pID: 0, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 2, maxW: 11, pID: 0, sID: 1, wID: 0 });
    expect(changeSelectionS(1, { maxP: 4, maxS: 2, maxW: 11, pID: 0, sID: 1, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 2, maxW: 15, pID: 0, sID: 2, wID: 0 });
    expect(changeSelectionS(1, { maxP: 4, maxS: 2, maxW: 15, pID: 0, sID: 2, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 0, maxW: 16, pID: 1, sID: 0, wID: 0 });
    expect(changeSelectionS(1, { maxP: 4, maxS: 0, maxW: 16, pID: 1, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 0, maxW: 0, pID: 2, sID: 0, wID: 0 });
    expect(changeSelectionS(1, { maxP: 4, maxS: 0, maxW: 0, pID: 2, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 0, maxW: 16, pID: 3, sID: 0, wID: 0 });
    expect(changeSelectionS(1, { maxP: 4, maxS: 0, maxW: 16, pID: 3, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 0, maxW: 0, pID: 4, sID: 0, wID: 0 });
    expect(changeSelectionS(1, { maxP: 4, maxS: 0, maxW: 0, pID: 4, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 0, maxW: 0, pID: 4, sID: 0, wID: 0 });
  });

  it('should decrement sID', () => {
    expect(changeSelectionS(-1, { maxP: 4, maxS: 0, maxW: 0, pID: 4, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 0, maxW: 16, pID: 3, sID: 0, wID: 0 });
    expect(changeSelectionS(-1, { maxP: 4, maxS: 0, maxW: 16, pID: 3, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 0, maxW: 0, pID: 2, sID: 0, wID: 0 });
    expect(changeSelectionS(-1, { maxP: 4, maxS: 0, maxW: 0, pID: 2, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 0, maxW: 16, pID: 1, sID: 0, wID: 0 });
    expect(changeSelectionS(-1, { maxP: 4, maxS: 0, maxW: 16, pID: 1, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 2, maxW: 15, pID: 0, sID: 2, wID: 0 });
    expect(changeSelectionS(-1, { maxP: 4, maxS: 2, maxW: 15, pID: 0, sID: 2, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 2, maxW: 11, pID: 0, sID: 1, wID: 0 });
    expect(changeSelectionS(-1, { maxP: 4, maxS: 2, maxW: 11, pID: 0, sID: 1, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 2, maxW: 7, pID: 0, sID: 0, wID: 0 });
    expect(changeSelectionS(-1, { maxP: 4, maxS: 2, maxW: 7, pID: 0, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 2, maxW: 7, pID: 0, sID: 0, wID: 0 });
  });

  it('should increment wID', () => {
    expect(changeSelectionW(1, { maxP: 4, maxS: 2, maxW: 7, pID: 0, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 2, maxW: 7, pID: 0, sID: 0, wID: 1 });
    expect(changeSelectionW(1, { maxP: 4, maxS: 2, maxW: 7, pID: 0, sID: 0, wID: 7 }, paragraphs)).toEqual({ maxP: 4, maxS: 2, maxW: 11, pID: 0, sID: 1, wID: 0 });
    expect(changeSelectionW(1, { maxP: 4, maxS: 2, maxW: 11, pID: 0, sID: 1, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 2, maxW: 11, pID: 0, sID: 1, wID: 1 });

    expect(changeSelectionW(1, { maxP: 4, maxS: 2, maxW: 15, pID: 0, sID: 2, wID: 15 }, paragraphs)).toEqual({ maxP: 4, maxS: 0, maxW: 16, pID: 1, sID: 0, wID: 0 });
    expect(changeSelectionW(1, { maxP: 4, maxS: 0, maxW: 16, pID: 1, sID: 0, wID: 16 }, paragraphs)).toEqual({ maxP: 4, maxS: 0, maxW: 0, pID: 2, sID: 0, wID: 0 });

    expect(changeSelectionW(1, { maxP: 4, maxS: 0, maxW: 0, pID: 2, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 0, maxW: 16, pID: 3, sID: 0, wID: 0 });
    expect(changeSelectionW(1, { maxP: 4, maxS: 0, maxW: 0, pID: 4, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 0, maxW: 0, pID: 4, sID: 0, wID: 0 });
  });

  it('should decrement wID', () => {
    expect(changeSelectionW(-1, { maxP: 4, maxS: 0, maxW: 0, pID: 4, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 0, maxW: 16, pID: 3, sID: 0, wID: 16 });
    expect(changeSelectionW(-1, { maxP: 4, maxS: 0, maxW: 16, pID: 3, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 0, maxW: 0, pID: 2, sID: 0, wID: 0 });
    expect(changeSelectionW(-1, { maxP: 4, maxS: 0, maxW: 0, pID: 2, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 0, maxW: 16, pID: 1, sID: 0, wID: 16 });
    expect(changeSelectionW(-1, { maxP: 4, maxS: 0, maxW: 16, pID: 1, sID: 0, wID: 16 }, paragraphs)).toEqual({ maxP: 4, maxS: 0, maxW: 16, pID: 1, sID: 0, wID: 15 });
    expect(changeSelectionW(-1, { maxP: 4, maxS: 0, maxW: 16, pID: 1, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 2, maxW: 15, pID: 0, sID: 2, wID: 15 });

    expect(changeSelectionW(-1, { maxP: 4, maxS: 0, maxW: 16, pID: 1, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 2, maxW: 15, pID: 0, sID: 2, wID: 15 });
    expect(changeSelectionW(-1, { maxP: 4, maxS: 2, maxW: 15, pID: 0, sID: 2, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 2, maxW: 11, pID: 0, sID: 1, wID: 11 });

    expect(changeSelectionW(-1, { maxP: 4, maxS: 2, maxW: 7, pID: 0, sID: 0, wID: 0 }, paragraphs)).toEqual({ maxP: 4, maxS: 2, maxW: 7, pID: 0, sID: 0, wID: 0 });

  });
})

