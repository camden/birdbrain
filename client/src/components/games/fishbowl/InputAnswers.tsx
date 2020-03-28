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
import answers from '@server/store/games/fishbowl/answers';
import { pickRandomNumber } from '@server/utils/rng';

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

  const onSuggestAnswer = useCallback(() => {
    const randomAnswer = answers[pickRandomNumber(0, answers.length - 1)];
    setCurAnswer(randomAnswer);
  }, []);

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
      <div className={styles.wrapper}>
        <p>You've submitted all of your answers!</p>
        <WaitingMessage
          playersThatNeedToAct={playersWhoAreNotDone.map(prop('name'))}
          verb={'submit their answers'}
        />
      </div>
    );
  }

  const answersLeft = ANSWERS_PER_PLAYER - answersAlreadySubmitted.length;

  return (
    <div className={styles.wrapper}>
      <h1>
        Submit {answersLeft} more answer{answersLeft !== 1 ? 's' : ''}.
      </h1>
      <p>
        An answer can be a short phrase, a word, a celebrity name, a movie, etc
      </p>
      <TextInput
        className={styles.input}
        value={curAnswer}
        onChange={e => setCurAnswer(e.target.value)}
        onKeyPress={event => event.key === 'Enter' && onSubmitAnswer()}
      />
      <Button className={styles.button} fullWidth onClick={onSubmitAnswer}>
        Submit
      </Button>
      <Button
        className={styles.button}
        secondary
        fullWidth
        onClick={onSuggestAnswer}
      >
        Suggest something for me
      </Button>
    </div>
  );
};

export default InputAnswers;
