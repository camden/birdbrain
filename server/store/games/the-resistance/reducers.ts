import {
  ResistanceGameState,
  ResistancePhase,
  ResistanceTeamVote,
  ResistanceMissionVote,
  ResistanceMission,
  ResistancePlayer,
  ResistanceMissionStatus,
} from './types';
import {
  ResistanceActionTypes,
  RST_PICK_MISSION_TEAM,
  RST_CAST_TEAM_VOTE,
  RST_ACK_TEAM_VOTE_RESULTS,
  RST_CAST_MISSION_VOTE,
  RST_ACK_MISSION_VOTE_RESULTS,
} from './actions';
import produce from 'immer';

const getNextMissionLeader = (game: ResistanceGameState): ResistancePlayer => {
  const indexOfOldMissionLeader = game.players
    .map(p => p.userId)
    .indexOf(game.missionLeader.userId);
  const indexOfNewMissionLeader =
    (indexOfOldMissionLeader + 1) % game.players.length;
  return game.players[indexOfNewMissionLeader];
};

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

            draftState.missionLeader = getNextMissionLeader(game);

            // reset votes
            draftState.teamApprovalVotes = [];
            draftState.teamRejectVotes = [];
          }
        }
      });
    case RST_CAST_MISSION_VOTE:
      return produce(game, draftState => {
        const userId = action.meta.userId;
        if (action.payload.vote === ResistanceMissionVote.SUCCESS) {
          draftState.missionSuccessVotes.push(userId);
        } else if (action.payload.vote === ResistanceMissionVote.FAIL) {
          draftState.missionFailVotes.push(userId);
        }

        const everyoneVoted = game.missionTeam.every(
          userId =>
            draftState.missionSuccessVotes.includes(userId) ||
            draftState.missionFailVotes.includes(userId)
        );

        if (everyoneVoted) {
          draftState.phase = ResistancePhase.SHOW_MISSION_RESULTS;
        }
      });
    case RST_ACK_MISSION_VOTE_RESULTS:
      return produce(game, draftState => {
        draftState.acknowledged.push(action.meta.userId);

        const everyoneAcknowledged = game.players.every(player =>
          draftState.acknowledged.includes(player.userId)
        );

        if (everyoneAcknowledged) {
          draftState.acknowledged = [];

          const missionSucceeded = draftState.missionFailVotes.length === 0;
          draftState.allMissions[game.mission - 1].status = missionSucceeded
            ? ResistanceMissionStatus.SUCCEEDED
            : ResistanceMissionStatus.FAILED;

          const resistanceScore = draftState.allMissions.filter(
            mission => mission.status === ResistanceMissionStatus.SUCCEEDED
          ).length;

          const spyScore = draftState.allMissions.filter(
            mission => mission.status === ResistanceMissionStatus.FAILED
          ).length;

          const gameIsOver = resistanceScore === 3 || spyScore === 3;

          if (gameIsOver) {
            draftState.phase = ResistancePhase.SHOW_FINAL_RESULTS;
          } else {
            draftState.phase = ResistancePhase.PICK_TEAM;
            draftState.missionLeader = getNextMissionLeader(game);
            draftState.mission += 1;
            draftState.allMissions[draftState.mission - 1].status =
              ResistanceMissionStatus.IN_PROGRESS;
            draftState.missionTeam = [];
            draftState.missionSuccessVotes = [];
            draftState.missionFailVotes = [];
            draftState.teamApprovalVotes = [];
            draftState.teamRejectVotes = [];
          }
        }
      });
    default:
      return game;
  }
};
