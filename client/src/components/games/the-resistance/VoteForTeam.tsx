import React, { useState } from 'react';
import {
  ResistanceGameState,
  ResistancePlayer,
  ResistanceTeamVote,
} from '@server/store/games/the-resistance/types';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { rstCastTeamVote } from '@server/store/games/the-resistance/actions';
import styles from './VoteForTeam.module.css';
import User from 'components/shared/user/User';
import WaitingMessage from './WaitingMessage';

export interface ResistanceProps {
  game: ResistanceGameState;
}

const TheResistanceVoteForTeam: React.FC<ResistanceProps> = ({ game }) => {
  const dispatch = useDispatch();
  const [voted, setVoted] = useState(false);

  if (!game.missionTeam) {
    return null;
  }

  const missionTeam = game.missionTeam.map(id =>
    game.players.find(player => player.userId === id)
  ) as ResistancePlayer[];

  const sendVote = (vote: ResistanceTeamVote) => {
    dispatch(sendMessage(rstCastTeamVote(vote)));
    setVoted(true);
  };

  const voteButtons = (
    <div className={styles.vote_buttons}>
      <Button onClick={() => sendVote(ResistanceTeamVote.APPROVE)}>
        Approve
      </Button>
      <Button onClick={() => sendVote(ResistanceTeamVote.REJECT)}>
        Reject
      </Button>
    </div>
  );

  const allUsersWhoVoted = game.teamApprovalVotes.concat(game.teamRejectVotes);
  const playersWhoStillNeedToVote = game.players.filter(
    player => !allUsersWhoVoted.includes(player.userId)
  );

  return (
    <div>
      <h1>Cast your vote for this&nbsp;team:</h1>
      <h3>This team was chosen by {game.missionLeader.name}.</h3>
      <section className={styles.players}>
        {missionTeam.map(player => (
          <User
            key={player.userId}
            user={{ id: player.userId, name: player.name }}
          />
        ))}
      </section>
      {!voted && voteButtons}
      <WaitingMessage
        playersThatNeedToAct={playersWhoStillNeedToVote}
        verb={'vote'}
      />
    </div>
  );
};

export default TheResistanceVoteForTeam;
