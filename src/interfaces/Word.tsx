import {
  Xing,
  XingWord,
  getDisplayedXingWord,
  getNonDisplayedXingWord,
  makeXingWord
} from "./Xing";
import { Coords, getCoordsGeneric, areWordCoordsOnModel } from "./PuzModelCell";

export interface Word {
  word: string;
  coords: Coords[] | null;
  isAcross: boolean | null;
}

export interface WordCandidate {
  xingWordCandidate: XingWord;
  coordsCandidate: Coords[];
  displayedXingWord: XingWord;
}

export type WordCandidateArgs = [XingWord, Coords[], XingWord];

export const makeWordCandidate = (
  xingWordCandidate: XingWord,
  coordsCandidate: Coords[],
  displayedXingWord: XingWord
) => {
  return {
    xingWordCandidate: xingWordCandidate,
    coordsCandidate: coordsCandidate,
    displayedXingWord: displayedXingWord
  };
};

export const makeWordCandidatesFromXings = (
  xings: Xing[],
  words: Word[],
  puzHeight: number,
  puzWidth: number
): WordCandidate[] => {
  const ret: WordCandidate[] = [];
  let nonDisplayedXingWord: XingWord;
  let displayedXingWord: XingWord;
  let letterCoordsCandidate: Coords;
  let wordCoordsCandidate: Coords[];
  for (let xing of xings) {
    nonDisplayedXingWord = getNonDisplayedXingWord(words, xing);
    displayedXingWord = getDisplayedXingWord(words, xing);
    letterCoordsCandidate = getWordCoords(
      getWord(words, nonDisplayedXingWord.word)
    )[nonDisplayedXingWord.letterIdxInWord];
    wordCoordsCandidate = getWordCoordsFromLetterCoords(
      nonDisplayedXingWord,
      letterCoordsCandidate
    );
    // All candidates should be in bounds.
    if (areWordCoordsOnModel(puzHeight, puzWidth, wordCoordsCandidate))
      ret.push(
        makeWordCandidate(
          nonDisplayedXingWord,
          wordCoordsCandidate,
          displayedXingWord
        )
      );
  }
  return ret;
};

export const getWord = (words: Word[], wordStr: string): Word => {
  return words.find(word => word.word === wordStr) as Word;
};

export const makeWord = (word: string): Word => {
  return {
    word: word,
    coords: null,
    isAcross: null
  };
};

export const getUpdatedWord = (
  oldWord: Word,
  isAcross: boolean,
  coords: Coords[]
): Word => {
  return {
    ...oldWord,
    isAcross: isAcross,
    coords: coords
  };
};

export const getWordWithAddedIsAcross = (
  word: Word,
  isAcross: boolean
): Word => {
  return { ...word, isAcross: isAcross };
};

export const getWordWithAddedPos = (word: Word, coords: Coords[]): Word => {
  return { ...word, coords: coords };
};

export const getWordCoordsFromLetterCoords = (
  xingWord: XingWord,
  givenCoords: Coords
): Coords[] => {
  const wordPos: Coords[] = [];
  const dynamicDirection: number = xingWord.isAcross ? 1 : 0;
  const staticDirection: number = !xingWord.isAcross ? 1 : 0;
  const staticPos: number = givenCoords[staticDirection];
  const offset: number =
    givenCoords[dynamicDirection] - xingWord.letterIdxInWord;
  wordPos.push(givenCoords);
  for (let i = xingWord.letterIdxInWord - 1; i >= 0; i--)
    wordPos.splice(
      0,
      0,
      getCoordsGeneric(staticDirection, staticPos, dynamicDirection, i + offset)
    );
  for (let i = xingWord.letterIdxInWord + 1; i < xingWord.word.length; i++)
    wordPos.push(
      getCoordsGeneric(staticDirection, staticPos, dynamicDirection, i + offset)
    );
  return wordPos;
};

export const getUpdatedFirstWord = (
  givenWord: Word,
  puzHeight: number,
  puzWidth: number
): Word => {
  return getUpdatedWord(
    givenWord,
    true,
    getWordCoordsFromLetterCoords(
      makeXingWord(givenWord.word, Math.floor(givenWord.word.length / 2), true),
      [Math.floor(puzHeight / 2), Math.floor(puzWidth / 2)]
    )
  );
};

export const getWordCoords = (word: Word): Coords[] => {
  return word.coords as Coords[];
};

export const getWordPosSafe = (word: Word): Coords[] | null => {
  return word.coords;
};

export const getDisplayedWords = (words: Word[]) => {
  return words.filter(word => getWordPosSafe(word) !== null);
};
