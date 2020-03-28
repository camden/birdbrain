import React, { useState, useCallback } from 'react';
import {
  FishbowlGameState,
  FishbowlPlayer,
} from '@server/store/games/fishbowl/types';
import useSelector from 'store/use-selector';
import { getCurrentUser } from 'store/selectors';
import { useDispatch } from 'react-redux';
import styles from './InputAnswers.module.css';
import { ANSWERS_PER_PLAYER } from '@server/store/games/fishbowl';
import TextInput from 'components/shared/form/TextInput';
import Button from 'components/shared/button/Button';
import { sendMessage } from 'store/websocket/actions';
import { fshSubmitAnswer } from '@server/store/games/fishbowl/actions';
import WaitingMessage from '../the-resistance/WaitingMessage';
import { prop } from 'ramda';

export interface InputAnswersProps {
  game: FishbowlGameState;
}

const InputAnswers: React.FC<InputAnswersProps> = ({ game }) => {
  const currentUser = useSelector(getCurrentUser());
  const [curAnswer, setCurAnswer] = useState('');
  const dispatch = useDispatch();

  const onSubmitAnswer = useCallback(() => {
    dispatch(sendMessage(fshSubmitAnswer(curAnswer)));
    setCurAnswer('');
  }, [dispatch, curAnswer]);

  if (!currentUser) {
    return (
      <div>
        Something went wrong, we're not seeing you as being part of this game.
      </div>
    );
  }

  const answersAlreadySubmitted = game.answersSubmitted[currentUser.id];

  const playersWhoAreNotDone: FishbowlPlayer[] = game.players.filter(
    player => game.answersSubmitted[player.userId].length < ANSWERS_PER_PLAYER
  );

  if (answersAlreadySubmitted.length === ANSWERS_PER_PLAYER) {
    return (
      <div>
        <p>You've submitted all of your answers!</p>
        <WaitingMessage
          playersThatNeedToAct={playersWhoAreNotDone.map(prop('name'))}
          verb={'submit answers'}
        />
      </div>
    );
  }

  return (
    <div>
      <h1>
        Submit {ANSWERS_PER_PLAYER - answersAlreadySubmitted.length} answers
      </h1>
      <TextInput
        value={curAnswer}
        onChange={e => setCurAnswer(e.target.value)}
        onKeyPress={event => event.key === 'Enter' && onSubmitAnswer()}
      />
      <Button fullWidth onClick={onSubmitAnswer}>
        Submit
      </Button>
    </div>
  );
};

export default InputAnswers;
