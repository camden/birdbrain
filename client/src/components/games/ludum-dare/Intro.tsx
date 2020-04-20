import React, { useCallback, useState } from 'react';
import { LudumGameState } from '@server/store/games/ludum-dare/types';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { ludumAck } from '@server/store/games/ludum-dare/actions';
import { useCurrentPlayer } from 'utils/ludum-dare-utils';
import LudumCharacter, { CharacterType, CharacterAnimation } from './Character';
import styles from './Intro.module.css';
import WaitingMessage from 'components/shared/WaitingMessage';

export interface LudumIntroProps {
  game: LudumGameState;
}

const LudumIntro: React.FC<LudumIntroProps> = ({ game }) => {
  const dispatch = useDispatch();
  const currentPlayer = useCurrentPlayer(game);

  const [tutorialStage, setTutorialStage] = useState(1);

  const onContinueClick = useCallback(() => {
    if (tutorialStage < 3) {
      setTutorialStage(tutorialStage + 1);
    } else {
      return dispatch(sendMessage(ludumAck()));
    }
  }, [dispatch, tutorialStage]);

  const character = currentPlayer.character;

  let animation;
  let characterType;
  let topText;
  let bottomText;
  let buttonText;
  let buttonSecondary = true;
  let typeWhenPressed;

  const name = <span style={{ color: character.color }}>{character.name}</span>;

  if (tutorialStage === 1) {
    topText = <span>This is {name}.</span>;
    bottomText = <span>{name} needs your help.</span>;
    buttonText = 'How can I help?';
    animation = CharacterAnimation.HOVER;
    characterType = CharacterType.IDLE;
  } else if (tutorialStage === 2) {
    topText = <span>{name} wants to play some games.</span>;
    bottomText = <span>{name} loves a good game. But...</span>;
    buttonText = 'Yeah...?';
    animation = CharacterAnimation.SWAY;
    characterType = CharacterType.PUZZLED;
  } else if (tutorialStage === 3) {
    topText = <span>...fail 3 times, and {name} will DIE.</span>;
    bottomText = <span>Can you keep {name} alive?</span>;
    buttonText = "Let's do it!";
    typeWhenPressed = CharacterType.LOSE;
    animation = CharacterAnimation.SHAKE;
    buttonSecondary = false;
    characterType = CharacterType.NERVOUS;
  }

  const currentPlayerAcked = game.acknowledged.includes(currentPlayer.userId);
  const playersWhoNeedToAck = game.players.filter(
    (p) => !game.acknowledged.includes(p.userId)
  );

  return (
    <div className={styles.wrapper}>
      <h1>{topText}</h1>
      <div className={styles.characterWrapper}>
        <LudumCharacter
          className={styles.character}
          id={character.id}
          type={characterType}
          animation={animation}
          typeWhenPressed={typeWhenPressed}
        />
      </div>
      <h1>{bottomText}</h1>
      <div className={styles.footer}>
        {currentPlayerAcked && (
          <WaitingMessage
            playersThatNeedToAct={playersWhoNeedToAck.map((p) => p.name)}
            verb={'move on'}
          />
        )}
        {!currentPlayerAcked && (
          <Button onClick={onContinueClick} secondary={buttonSecondary}>
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default LudumIntro;
