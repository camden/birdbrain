import React, { useState, useCallback } from 'react';
import useHumanInput from './useHumanInput';
import styles from './ClapScore.module.css';
import {
  faEar,
  IconDefinition,
  faClock,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import TextInput from 'components/shared/form/TextInput';
import { curry } from 'ramda';
import useSound from 'hooks/use-sound';
import Button from 'components/shared/button/Button';
const ScoreSoundEffect = require('assets/sounds/chime_bell_ding.wav');
const UndoSoundEffect = require('assets/sounds/chime_short_cancel.wav');

export interface ClapScoreProps {}

export enum Status {
  WAITING_FOR_INPUT,
  LISTENING,
}

export enum Team {
  LEFT,
  RIGHT,
}

const getIconForStatus = (status: Status): IconDefinition => {
  switch (status) {
    case Status.WAITING_FOR_INPUT:
      return faEar;
    case Status.LISTENING:
      return faEar;
  }
};

const uttered = curry((phrase: string, keyword: string): boolean => {
  return phrase.toLowerCase().includes(keyword.toLowerCase());
});

const ClapScore: React.FC<ClapScoreProps> = () => {
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [leftName, setLeftName] = useState('Player 1');
  const [rightName, setRightName] = useState('Player 2');
  const [status, setStatus] = useState<Status>(Status.WAITING_FOR_INPUT);
  const [scoredLast, setScoredLast] = useState<Team | null>(null);
  const [lastPhraseUttered, setLastPhraseUttered] = useState('');
  const playScoreSoundEffect = useSound(ScoreSoundEffect);
  const playUndoSound = useSound(UndoSoundEffect);

  const onSpeechRealtime = useCallback((event: any, transcript: string) => {
    setStatus(Status.LISTENING);
    setTimeout(() => {
      setStatus(Status.WAITING_FOR_INPUT);
    }, 1000);
  }, []);

  const handlePointScored = useCallback(
    (team: Team) => {
      playScoreSoundEffect();
      if (team === Team.LEFT) {
        setLeftScore((l) => l + 1);
        setScoredLast(Team.LEFT);
      } else {
        setRightScore((r) => r + 1);
        setScoredLast(Team.RIGHT);
      }
    },
    [playScoreSoundEffect]
  );

  const handleUndo = () => {
    playUndoSound();

    if (scoredLast === Team.LEFT) {
      setLeftScore((l) => l - 1);
      return;
    }

    if (scoredLast === Team.RIGHT) {
      setRightScore((r) => r - 1);
      return;
    }
  };

  const onSpeech = (event: any, transcript: string) => {
    setLastPhraseUttered(transcript);

    const utteredInSpeech = uttered(transcript);

    const undoKeywords = ['undo'];
    const undoKeywordsTriggered = undoKeywords.some(utteredInSpeech);

    if (undoKeywordsTriggered) {
      handleUndo();
      return;
    }

    const pointKeywords = ['point', '.', 'scored'];
    const pointKeywordTriggered = pointKeywords.some(utteredInSpeech);

    if (!pointKeywordTriggered) {
      return;
    }

    if (utteredInSpeech(leftName)) {
      handlePointScored(Team.LEFT);
      return;
    }

    if (utteredInSpeech(rightName)) {
      handlePointScored(Team.RIGHT);
      return;
    }
  };

  useHumanInput({
    onSpeechRealtime,
    onSpeech,
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.status}>
        <FontAwesomeIcon
          icon={getIconForStatus(status)}
          size="10x"
          className={cx(styles.statusIcon, {
            [styles.statusListening]: status === Status.LISTENING,
          })}
        />
      </div>
      <div className={styles.scores}>
        <div className={styles.scoreWrapper}>
          <h1 className={styles.score}>{leftScore}</h1>
          <TextInput
            className={styles.playerNameInput}
            value={leftName}
            onChange={(evt) => setLeftName(evt.target.value)}
          />
        </div>
        <div className={styles.scoreWrapper}>
          <h1 className={styles.score}>{rightScore}</h1>
          <TextInput
            className={styles.playerNameInput}
            value={rightName}
            onChange={(evt) => setRightName(evt.target.value)}
          />
        </div>
      </div>
      <div className={styles.lastPhrase}>
        {lastPhraseUttered && `"${lastPhraseUttered}"`}
      </div>
      <section className={styles.buttons}>
        <Button
          onClick={() => {
            setScoredLast(null);
            setLeftScore(0);
            setRightScore(0);
          }}
        >
          Reset Score
        </Button>
      </section>
    </div>
  );
};

export default ClapScore;
