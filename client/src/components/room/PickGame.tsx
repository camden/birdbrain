import React from 'react';
import { Room } from '@server/store/general/types';
import RoomWrapper from './RoomWrapper';
import { GameType } from '@server/store/games/types';
import Button from 'components/shared/button/Button';
import { faAngleLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './PickGame.module.css';
import GameCard from 'components/shared/game-card/GameCard';

export interface PickGameProps {
  room: Room;
  onCancel: () => void;
  onPickGame: (game: GameType) => void;
}

const PickGame: React.FC<PickGameProps> = props => {
  return (
    <RoomWrapper room={props.room} className={styles.wrapper}>
      <main className={styles.pick_game}>
        <section className={styles.header}>
          <div>
            <Button secondary small playSound onClick={props.onCancel}>
              <FontAwesomeIcon
                icon={faAngleLeft}
                size="lg"
                className={styles.button_icon}
              />
              Back
            </Button>
          </div>
          <h1 className={styles.title}>Pick a Game</h1>
        </section>
        <section className={styles.list_of_game_cards}>
          <GameCard
            className={styles.game_card}
            gameType={GameType.THE_RESISTANCE}
            onClick={() => props.onPickGame(GameType.THE_RESISTANCE)}
            playSound
          />
          <GameCard
            className={styles.game_card}
            gameType={GameType.FISHBOWL}
            onClick={() => props.onPickGame(GameType.FISHBOWL)}
            playSound
          />
          <GameCard
            className={styles.game_card}
            gameType={GameType.CHAT}
            onClick={() => props.onPickGame(GameType.CHAT)}
            playSound
          />
          <GameCard
            className={styles.game_card}
            gameType={GameType.SKULL}
            onClick={() => props.onPickGame(GameType.SKULL)}
            playSound
          />
        </section>
      </main>
    </RoomWrapper>
  );
};

export default PickGame;
