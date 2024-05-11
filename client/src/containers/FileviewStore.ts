import { makeObservable, observable, action } from "mobx";
import { FileIDType, ReaderFileType } from "../consts/dataTypes";
import { dataExampleFiles, dataExampleText } from "../consts/dataExamples";
import { TextVarType, changeSelectionP, changeSelectionS, changeSelectionW, getParagraphs, getSplitParagraph, setTextParams } from "./FileviewStoreUtils";

type SelectionTypeType = 'w' | 's' | 'p';


export class FileviewStore {
  file: ReaderFileType = null;
  @observable paragraphs: string[] = [];
  @observable textVar: TextVarType = { maxW: 0, maxS: 0, maxP: 0, wID: 0, sID: 0, pID: 0 };
  @observable selectionType: SelectionTypeType = 's';


  constructor(props : { id:FileIDType }) {
    makeObservable(this);
    const { id } = props;

    const selectionType = localStorage.getItem('readerSelectionType') as SelectionTypeType;
    if (selectionType) this.selectionType = selectionType;

    const text = this.getFileText(id);
    this.paragraphs = getParagraphs(text || null);
    this.textVar = setTextParams(this.textVar, this.paragraphs);
  }

  getFileText = (id:FileIDType) => {
    // todo: retrive from server
    const text = dataExampleText.find(t => t?.id === id);
    return text?.text || null;
  }

  getFileTitle = (id:FileIDType) => {
    // todo: retrive from config
    const file = dataExampleFiles.find(t => t?.id === id);
    return file || null;
  }

  @action
  changeSelectionType = () => {
    if (this.selectionType == 'w') { this.selectionType = 's'; } 
    else if (this.selectionType == 's') { this.selectionType = 'p'; }  
    else { this.selectionType = 'w'; }
    console.log('type:', this.selectionType);
    localStorage.setItem('readerSelectionType', this.selectionType);
    this.textVar= setTextParams(this.textVar, this.paragraphs);
  }

  @action
  changeSelection = (diff: number) => {
    
    if (this.selectionType === 'p') {
      this.textVar = changeSelectionP(diff, this.textVar, this.paragraphs);
    }
    if (this.selectionType === 's') {
      this.textVar = changeSelectionS(diff, this.textVar, this.paragraphs);
    }
    if (this.selectionType === 'w') {
      this.textVar = changeSelectionW(diff, this.textVar, this.paragraphs);
    }
  }
}
