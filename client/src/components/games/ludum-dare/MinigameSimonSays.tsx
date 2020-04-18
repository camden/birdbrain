import React, { useState, useCallback } from 'react';
import {
  LudumGameState,
  LudumMinigameSimonSaysState,
  LudumShape,
} from '@server/store/games/ludum-dare/types';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { ludumCheckMinigameAnswer } from '@server/store/games/ludum-dare/actions';
import { useCurrentPlayer } from 'utils/ludum-dare-utils';

export interface LudumMinigameSimonSaysProps {
  game: LudumGameState;
  minigame: LudumMinigameSimonSaysState;
}

const LudumMinigameSimonSays: React.FC<LudumMinigameSimonSaysProps> = ({
  game,
  minigame,
}) => {
  const dispatch = useDispatch();
  const [currentGuess, setCurrentGuess] = useState<LudumShape[]>([]);
  const currentPlayer = useCurrentPlayer(game);

  const onPressGuessButton = (guess: LudumShape) => {
    const nextGuess = currentGuess.concat([guess]);
    setCurrentGuess(nextGuess);
    dispatch(sendMessage(ludumCheckMinigameAnswer(nextGuess)));
  };

  const passedMinigame = game.playersWhoPassedCurrentMinigame.includes(
    currentPlayer.userId
  );

  return (
    <div>
      {passedMinigame && <strong>Congrats! You got the right answer</strong>}
      <div>simon says! sssh the phrase is "{minigame.phrase.join(', ')}"</div>
      <div>your guess: {currentGuess.join(', ')}</div>
      <Button onClick={() => onPressGuessButton(LudumShape.HEART)}>💙</Button>
      <Button onClick={() => onPressGuessButton(LudumShape.TRIANGLE)}>
        🔺️
      </Button>
      <Button onClick={() => onPressGuessButton(LudumShape.CIRCLE)}>🟠</Button>
    </div>
  );
};

export default LudumMinigameSimonSays;
