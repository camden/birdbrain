import React, { useCallback, useState } from 'react';
import { LudumGameState } from '@server/store/games/ludum-dare/types';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { ludumAck } from '@server/store/games/ludum-dare/actions';
import { useCurrentPlayer } from 'utils/ludum-dare-utils';
import LudumCharacter, { CharacterType, CharacterAnimation } from './Character';
import styles from './Intro.module.css';

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

  const name = (
    <span style={{ color: character.color, display: 'inline-block' }}>
      {character.name}
    </span>
  );

  if (tutorialStage === 1) {
    topText = <span>This is {name}.</span>;
    bottomText = <span>{name} needs your help.</span>;
    buttonText = 'How can I help?';
    animation = CharacterAnimation.HOVER;
    characterType = CharacterType.IDLE;
  } else if (tutorialStage === 2) {
    topText = <span>Well, {name} wants you to play minigames.</span>;
    bottomText = <span>{name} loves a good game. But...</span>;
    buttonText = 'Yeah...?';
    animation = CharacterAnimation.SWAY;
    characterType = CharacterType.PUZZLED;
  } else if (tutorialStage === 3) {
    topText = <span>...if you fail 3 times, {name} will DIE.</span>;
    bottomText = <span>Can you keep {name} alive?</span>;
    buttonText = "Let's do it!";
    animation = CharacterAnimation.SHAKE;
    characterType = CharacterType.NERVOUS;
  }

  return (
    <div className={styles.wrapper}>
      <h1>{topText}</h1>
      <LudumCharacter
        className={styles.character}
        id={character.id}
        type={characterType}
        animation={animation}
      />
      <h1>{bottomText}</h1>
      <Button onClick={onContinueClick}>{buttonText}</Button>
    </div>
  );
};

export default LudumIntro;
