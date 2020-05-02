import {
  faEar,
  faTableTennis,
  IconDefinition,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { pickElement, pickRandomNumber } from '@server/utils/rng';
import cx from 'classnames';
import Button from 'components/shared/button/Button';
import useSound from 'hooks/use-sound';
import { curry } from 'ramda';
import React, { useCallback, useRef, useState } from 'react';
import styles from './ClapScore.module.css';
import useSpeechRecognition from './useSpeechRecognition';
import useStateRef from './useStateRef';
const ScoreSoundEffect = require('assets/sounds/chime_bell_ding.wav');
const UndoSoundEffect = require('assets/sounds/chime_short_cancel.wav');
const SwitchServeSoundEffect = require('assets/sounds/music_marimba_logo.wav');

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

const uttered = curry(
  (phrase: string, alternatives: string[], keyword: string): boolean => {
    return (
      phrase.toLowerCase().includes(keyword.toLowerCase()) ||
      alternatives.some((a) => a.toLowerCase().includes(keyword.toLowerCase()))
    );
  }
);

const checkNums = curry(
  (a: number, b: number, c: number, d: number): boolean => {
    return a === c && b === d;
  }
);

const getCatchphrases = (firstScore: number, secondScore: number): string[] => {
  const match = checkNums(firstScore, secondScore);

  if (match(6, 9)) {
    return ['ha ha 69', 'ha ha sex number'];
  }

  if (match(7, 6)) {
    return ['76 trombones'];
  }

  if (match(10, 4)) {
    return ['10 4 good buddy', '10 4, over and out'];
  }

  if (match(7, 7)) {
    return ['7 up the uncola!'];
  }

  if (match(9, 11)) {
    return ['9 11 oh oh'];
  }

  if (match(8, 8)) {
    return ['loko oh chose'];
  }

  if (match(2, 1)) {
    return ['21 jump street'];
  }

  if (match(2, 3)) {
    return ['23 skidoo'];
  }

  if (match(1, 9)) {
    return ['breaker breaker 1 9'];
  }

  if (match(2, 2)) {
    return ['deuces wild'];
  }

  if (match(1, 2)) {
    return ['1 2 buckle my shoe'];
  }

  if (match(5, 4)) {
    return ['studio 54'];
  }

  if (match(7, 10)) {
    return ['7 10 split'];
  }

  if (match(5, 5)) {
    return ["can't drive 55"];
  }

  if (match(6, 6)) {
    return ['get your kicks on route 66'];
  }

  if (match(7, 0) || match(0, 7)) {
    return [`that's a shut out!`, 'oof', 'G G game over'];
  }

  return [];
};

const ClapScore: React.FC<ClapScoreProps> = () => {
  // these two should be props
  const leftName = 'Alpha';
  const rightName = 'Bravo';

  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [status, setStatus] = useState<Status>(Status.WAITING_FOR_INPUT);
  const [scoredLast, setScoredLast, scoredLastRef] = useStateRef<Team | null>(
    null
  );
  const [lastPhraseUttered, setLastPhraseUttered] = useState('');
  const [isSystemTalking, setIsSystemTalking] = useState(false);
  const [firstServer, setFirstServer] = useState<Team>(Team.LEFT);
  const playScoreSoundEffect = useSound(ScoreSoundEffect);
  const playUndoSound = useSound(UndoSoundEffect);
  const playSwitchServeSound = useSound(SwitchServeSoundEffect);

  const getServer = (nextLeftScore?: number, nextRightScore?: number): Team => {
    const l = nextLeftScore || leftScore;
    const r = nextRightScore || rightScore;

    const serverIsSameAsFirstServer = Math.floor((l + r) / 2) % 2 === 0;

    const server: Team = serverIsSameAsFirstServer
      ? firstServer
      : getOppositeTeam(firstServer);

    return server;
  };

  const isSystemTalkingRef = useRef<boolean>(false);
  const systemTalkingTimeout = useRef<NodeJS.Timeout | null>(null);
  const say = useCallback((phrase: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(phrase);

    setIsSystemTalking(true);
    isSystemTalkingRef.current = true;
    systemTalkingTimeout.current && clearTimeout(systemTalkingTimeout.current);
    systemTalkingTimeout.current = setTimeout(() => {
      setIsSystemTalking(false);
      isSystemTalkingRef.current = false;
    }, 4000);

    synth.speak(utterance);
  }, []);

  const statusTimeout = useRef<NodeJS.Timeout | null>(null);
  const onSpeechRealtime = useCallback(
    (event: any, transcript: string, alternatives: string[]) => {
      if (!!isSystemTalkingRef.current) {
        return;
      }

      setStatus(Status.LISTENING);
      statusTimeout.current && clearInterval(statusTimeout.current);
      statusTimeout.current = setTimeout(() => {
        setStatus(Status.WAITING_FOR_INPUT);
      }, 1000);
    },
    [isSystemTalking]
  );

  const maybePlayCatchphrase = (
    firstScore: number,
    secondScore: number
  ): void => {
    const possiblePhrases = getCatchphrases(firstScore, secondScore);
    if (possiblePhrases.length === 0) {
      return;
    }

    if (pickRandomNumber(1, 1) === 1) {
      const catchphrase = pickElement(possiblePhrases)[0] as string;
      setTimeout(() => {
        say(catchphrase);
      }, 500);
    }
  };

  const handlePointScored = (team: Team) => {
    playScoreSoundEffect();

    if (team === Team.LEFT) {
      setLeftScore((score) => score + 1);
      setScoredLast(Team.LEFT);
    } else {
      setRightScore((score) => score + 1);
      setScoredLast(Team.RIGHT);
    }

    // this is a huge hack
    setLeftScore((leftScore) => {
      setRightScore((rightScore) => {
        const nextLeftScore = leftScore; // looks like it's reflecting the previous update...
        const nextRightScore = rightScore; // can we rely on this behavior?

        const serveChange = (nextLeftScore + nextRightScore) % 2 === 0;
        if (serveChange) {
          playSwitchServeSound();
        }

        let firstScore;
        let secondScore;

        if (getServer(nextLeftScore, nextRightScore) === Team.LEFT) {
          firstScore = nextLeftScore;
          secondScore = nextRightScore;
        } else {
          firstScore = nextRightScore;
          secondScore = nextLeftScore;
        }

        maybePlayCatchphrase(firstScore, secondScore);
        return rightScore;
      });
      return leftScore;
    });
  };

  const handleUndo = () => {
    playUndoSound();

    if (scoredLastRef.current === Team.LEFT) {
      setLeftScore((l) => l - 1);
    }

    if (scoredLastRef.current === Team.RIGHT) {
      setRightScore((r) => r - 1);
    }
  };

  const onSpeech = (event: any, transcript: string, alternatives: string[]) => {
    if (!!isSystemTalkingRef.current) {
      return;
    }

    setLastPhraseUttered(transcript);
    const utteredInSpeech = uttered(transcript, alternatives);

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

      // another hack. so annoying :(
      setLeftScore((leftScore) => {
        setRightScore((rightScore) => {
          const biggerScore = Math.max(leftScore, rightScore);
          const smallerScore = Math.min(leftScore, rightScore);

          let conclusion = isTied
            ? 'The game is tied.'
            : `${leftIsWinning ? leftName : rightName} is winning.`;

          if (smallerScore === 0) {
            if (Math.random() > 0.5) {
              conclusion += ' Remember, seven nothing is a shut out!';
            }
          }

          let phrase = `${biggerScore} to ${smallerScore}. ${conclusion}`;

          say(phrase);

          return rightScore;
        });
        return leftScore;
      });
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
        playSwitchServeSound();
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
        playSwitchServeSound();
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

  useSpeechRecognition({
    onSpeechRealtime,
    onSpeech,
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.status}>
        <FontAwesomeIcon
          icon={faTableTennis}
          size="10x"
          className={cx(styles.statusIcon, {
            [styles.isServing]: getServer() === Team.LEFT,
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
            [styles.isServing]: getServer() === Team.RIGHT,
          })}
        />
      </div>
      <div className={styles.scores}>
        <div className={styles.scoreWrapper}>
          <h1 className={styles.score}>{leftScore}</h1>
          <div className={styles.playerName}>{leftName}</div>
        </div>
        <div className={styles.scoreWrapper}>
          <h1 className={styles.score}>{rightScore}</h1>
          <div className={styles.playerName}>{rightName}</div>
        </div>
      </div>
      <div className={styles.lastPhrase}>
        {lastPhraseUttered && `"${lastPhraseUttered.trim()}"`}
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
