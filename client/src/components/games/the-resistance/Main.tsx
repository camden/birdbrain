import React from 'react';
import {
  ResistanceGameState,
  ResistancePhase,
} from '@server/store/games/the-resistance/types';
import PickTeam from './PickTeam';
import VoteForTeam from './VoteForTeam';

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
      return <div>showing team results</div>;
    case ResistancePhase.CONDUCT_MISSION:
      return <div>conducting mission</div>;
    case ResistancePhase.SHOW_MISSION_RESULTS:
      return <div>show mission results</div>;
    default:
      return <div>error</div>;
  }
};

export default TheResistanceMain;
