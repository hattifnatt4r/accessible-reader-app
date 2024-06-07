import { makeObservable, observable, action, runInAction, toJS } from "mobx";
import { ApiResponseType, FileIDType, ReaderFileType, ReaderParagraphType } from "../consts/dataTypes";
import {
  SelectionTypeType,
  TextVarType,
  changeSelectionP,
  changeSelectionS,
  changeSelectionW,
  getParagraphs,
  getParagraphsFromContent,
  getParagraphsFromJson,
  getReplaceParagraphs,
  getSplitParagraph,
  getTitleParagraph,
  getTexttosave,
  getTexttosaveJson,
  setTextParams
} from "./FileviewUtils";
import { speakAll } from "../utils/narrate";
import { post } from "../utils/query";
import { getNarrateSupported } from "../utils/misc";
import { dataExampleJsonfile } from "../consts/dataExamples";



export class FileviewStore {
  @observable file: ReaderFileType | null = null;
  @observable paragraphs: ReaderParagraphType[] = [];
  @observable sentences: string[][] = [];
  @observable textVar: TextVarType = { maxP: 0, maxS: 0, maxW: 0, pID: 0, sID: 0, wID: 0 };
  @observable selectionType: SelectionTypeType = 's';
  @observable isSpeaking: boolean = false;
  @observable isPaused: boolean = false;
  @observable isEditing: boolean = false;
  @observable viewerMode: string = 'view';
  editContent: string = '';

  constructor(props : { id:FileIDType }) {
    makeObservable(this);
    const { id } = props;

    const selectionType = localStorage.getItem('readerSelectionType') as SelectionTypeType;
    if (selectionType) this.selectionType = selectionType;

    this.loadFile(id);
  }

  loadFile = async(id: FileIDType) => {
    const res = await post('file', { id: id });

    if (!res.value?.length) {
      return;
    }

    const { content, ...rest } = res.value[0];
    this.file = rest;

    const paragraphs = rest.filetype === 'json' ? getParagraphsFromJson(content || '') : getParagraphs(content || null);
    const title = getTitleParagraph(rest.title || '');
    this.paragraphs = [title, ...paragraphs];
    this.textVar = setTextParams(this.textVar, this.paragraphs);
    this.sentences = getSplitParagraph(this.paragraphs[this.textVar.pID]);
  }

  @action
  save = async () => {
    const filetype = this.file?.filetype;
    let res: ApiResponseType = {};
  
    if (filetype === 'json') {
      // const text2 = JSON.stringify(dataExampleJsonfile);
      const [title, text] = getTexttosaveJson(this.paragraphs);
      res = await post('file_upd', { id: this.file?.id, title: title, content: text });
    } else {
      const [title, text] = getTexttosave(this.paragraphs);
      res = await post('file_upd', { id: this.file?.id, title: title, content: text });
    }

    if (res?.status === 'success') {
      this.loadFile(this.file?.id || 0);
    }
    this.isEditing = false;
  }

  @action
  replaceParagraphs = (textEdited: string) => {
    const paragraphs = getReplaceParagraphs(textEdited, this.selectionType, this.textVar, this.paragraphs);
    this.paragraphs = paragraphs;
    this.isEditing = false;
  }

  // inline edit
  getContentFromParagraphs = () => {
    const textToSave = this.paragraphs.slice(1).map((p:ReaderParagraphType) => p.content).join('<br>');
    return textToSave;
  }
  @action
  onContentChange = (val: string) => {
    this.editContent = val;
  }
  @action
  onModeChange = (mode: string) => {
    this.viewerMode = mode;
    if (mode === 'view') {
      this.paragraphs = getParagraphsFromContent(this.editContent, this.file?.title || '');
    }
  }


  // view mode
  getSelectedText = () => {
    let selectedText = '';
    if (this.selectionType === 'p') { selectedText = this.paragraphs[this.textVar.pID].content; }
    if (this.selectionType === 's') { selectedText = this.sentences[this.textVar.sID].join(' '); }
    if (this.selectionType === 'w') { selectedText = this.sentences[this.textVar.sID][this.textVar.wID]; }
    return selectedText;
  }

  @action
  changeSelectionType = () => {
    if (this.selectionType === 'w') { this.selectionType = 's'; } 
    else if (this.selectionType === 's') { this.selectionType = 'p'; }  
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
  selectParagraph = (pID: number) => {
    this.textVar.pID = pID - 1;
    this.textVar = changeSelectionP(1, this.textVar, this.paragraphs);
    this.sentences = getSplitParagraph(this.paragraphs[this.textVar.pID]);
  
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
    if (!getNarrateSupported()) {
      return;
    }
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
