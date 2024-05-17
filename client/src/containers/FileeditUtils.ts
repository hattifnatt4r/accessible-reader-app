
export function getTextAroundCursor(textvalue: string, cursor: number) : [string, string, string, string] {
  const wordsBefore = textvalue.substring(0, cursor).split(' ');
  const wordsAfter = textvalue.substring(cursor).split(' ');
  let textBeforeCursor = wordsBefore.length > 1 ? wordsBefore.slice(0, -1).join(' ') : '';
  const wordBeforeCursor = wordsBefore.length > 1 ? wordsBefore[wordsBefore.length - 1] : wordsBefore[0];
  const textAfterCursor = wordsAfter.length > 1 ? wordsAfter.slice(1).join(' ') : '';
  const wordAfterCursor = wordsAfter[0];
  if (textBeforeCursor) {
    textBeforeCursor += ' ';
  }
  return [textBeforeCursor, wordBeforeCursor, wordAfterCursor, textAfterCursor];
}