import React, { useState } from 'react';
import {
  ResistanceGameState,
  ResistancePlayer,
  ResistanceMissionVote,
  ResistanceRole,
} from '@server/store/games/the-resistance/types';
import useSelector from 'store/use-selector';
import { getCurrentUser } from 'store/selectors';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { rstCastMissionVote } from '@server/store/games/the-resistance/actions';
import styles from './ConductMission.module.css';
import User from 'components/shared/user/User';
import { faClock, faCheck } from '@fortawesome/pro-solid-svg-icons';
import WaitingMessage from './WaitingMessage';

export interface ResistanceProps {
  game: ResistanceGameState;
}

const TheResistanceConductMission: React.FC<ResistanceProps> = ({ game }) => {
  const user = useSelector(getCurrentUser());
  const dispatch = useDispatch();
  const [voted, setVoted] = useState(false);

  if (!game.missionTeam || !user) {
    return null;
  }

  const missionTeam = game.missionTeam.map(id =>
    game.players.find(player => player.userId === id)
  ) as ResistancePlayer[];

  const currentUserIsOnTeam = game.missionTeam.includes(user.id);
  const currentPlayer = game.players.find(
    player => player.userId === user.id
  ) as ResistancePlayer;

  const onVoteClick = (vote: ResistanceMissionVote) => {
    dispatch(sendMessage(rstCastMissionVote(vote)));
    setVoted(true);
  };

  const successButton = (
    <Button onClick={() => onVoteClick(ResistanceMissionVote.SUCCESS)}>
      Success
    </Button>
  );

  const failButton = (
    <Button
      onClick={() => onVoteClick(ResistanceMissionVote.FAIL)}
      disabled={currentPlayer.role === ResistanceRole.Resistance}
    >
      Fail
    </Button>
  );

  const voteButtons = (
    <div className={styles.vote_buttons}>
      {successButton}
      {failButton}
    </div>
  );

  const allUsersWhoVoted = game.missionFailVotes.concat(
    game.missionSuccessVotes
  );
  const playersWhoStillNeedToVote = missionTeam.filter(
    player => !allUsersWhoVoted.includes(player.userId)
  );

  return (
    <div>
      <h1>The mission team is now conducting Mission {game.mission}.</h1>
      <section>
        {missionTeam.map(player => (
          <User
            key={player.userId}
            user={{ id: player.userId, name: player.name }}
            icon={
              playersWhoStillNeedToVote
                .map(p => p.userId)
                .includes(player.userId)
                ? faClock
                : faCheck
            }
          />
        ))}
      </section>
      {currentUserIsOnTeam && <h2>Vote on the mission outcome:</h2>}
      {currentUserIsOnTeam && !voted && voteButtons}
      <WaitingMessage
        playersThatNeedToAct={playersWhoStillNeedToVote}
        verb={'vote'}
      />
    </div>
  );
};

export default TheResistanceConductMission;
