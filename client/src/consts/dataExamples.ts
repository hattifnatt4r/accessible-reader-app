import { ReaderFileType, ReaderTextType } from "./dataTypes";

export const dataExampleFiles: ReaderFileType[] = [
  { id: 1, folder: 'examples', filename: 'Book 1', person_id: 'Jhon Doe', title: 'Book Title' },
  { id: 2, folder: 'examples', filename: 'Book 2 long title long title long title', person_id: 'Jhon Doe', title: 'Book Title' },
  { id: 3, folder: 'examples', filename: 'Moomins', person_id: 'Jhon Doe', title: 'Moomins' },
  { id: 4, folder: 'examples', filename: 'Book 4', person_id: 'Jhon Doe', title: 'Moomins' },
  { id: 5, folder: 'examples', filename: 'Book 5', person_id: 'Jhon Doe', title: 'Moomins' },
  { id: 6, folder: 'examples', filename: 'Book 6', person_id: 'Jhon Doe', title: 'Moomins' },
];

export const dataExampleText: ReaderTextType[] = [
  // { id: 1, content: 'Lorem ipsum dolor sit amet. Consectetur elit.<br>Excepteur sint, sunt in culpa qui. <br><br>Excepteur sint occaecat cupidatat non proident.'},
  { id: 1, content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. <br/><br/>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    ` 
  },
  { id: 2, content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo." },
  { id: 3, content: `In the heart of the Moominvalley, under the gentle gaze of the round, comforting moon, the Moominhouse stood tall and slightly lopsided, painted blue like the summer sky just before twilight. Moominmamma was in the kitchen, humming a tune that danced with the clatter of her pots and pans. She was making her famous pancake supper, a weekly treat that filled the entire valley with sweet, inviting aromas.\n
    Outside, Moomintroll, with his soft, pearly fur, was lying on the grassy bank of the river, watching the silver fish dart like shooting stars beneath the clear water. He was waiting for Snufkin, who had gone off to the distant hills seeking new melodies on his harmonica, melodies that were as wild and free as the wind.\n
    The air was crisp and the leaves whispered secrets as Little My, always curious and a bit mischievous, tried to sneak up on a butterfly that seemed as though it was painted with the same strokes as the sunset. Her tiny feet barely rustled the leaves, but the butterfly fluttered away, leading her on a chase that would inevitably stir up more adventures, as it always did in Moominvalley.
    ` 
  },
];