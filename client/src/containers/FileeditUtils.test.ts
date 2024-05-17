import { getTextAroundCursor } from "./FileeditUtils";

describe('getTextAroundCursor', () => {
  it('should split text into 4 strings', () => {
    expect(getTextAroundCursor('Excepteur sint occaecat cupidatat non pro.', 0)).toEqual(["", "", "Excepteur", "sint occaecat cupidatat non pro."]);
    expect(getTextAroundCursor('Excepteur sint occaecat cupidatat non pro.', 2)).toEqual(["", "Ex", "cepteur", "sint occaecat cupidatat non pro."]);
    expect(getTextAroundCursor('Excepteur sint occaecat cupidatat non pro.', 8)).toEqual(["", "Excepteu", "r", "sint occaecat cupidatat non pro."]);
    expect(getTextAroundCursor('Excepteur sint occaecat cupidatat non pro.', 9)).toEqual(["", "Excepteur", "", "sint occaecat cupidatat non pro."]);
    expect(getTextAroundCursor('Excepteur sint occaecat cupidatat non pro.', 10)).toEqual(["Excepteur ", "", "sint", "occaecat cupidatat non pro."]);
  });
})
