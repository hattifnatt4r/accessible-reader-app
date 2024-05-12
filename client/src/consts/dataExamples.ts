import { ReaderFileType, ReaderTextType } from "./dataTypes";

export const dataExampleFiles: ReaderFileType[] = [
  { id: 1, name: 'Book 1', author: 'Jhon Doe', title: 'Book Title' },
  { id: 2, name: 'Book 2', author: 'Jhon Doe', title: 'Book Title' },
  { id: 3, name: 'Book 3', author: 'Jhon Doe', title: 'Book Title' },
];

export const dataExampleText: ReaderTextType[] = [
  { id: 1, text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. <br/><br/>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    ` 
  },
  { id: 2, text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo." },
  { id: 3, text: "Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo." },
];