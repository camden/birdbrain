import React from 'react';
import { Room } from '@server/store/general/types';
import RoomWrapper from './RoomWrapper';
import { GameType } from '@server/store/games/types';
import Button from 'components/shared/button/Button';
import { faAngleLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Room.module.css';
import GameCard from 'components/shared/game-card/GameCard';

export interface PickGameProps {
  room: Room;
  onCancel: () => void;
  onPickGame: (game: GameType) => void;
}

const PickGame: React.FC<PickGameProps> = props => {
  return (
    <RoomWrapper room={props.room}>
      <div>
        <Button secondary small onClick={props.onCancel}>
          <FontAwesomeIcon
            icon={faAngleLeft}
            size="lg"
            className={styles.button_icon}
          />
          Back
        </Button>
      </div>
      <h1 className={styles.title}>Pick a Game</h1>
      <GameCard
        gameType={GameType.THE_RESISTANCE}
        onClick={() => props.onPickGame(GameType.THE_RESISTANCE)}
      />
      <GameCard
        gameType={GameType.SKULL}
        onClick={() => props.onPickGame(GameType.SKULL)}
      />
    </RoomWrapper>
  );
};

export default PickGame;
