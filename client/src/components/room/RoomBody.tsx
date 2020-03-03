import React from 'react';
import TopBar from 'components/shared/top-bar/TopBar';
import GameCard from 'components/shared/game-card/GameCard';
import { Room, User as UserType } from '@server/store/general/types';
import User from 'components/shared/user/User';
import styles from './Room.module.css';
import Button from 'components/shared/button/Button';

export interface RoomBodyProps {
  room: Room;
  roomLeader: UserType;
  isCurrentUserRoomLeader: boolean;
  usersInRoom: UserType[];
  onStartGameClick: () => void;
}

const RoomBody: React.FC<RoomBodyProps> = props => {
  return (
    <div className={styles.room}>
      <TopBar room={props.room} />
      <main className={styles.room_body}>
        <section className={styles.users_section}>
          <h2 className={styles.subtitle}>Who's Here</h2>
          <div className={styles.user_list}>
            {props.usersInRoom.map(user => (
              <User
                key={user.id}
                user={user}
                isLeader={props.roomLeader.id === user.id}
              />
            ))}
          </div>
        </section>
        <section className={styles.game_section}>
          <h2 className={styles.subtitle}>Next Up</h2>
          <GameCard
            title="The Resistance"
            playerCount="5-10"
            time="30 min"
            description={'A classic party game of social deduction.'}
          />
        </section>
        {!props.isCurrentUserRoomLeader && (
          <div>Waiting for {props.roomLeader.name} to start the game.</div>
        )}
        {props.isCurrentUserRoomLeader && (
          <Button fullWidth onClick={props.onStartGameClick}>
            Start game
          </Button>
        )}
      </main>
    </div>
  );
};

export default RoomBody;
