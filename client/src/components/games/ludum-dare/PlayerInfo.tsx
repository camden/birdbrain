import React from 'react';
import { LudumPlayer } from '@server/store/games/ludum-dare/types';
import LudumCharacter, { CharacterType } from './Character';
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
        />
        <div className={styles.heartContainer}>
          {times(identity, player.health).map((idx) => (
            <LudumHeart key={idx} className={styles.heart} />
          ))}
        </div>
      </div>
      <div className={styles.playerName}>{player.name}</div>
    </div>
  );
};

export default LudumPlayerInfo;
