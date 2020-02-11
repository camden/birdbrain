import {
  ResistanceGameState,
  ResistancePhase,
  ResistanceTeamVote,
} from './types';
import {
  ResistanceActionTypes,
  RST_PICK_MISSION_TEAM,
  RST_CAST_TEAM_VOTE,
  RST_ACK_TEAM_VOTE_RESULTS,
} from './actions';
import produce from 'immer';

export const resistanceReducer = (
  game: ResistanceGameState,
  action: ResistanceActionTypes
): ResistanceGameState => {
  switch (action.type) {
    case RST_PICK_MISSION_TEAM:
      return produce(game, draftState => {
        draftState.phase = ResistancePhase.VOTE_FOR_TEAM;
        draftState.missionTeam = action.payload.teamMembers;
      });
    case RST_CAST_TEAM_VOTE:
      return produce(game, draftState => {
        const userId = action.meta.userId;
        if (action.payload.vote === ResistanceTeamVote.APPROVE) {
          draftState.teamApprovalVotes.push(userId);
        } else if (action.payload.vote === ResistanceTeamVote.REJECT) {
          draftState.teamRejectVotes.push(userId);
        }

        // check for everyone voting
        const everyoneVoted = game.players.every(
          player =>
            draftState.teamApprovalVotes.includes(player.userId) ||
            draftState.teamRejectVotes.includes(player.userId)
        );

        if (everyoneVoted) {
          draftState.phase = ResistancePhase.SHOW_TEAM_VOTING_RESULTS;
        }
      });
    case RST_ACK_TEAM_VOTE_RESULTS:
      return produce(game, draftState => {
        draftState.acknowledged.push(action.meta.userId);

        const everyoneAcknowledged = game.players.every(player =>
          draftState.acknowledged.includes(player.userId)
        );

        if (everyoneAcknowledged) {
          draftState.acknowledged = [];

          const missionApproved =
            game.teamApprovalVotes.length > game.teamRejectVotes.length;
          if (missionApproved) {
            draftState.phase = ResistancePhase.CONDUCT_MISSION;
          } else {
            draftState.phase = ResistancePhase.PICK_TEAM;

            // pick new leader
            const indexOfOldMissionLeader = game.players
              .map(p => p.userId)
              .indexOf(game.missionLeader.userId);
            const indexOfNewMissionLeader =
              (indexOfOldMissionLeader + 1) % game.players.length;
            draftState.missionLeader = game.players[indexOfNewMissionLeader];

            // reset votes
            draftState.teamApprovalVotes = [];
            draftState.teamRejectVotes = [];
          }
        }
      });
    default:
      return game;
  }
};
