import React, { useCallback } from 'react';
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

  const onContinueClick = useCallback(() => {
    dispatch(sendMessage(ludumAck()));
  }, [dispatch]);

  const character = currentPlayer.character;

  return (
    <div className={styles.wrapper}>
      <div>
        this is where a brief intro to your character and a short tutorial might
        go.
      </div>
      <LudumCharacter
        className={styles.character}
        id={character.id}
        type={CharacterType.IDLE}
        animation={CharacterAnimation.HOVER}
      />
      <Button onClick={onContinueClick}>got it!</Button>
    </div>
  );
};

export default LudumIntro;
