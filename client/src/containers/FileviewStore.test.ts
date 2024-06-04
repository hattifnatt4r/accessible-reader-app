// var globalVarTest: string = "I am a global variable using var";

import { FileIDType } from "../consts/dataTypes";
import { FileviewStore } from "./FileviewStore";
import { getParagraphs, getSplitParagraph, setTextParams } from "./FileviewUtils";

const file = { id: 1, folder: 'examples', filename: 'Book 1', person_id: 'Jhon Doe', title: 'Book Title' };
const textExample = {
  id: 1,
  text: `Lorem ipsum dolor sit amet. Consectetur elit.<br/>Excepteur sint, sunt in culpa qui. <br/><br/>Excepteur sint occaecat cupidatat non proident.`,
};
const textVar = { maxP: 4, maxS: 0, maxW: 1, pID: 0, sID: 0, wID: 0 };


class FileviewStoreTest extends FileviewStore {
  constructor(props : { id:FileIDType }) {
    super(props);

    const { id } = props;

    const title = { type: '', content: file?.title || '' };
    const text = textExample.text;
    this.paragraphs = [title, ...getParagraphs(text || null)];
    this.textVar = setTextParams(this.textVar, this.paragraphs);
  
    this.sentences = getSplitParagraph(this.paragraphs[this.textVar.pID]);
  }


}




describe('FileviewStore', () => {

  it('should initialize FileviewStore', () => {
    const store = new FileviewStoreTest({ id: 1 });
    expect(store.textVar).toEqual(textVar);
    expect(store.sentences).toEqual([["Book", "Title"]]);
  });

  it('should syscle selectionType', () => {
    const store = new FileviewStoreTest({ id: 1 });
    expect(store.selectionType).toEqual('s');
    store.changeSelectionType();
    expect(store.selectionType).toEqual('p');
    store.changeSelectionType();
    expect(store.selectionType).toEqual('w');
    store.changeSelectionType();
    expect(store.selectionType).toEqual('s');
  });

  it('should select text correctly', () => {
    const store = new FileviewStoreTest({ id: 1 });
    window.app = { userSettings: { readerNarrateSelection: 0 } };

    // by sentence
    expect(store.getSelectedText()).toEqual('Book Title');
    store.changeSelection(1);
    expect(store.getSelectedText()).toEqual('Lorem ipsum dolor sit amet.');

    // by paragraph
    store.changeSelectionType();
    expect(store.getSelectedText()).toEqual('Lorem ipsum dolor sit amet. Consectetur elit.');
    store.changeSelection(1);
    expect(store.getSelectedText()).toEqual('Excepteur sint, sunt in culpa qui. ');

    // by word
    store.changeSelectionType();
    expect(store.getSelectedText()).toEqual('Excepteur');
    store.changeSelection(1);
    expect(store.getSelectedText()).toEqual('sint,');
  });
})