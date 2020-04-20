import React from 'react';
import { LudumPlayer } from '@server/store/games/ludum-dare/types';
import LudumCharacter, { CharacterType, CharacterAnimation } from './Character';
import { times, identity } from 'ramda';
import LudumHeart from './Heart';
import styles from './PlayerInfo.module.css';
import cx from 'classnames';

export interface LudumPlayerInfoProps {
  player: LudumPlayer;
  className?: string;
}

const LudumPlayerInfo: React.FC<LudumPlayerInfoProps> = ({
  player,
  className,
}) => {
  return (
    <div className={cx(styles.wrapper, className)}>
      <div className={styles.characterAndHealth}>
        <LudumCharacter
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
              <LudumHeart className={styles.heart} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.playerName}>{player.name}</div>
    </div>
  );
};

export default LudumPlayerInfo;
