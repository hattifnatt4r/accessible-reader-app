import { makeObservable, observable, action, runInAction, toJS } from "mobx";
import { FileIDType, ReaderFileType } from "../consts/dataTypes";
import { dataExampleFiles, dataExampleText } from "../consts/dataExamples";
import { SelectionTypeType, TextVarType, changeSelectionP, changeSelectionS, changeSelectionW, getParagraphs, getSplitParagraph, replaceText, setTextParams } from "./FileviewUtils";


function speakAll(text: string[], cb?: () => void,) {
  speechSynthesis.cancel();
  const volume = window.app.userSettings.readerVolume;
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

export class FileviewStore {
  file: ReaderFileType = null;
  @observable paragraphs: string[] = [];
  @observable sentences: string[][] = [];
  @observable textVar: TextVarType = { maxP: 0, maxS: 0, maxW: 0, pID: 0, sID: 0, wID: 0 };
  @observable selectionType: SelectionTypeType = 's';
  @observable isSpeaking: boolean = false;
  @observable isPaused: boolean = false;
  @observable isEditing: boolean = false;

  constructor(props : { id:FileIDType }) {
    makeObservable(this);
    const { id } = props;

    const selectionType = localStorage.getItem('readerSelectionType') as SelectionTypeType;
    if (selectionType) this.selectionType = selectionType;

    const title = this.getFile(id)?.title || '';
    const text = this.getFileText(id);
    this.paragraphs = [title, ...getParagraphs(text || null)];
    this.textVar = setTextParams(this.textVar, this.paragraphs);
    this.sentences = getSplitParagraph(this.paragraphs[this.textVar.pID]);
  }

  getFileText = (id:FileIDType) => {
    // todo: retrive from server
    const text = dataExampleText.find(t => t?.id === id);
    return text?.text || null;
  }

  getFile = (id:FileIDType) => {
    // todo: retrive from config
    const file = dataExampleFiles.find(t => t?.id === id);
    return file || null;
  }

  @action
  save = (textEdited: string) => {
    const [title, text] = replaceText(textEdited, this.selectionType, this.textVar, this.paragraphs);
    // todo: save to server

    this.paragraphs = [title, ...getParagraphs(text || null)];
    this.textVar = setTextParams(this.textVar, this.paragraphs);
    this.sentences = getSplitParagraph(this.paragraphs[this.textVar.pID]);
    this.isEditing = false;
  }

  getSelectedText = () => {
    let selectedText = '';
    if (this.selectionType === 'p') { selectedText = this.paragraphs[this.textVar.pID]; }
    if (this.selectionType === 's') { selectedText = this.sentences[this.textVar.sID].join(' '); }
    if (this.selectionType === 'w') { selectedText = this.sentences[this.textVar.sID][this.textVar.wID]; }
    return selectedText;
  }

  @action
  changeSelectionType = () => {
    if (this.selectionType == 'w') { this.selectionType = 's'; } 
    else if (this.selectionType == 's') { this.selectionType = 'p'; }  
    else { this.selectionType = 'w'; }
    localStorage.setItem('readerSelectionType', this.selectionType);
    this.textVar= setTextParams(this.textVar, this.paragraphs);
  }

  @action
  changeSelection = (diff: number) => {
    const { pID } = this.textVar;
    
    if (this.selectionType === 'p') {
      this.textVar = changeSelectionP(diff, this.textVar, this.paragraphs);
    }
    if (this.selectionType === 's') {
      this.textVar = changeSelectionS(diff, this.textVar, this.paragraphs);
    }
    if (this.selectionType === 'w') {
      this.textVar = changeSelectionW(diff, this.textVar, this.paragraphs);
    }

    if (pID !== this.textVar.pID) {
      this.sentences = getSplitParagraph(this.paragraphs[this.textVar.pID]);
    }

    const appStore = window.app;
    if (appStore.userSettings.readerNarrateSelection !== 0) {
      this.narrate();
    }
  }

  @action
  toggleEdit = () => {
    this.isEditing = !this.isEditing;
  }


  // -- narrate ----------------------------------------
  @action
  narrateFinished = () => {
    this.isSpeaking = false;
    this.isPaused = false;
  }

  @action
  narrate = () => {
    this.isSpeaking = true;
    const text = this.getSelectedText();
    // api cannot read the whole paragraph - split by sentence
    const textNarrate = this.selectionType === 'p' ? text.split('.') : [text];
    speakAll(textNarrate, this.narrateFinished);
    return text;
  }

  @action
  narratePause = () => {
    speechSynthesis.pause();
    this.isSpeaking = false;
    this.isPaused = true;
  }

  @action
  narrateResume = () => {
    if (this.isPaused) {
      this.isSpeaking = true;
      speechSynthesis.resume();
    } else {
      this.narrate();
    }
  }

  @action
  narrateAll = () => {
    // read all paragraphs recursively
    this.isSpeaking = true;
    const cb = () => {
      runInAction(() => {
        if (this.textVar.pID < this.textVar.maxP) {
          this.textVar = changeSelectionP(1, this.textVar, this.paragraphs);
          this.sentences = getSplitParagraph(this.paragraphs[this.textVar.pID]);
          this.narrateAll();
        } else {
          this.narrateFinished();
        }
      });
    }
    speakAll(this.sentences.map(s => s.join(' ')), cb);
  }
}
