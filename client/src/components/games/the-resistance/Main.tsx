import React from 'react';
import {
  ResistanceGameState,
  ResistancePhase,
} from '@server/store/games/the-resistance/types';
import PickTeam from './PickTeam';
import VoteForTeam from './VoteForTeam';
import ShowTeamVotingResults from './ShowTeamVotingResults';
import ConductMission from './ConductMission';
import ShowMissionVotingResults from './ShowMissionVotingResults';
import ShowFinalResults from './ShowFinalResults';

export interface ResistanceProps {
  game: ResistanceGameState;
}

const TheResistanceMain: React.FC<ResistanceProps> = ({ game }) => {
  switch (game.phase) {
    case ResistancePhase.PICK_TEAM:
      return <PickTeam game={game} />;
    case ResistancePhase.VOTE_FOR_TEAM:
      return <VoteForTeam game={game} />;
    case ResistancePhase.SHOW_TEAM_VOTING_RESULTS:
      return <ShowTeamVotingResults game={game} />;
    case ResistancePhase.CONDUCT_MISSION:
      return <ConductMission game={game} />;
    case ResistancePhase.SHOW_MISSION_RESULTS:
      return <ShowMissionVotingResults game={game} />;
    case ResistancePhase.SHOW_FINAL_RESULTS:
      return <ShowFinalResults game={game} />;
    default:
      return <div>error</div>;
  }
};

export default TheResistanceMain;
