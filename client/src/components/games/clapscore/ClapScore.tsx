import React, { useState, useCallback, useEffect } from 'react';
import useHumanInput from './useHumanInput';
import styles from './ClapScore.module.css';
import {
  faEar,
  IconDefinition,
  faClock,
  faArrowLeft,
  faArrowRight,
  faTableTennis,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import TextInput from 'components/shared/form/TextInput';
import { curry, mathMod } from 'ramda';
import useSound from 'hooks/use-sound';
import Button from 'components/shared/button/Button';
import { pickElementAndRemoveFromArr, pickElement } from '@server/utils/rng';
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

const getOppositeTeam = (team: Team): Team => {
  if (team === Team.LEFT) {
    return Team.RIGHT;
  } else {
    return Team.LEFT;
  }
};

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

const possiblePlayerNames = [
  'Alpha',
  'Bravo',
  'Delta',
  'Charlie',
  'Hotshot',
  'Rambo',
  'King',
  'Queen',
  'Dumbo',
  'Yeet',
];

const ClapScore: React.FC<ClapScoreProps> = () => {
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [leftName, setLeftName] = useState('Player 1');
  const [rightName, setRightName] = useState('Player 2');
  const [status, setStatus] = useState<Status>(Status.WAITING_FOR_INPUT);
  const [scoredLast, setScoredLast] = useState<Team | null>(null);
  const [lastPhraseUttered, setLastPhraseUttered] = useState('');
  const [isSystemTalking, setIsSystemTalking] = useState(false);
  const [firstServer, setFirstServer] = useState<Team>(Team.LEFT);
  const playScoreSoundEffect = useSound(ScoreSoundEffect);
  const playUndoSound = useSound(UndoSoundEffect);

  useEffect(() => {
    let poolOfNames = [...possiblePlayerNames];
    const [name1, arr] = pickElementAndRemoveFromArr(poolOfNames);
    poolOfNames = arr;
    const name2 = pickElement(poolOfNames)[0];
    if (!name1 || !name2) {
      console.error('Something went wrong');
      return;
    }

    setLeftName(name1);
    setRightName(name2);
  }, []);

  const onSpeechRealtime = useCallback(
    (event: any, transcript: string) => {
      if (isSystemTalking) {
        return;
      }

      setStatus(Status.LISTENING);
      setTimeout(() => {
        setStatus(Status.WAITING_FOR_INPUT);
      }, 1000);
    },
    [isSystemTalking]
  );

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
    if (isSystemTalking) {
      return;
    }

    setLastPhraseUttered(transcript);
    const utteredInSpeech = uttered(transcript);

    const resetScoreTriggered = ['reset', 'start over', 'new game'].some(
      utteredInSpeech
    );
    if (resetScoreTriggered) {
      setLeftScore(0);
      setRightScore(0);
    }

    const checkKeywords = ['check', 'check score', 'the score'];
    const checkKeywordsTriggered = checkKeywords.some(utteredInSpeech);
    if (checkKeywordsTriggered) {
      const leftIsWinning = leftScore > rightScore;
      const isTied = leftScore === rightScore;

      let conclusion = isTied
        ? 'The game is tied.'
        : `${leftIsWinning ? leftName : rightName} is winning.`;

      const biggerScore = Math.max(leftScore, rightScore);
      const smallerScore = Math.min(leftScore, rightScore);

      if (smallerScore === 0) {
        if (Math.random() > 0.5) {
          conclusion += ' Remember, seven nothing is a shut out!';
        }
      }

      const synth = window.speechSynthesis;
      const phrase = new SpeechSynthesisUtterance(
        `${biggerScore} to ${smallerScore}. ${conclusion}`
      );

      setIsSystemTalking(true);
      setTimeout(() => {
        setIsSystemTalking(false);
      }, 3000);

      synth.speak(phrase);
      return;
    }

    const undoKeywords = ['undo'];
    const undoKeywordsTriggered = undoKeywords.some(utteredInSpeech);

    if (undoKeywordsTriggered) {
      handleUndo();
      return;
    }

    const pointKeywords = ['point', '.', 'scored'];
    const pointKeywordTriggered = pointKeywords.some(utteredInSpeech);
    const serverKeywordsTriggered = ['serving', 'serves', 'serve'].some(
      utteredInSpeech
    );
    const setScoreKeywordsTriggered = ['set'].some(utteredInSpeech);
    const capturedNumberRegex = transcript.match(/\d+/);
    const capturedNumber =
      capturedNumberRegex && parseInt(capturedNumberRegex[0]);

    if (!pointKeywordTriggered) {
      // return;
    }

    if (utteredInSpeech(leftName)) {
      if (serverKeywordsTriggered) {
        setFirstServer(Team.LEFT);
        return;
      }
      if (setScoreKeywordsTriggered && !!capturedNumber) {
        setLeftScore(capturedNumber);
        return;
      }
      handlePointScored(Team.LEFT);
      return;
    }

    if (utteredInSpeech(rightName)) {
      if (serverKeywordsTriggered) {
        setFirstServer(Team.RIGHT);
        return;
      }
      if (setScoreKeywordsTriggered && !!capturedNumber) {
        setRightScore(capturedNumber);
        return;
      }
      handlePointScored(Team.RIGHT);
      return;
    }
  };

  useHumanInput({
    onSpeechRealtime,
    onSpeech,
  });

  const serverIsSameAsFirstServer =
    Math.floor((leftScore + rightScore) / 2) % 2 === 0;

  const server: Team = serverIsSameAsFirstServer
    ? firstServer
    : getOppositeTeam(firstServer);

  return (
    <div className={styles.wrapper}>
      <div className={styles.status}>
        <FontAwesomeIcon
          icon={faTableTennis}
          size="10x"
          className={cx(styles.statusIcon, {
            [styles.isServing]: server === Team.LEFT,
          })}
        />
        <FontAwesomeIcon
          icon={getIconForStatus(status)}
          size="10x"
          className={cx(styles.statusIcon, {
            [styles.statusListening]: status === Status.LISTENING,
          })}
        />
        <FontAwesomeIcon
          icon={faTableTennis}
          size="10x"
          className={cx(styles.statusIcon, {
            [styles.isServing]: server === Team.RIGHT,
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
