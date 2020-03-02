import React, { useEffect } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import QueryString from 'query-string';
import { useDispatch } from 'react-redux';
import { connectToRoom } from 'store/websocket/actions';
import useSelector from 'store/use-selector';
import styles from './Room.module.css';
import Button from 'components/shared/button/Button';
import LinkButton from 'components/shared/button/LinkButton';
import User from 'components/shared/user/User';
import Game from 'components/games/Game';
import { sendStartGame } from 'messages/general-messages';
import {
  getIsRoomLeader,
  getUsersInRoom,
  getRoomLeader,
  getGame,
} from 'store/selectors';
import TopBar from 'components/shared/top-bar/TopBar';
import GameCard from 'components/shared/game-card/GameCard';

// TODO this FC is getting sorta big. split this out in the future?
const Room: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const room = useSelector(state => state.room);
  const isRoomLeader = useSelector(getIsRoomLeader());
  const usersInRoom = useSelector(getUsersInRoom());
  const roomLeader = useSelector(getRoomLeader());
  const game = useSelector(getGame());

  useEffect(() => {
    if (!id) {
      return;
    }

    const obj = QueryString.parse(window.location.search);
    if (!obj) {
      // throw an error here because no name was supplied!!
      alert('error: no name supplied');
      return;
    }

    const name = obj.name as string;

    dispatch(connectToRoom(id, name));
  }, [id, dispatch]);

  if (!room) {
    return (
      <div className={styles.room_body}>
        <h1>Room '{id}' does not exist.</h1>
        <LinkButton to={'/'}>Go Home</LinkButton>
      </div>
    );
  }

  if (game) {
    return <Game room={room} />;
  }

  return (
    <div className={styles.room}>
      <TopBar room={room} />
      <main className={styles.room_body}>
        <section className={styles.users_section}>
          <h2 className={styles.subtitle}>Who's Here</h2>
          <div className={styles.user_list}>
            {usersInRoom.map(user => (
              <User
                key={user.id}
                user={user}
                isLeader={roomLeader?.id === user.id}
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
        {!isRoomLeader && (
          <div>Waiting for {roomLeader?.name} to start the game.</div>
        )}
        {isRoomLeader && (
          <Button fullWidth onClick={() => dispatch(sendStartGame())}>
            Start game
          </Button>
        )}
      </main>
    </div>
  );
};

export default withRouter(Room);
