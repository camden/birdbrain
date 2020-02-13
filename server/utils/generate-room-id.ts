import { pickRandomNumber } from './rng';

const possibleLetters = 'abcdefghijklmnopqrstuvwxyz';

const generateSingleLetter = () => {
  const letterNum = pickRandomNumber(0, possibleLetters.length - 1);
  return possibleLetters.charAt(letterNum);
};

const ROOM_ID_LENGTH = 4;

const generateRoomId = () => {
  let code = '';
  for (let i = 0; i < ROOM_ID_LENGTH; i++) {
    code = code + generateSingleLetter();
  }
  return code.toUpperCase();
};

export default generateRoomId;
