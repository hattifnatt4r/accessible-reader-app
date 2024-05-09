import { makeObservable, observable, action } from "mobx";
import { FileIDType, ReaderFileType, ReaderTextType } from "../consts/dataTypes";
import { dataExampleFiles, dataExampleText } from "../consts/dataExamples";

type SelectionTypeType = 'w' | 's' | 'p';
type TextParams = { maxW: number, maxS: number, maxP: number };


export class FileviewStore {
  file: ReaderFileType = null;
  text: ReaderTextType = null;
  paragraphs: string[] = [];
  @observable textParams: TextParams = { maxW: 0, maxS: 0, maxP: 0 };
  @observable selectionType: SelectionTypeType = 's';
  @observable selectionID: string = 'p0s0';
  @observable pID: number = 0;
  @observable sID: number = 0;
  @observable wID: number = 0;

  constructor(props : { id:FileIDType }) {
    makeObservable(this);
    const { id } = props;
    this.text = this.getFileText(id);

    const selectionType = localStorage.getItem('readerSelectionType') as SelectionTypeType;
    if (selectionType) this.selectionType = selectionType;

    this.paragraphs = this.getParagraphs(this.text?.text || null);
    this.setTextParams();
  }

  getFileText = (id:FileIDType) => {
    // todo: retrive from server
    const text = dataExampleText.find(t => t?.id === id);
    return text || null;
  }

  getFileTitle = (id:FileIDType) => {
    // todo: retrive from config
    const file = dataExampleFiles.find(t => t?.id === id);
    return file || null;
  }


  getSplitParagraph(text: string | null): string[][] {
    if (!text) return [];
 
    // const regex = /\b(?<!\b(?:Mr|Mrs|Ms|Dr|Sr|Jr|Prof|Inc)\.)(?<=[.?!])\s+(?=[A-Z])|(?<=[.?!])\s*$/g;
    const regex = /(?<!\b(?:Mr|Mrs|Ms|Dr|Sr|Jr|Prof|Inc)\.)(?<=[.?!])\s+(?=[A-Z])|(?<=[.?!])\s*$/g;
    const sentences = text.split(regex).filter(d => d);
    const words = sentences.map(s => s.split(' ').filter(word => word));
    return words;
  }

  getParagraphs(text: string | null): string[] {
    if (!text) return [];
    const paragraphs = text.split(/<br>|\n|\rn|<br\/>|<br \/>/);
    return paragraphs;
  }

  @action
  changeSelectionType = () => {
    if (this.selectionType == 'w') { this.selectionType = 's'; } 
    else if (this.selectionType == 's') { this.selectionType = 'p'; }  
    else { this.selectionType = 'w'; }
    console.log('type:', this.selectionType);
    localStorage.setItem('readerSelectionType', this.selectionType);
    this.setTextParams()
  }

  @action
  setTextParams() {
    this.textParams.maxP = this.paragraphs.length;
    const sentences = this.getSplitParagraph(this.paragraphs[this.pID]);
    this.textParams.maxS = sentences.length - 1;
    const s = sentences[this.sID];
    if (s) {
      this.textParams.maxW = s.length - 1;
    } else {
      this.textParams.maxW = 0;
    }
  }

  @action
  changeSelectionP = (diff: number) => {
    let pID = this.pID + diff;
    this.pID = Math.min(Math.max(0, pID), this.textParams.maxP);
    this.sID = 0;
    this.wID = 0;
    this.setTextParams();
  }
  @action
  changeSelectionS = (diff: number) => {
    let sID = this.sID + diff;
    if (sID < 0 && this.pID <= 0 || sID > this.textParams.maxS && this.pID >= this.textParams.maxP) {
      return;
    }
    if (sID < 0 ) {
      this.changeSelectionP(-1);
      this.sID = this.textParams.maxS;
    }
    else if (sID > this.textParams.maxS) {
      this.changeSelectionP(1); 
      this.sID = 0;
    } else {  
      this.sID = sID;
    }
    this.setTextParams()
  }
  @action
  changeSelection = (diff: number) => {
    
    if (this.selectionType === 'p') {
      this.changeSelectionP(diff);
    }
    if (this.selectionType === 's') {
      this.changeSelectionS(diff);
    }
    if (this.selectionType === 'w') {
      let wID = this.wID + diff;
      if (wID < 0) {
        this.changeSelectionS(-1);
        this.wID = this.textParams.maxW;
      }
      else if (wID > this.textParams.maxW) {
        this.changeSelectionS(1);
        this.wID = 0;
      } else {  
        this.wID = wID;
      }
    }
    // const sentences = this.getSplitParagraph(this.paragraphs[this.pID]);
    // console.log('ids:', this.pID, this.textParams.maxP, '-', this.sID, this.textParams.maxS, '-', this.wID, this.textParams.maxW);
    // console.log('word:', sentences[this.sID]?.[this.wID]);
  }
}
