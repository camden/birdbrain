import React from 'react';
import { LudumOriginalPlayer } from '@server/store/games/ludum-dare-original/types';
import LudumOriginalCharacter, {
  CharacterType,
  CharacterAnimation,
} from './Character';
import { times, identity } from 'ramda';
import LudumOriginalHeart from './Heart';
import styles from './PlayerInfo.module.css';
import cx from 'classnames';

export interface LudumOriginalPlayerInfoProps {
  player: LudumOriginalPlayer;
  className?: string;
}

const LudumOriginalPlayerInfo: React.FC<LudumOriginalPlayerInfoProps> = ({
  player,
  className,
}) => {
  return (
    <div className={cx(styles.wrapper, className)}>
      <div className={styles.characterAndHealth}>
        <LudumOriginalCharacter
          id={player.character.id}
          type={CharacterType.ICON}
          className={styles.character}
          animation={CharacterAnimation.HOVER_SMALL}
        />
        <div className={styles.heartsContainer}>
          {times(identity, player.health).map((idx) => (
            <div
              key={idx}
              style={{ animationDelay: -(idx * 250 + 2250) + 'ms' }}
              className={styles.heartWrapper}
            >
              <LudumOriginalHeart className={styles.heart} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.playerName}>{player.name}</div>
    </div>
  );
};

export default LudumOriginalPlayerInfo;
