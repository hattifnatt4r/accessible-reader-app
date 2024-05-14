// var globalVarTest: string = "I am a global variable using var";

import { FileIDType } from "../consts/dataTypes";
import { FileviewStore } from "./FileviewStore";
import { getParagraphs, getSplitParagraph, setTextParams } from "./FileviewUtils";

const file = { id: 1, folder: 'examples', name: 'Book 1', author: 'Jhon Doe', title: 'Book Title' };
const textExample = {
  id: 1,
  text: `Lorem ipsum dolor sit amet. Consectetur adipiscing elit.<br/>Excepteur sint, sunt in culpa qui. <br/><br/>Excepteur sint occaecat cupidatat non proident.`,
};
const textVar = { maxP: 4, maxS: 0, maxW: 1, pID: 0, sID: 0, wID: 0 };


class FileviewStoreTest extends FileviewStore {
  constructor(props : { id:FileIDType }) {
    super(props);

    const { id } = props;

    const title = this.getFile(id)?.title || '';
    const text = this.getFileText(id);
    this.paragraphs = [title, ...getParagraphs(text || null)];
    this.textVar = setTextParams(this.textVar, this.paragraphs);
  
    this.sentences = getSplitParagraph(this.paragraphs[this.textVar.pID]);
  }
  getFile = (id: FileIDType) => file;
  getFileText = (id: FileIDType) => textExample.text;
}




describe('FileviewStore narrate function', () => {

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


})