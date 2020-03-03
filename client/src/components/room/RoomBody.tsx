import React from 'react';
import GameCard from 'components/shared/game-card/GameCard';
import { Room, User as UserType } from '@server/store/general/types';
import User from 'components/shared/user/User';
import styles from './Room.module.css';
import Button from 'components/shared/button/Button';
import RoomWrapper from './RoomWrapper';
import { GameType } from '@server/store/games/types';

export interface RoomBodyProps {
  room: Room;
  roomLeader: UserType;
  isCurrentUserRoomLeader: boolean;
  usersInRoom: UserType[];
  onStartGameClick: () => void;
  onChangeGameClick: () => void;
}

const RoomBody: React.FC<RoomBodyProps> = props => {
  return (
    <RoomWrapper room={props.room}>
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
          {props.room.selectedGameType && (
            <GameCard
              gameType={props.room.selectedGameType}
              onClick={
                props.isCurrentUserRoomLeader
                  ? props.onChangeGameClick
                  : undefined
              }
            />
          )}
          {!props.room.selectedGameType && (
            <Button
              secondary
              onClick={
                props.isCurrentUserRoomLeader
                  ? props.onChangeGameClick
                  : undefined
              }
            >
              Choose Game
            </Button>
          )}
        </section>
        {!props.isCurrentUserRoomLeader && (
          <div>Waiting for {props.roomLeader.name} to start the game.</div>
        )}
        {props.isCurrentUserRoomLeader && (
          <Button
            fullWidth
            onClick={props.onStartGameClick}
            disabled={!props.room.selectedGameType}
          >
            Start game
          </Button>
        )}
      </main>
    </RoomWrapper>
  );
};

export default RoomBody;
