import { changeSelectionP, changeSelectionS, changeSelectionW, getParagraphs, getParagraphsFromContent, getReplaceParagraphs, getSentences, getSplitParagraph, getTexttosave, setTextParams } from "./FileviewUtils"; 


const textAll = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. <br/><br/>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;

const paragraphs = [
  { id: 1, type: '', content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. " },
  { id: 2, type: '', content: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. " },
  { id: 3, type: '', content: "" },
  { id: 4, type: '', content: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
  { id: 5, type: '', content: "" },
]

describe('getParagraphs', () => {
  it('should split into paragraphs', () => {
    expect(getParagraphs(textAll)).toEqual(paragraphs);
  });
})

describe('getSentences', () => {
  it('should split into sentences/words', () => {
    const p1 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud. Duis aute irure dolor.';
    const w1 = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Ut enim ad minim veniam, quis nostrud.', 'Duis aute irure dolor.'];
    expect(getSentences(p1)).toEqual(w1);
    expect(getSentences('')).toEqual([' ']);
    expect(getSentences(null)).toEqual([' ']);
  });
})

describe('getSplitParagraph', () => {
  it('should split into sentences/words', () => {
    const p1 = { id: 1, type: '', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor.' };
    const w1 = [["Lorem","ipsum","dolor","sit","amet,","consectetur","adipiscing","elit."], ["Duis","aute","irure","dolor."]];
    expect(getSplitParagraph(p1)).toEqual(w1);
    expect(getSplitParagraph({ id: 0, type: '', content: ''})).toEqual([[' ']]);
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

describe('getReplaceParagraphs', () => {
  it('should replace edited text', () => {      
    const paragraphs = [
      { id: 0, type: '', content: 'Book Title' },
      { id: 1, type: '', content: 'Lorem ipsum dolor sit amet. Consectetur elit.' }, 
      { id: 2, type: '', content: 'Excepteur sint, sunt in culpa qui. ' }, 
      { id: 3, type: '', content: '' }, 
      { id: 4, type: '', content: 'Excepteur sint occaecat cupidatat non proident.' }
    ];

    
    const r1 = getReplaceParagraphs('L', 'w', { pID: 1, sID: 0, wID: 0, maxP: 4, maxS: 1, maxW: 4 }, paragraphs);
    expect(r1).toEqual([
      { id: 0, type: '', content: 'Book Title' },
      { id: 1, type: '', content: 'L ipsum dolor sit amet. Consectetur elit.' }, 
      { id: 2, type: '', content: 'Excepteur sint, sunt in culpa qui. ' }, 
      { id: 3, type: '', content: '' }, 
      { id: 4, type: '', content: 'Excepteur sint occaecat cupidatat non proident.' }
    ]);
    
    const r2 = getReplaceParagraphs('L.', 's', { pID: 1, sID: 0, wID: 0, maxP: 4, maxS: 1, maxW: 4 }, paragraphs);
    expect(r2).toEqual([
      { id: 0, type: '', content: 'Book Title' },
      { id: 1, type: '', content: 'L. Consectetur elit.' }, 
      { id: 2, type: '', content: 'Excepteur sint, sunt in culpa qui. ' }, 
      { id: 3, type: '', content: '' }, 
      { id: 4, type: '', content: 'Excepteur sint occaecat cupidatat non proident.' }
    ]);
    
    const r3 = getReplaceParagraphs('L.', 'p', { pID: 1, sID: 0, wID: 0, maxP: 4, maxS: 1, maxW: 4 }, paragraphs);
    expect(r3).toEqual([
      { id: 0, type: '', content: 'Book Title' },
      { id: 1, type: '', content: 'L.' }, 
      { id: 2, type: '', content: 'Excepteur sint, sunt in culpa qui. ' }, 
      { id: 3, type: '', content: '' }, 
      { id: 4, type: '', content: 'Excepteur sint occaecat cupidatat non proident.' }
    ]);
    
    const r4 = getReplaceParagraphs('L.', 's', { pID: 1, sID: 1, wID: 0, maxP: 4, maxS: 1, maxW: 1 }, paragraphs);
    expect(r4).toEqual([
      { id: 0, type: '', content: 'Book Title' },
      { id: 1, type: '', content: 'Lorem ipsum dolor sit amet. L.' }, 
      { id: 2, type: '', content: 'Excepteur sint, sunt in culpa qui. ' }, 
      { id: 3, type: '', content: '' }, 
      { id: 4, type: '', content: 'Excepteur sint occaecat cupidatat non proident.' }
    ]);
    
  });
})

describe('getParagraphsFromContent', () => {
  it('should convert editor text to paragraphs', () => {
    expect(getParagraphsFromContent('line1<br><div><br></div><div>line2</div><br>Next line 3<br><br>', 'title')).toEqual(
      [
        {"content": "title", "id": 0, "type": ""},
        {"content": "line1", "id": 1, "type": ""},
        {"content": "", "id": 2, "type": ""},
        {"content": "", "id": 3, "type": ""},
        {"content": "line2", "id": 4, "type": ""},
        {"content": "Next line 3", "id": 5, "type": ""},
        {"content": "", "id": 6, "type": ""},
        {"content": "", "id": 7, "type": ""}
      ]);
  });
})

// todo
describe('getTexttosave', () => {
  it('should convert paragraphs to plain text', () => {
    
  });
})
describe('getTexttosaveJson', () => {
  it('should convert paragraphs to stringified json', () => {
    
  });
})
describe('getParagraphsFromJson', () => {
  it('should convert stringified json to paragraphs', () => {
    
  });
})