import React from 'react';
import { useDispatch } from 'react-redux';
import { rstPickMissionTeam } from '@server/store/games/the-resistance/actions';
import { ResistanceGameState } from '@server/store/games/the-resistance/types';
import { sendMessage } from 'store/websocket/actions';

export interface ResistanceProps {
  game: ResistanceGameState;
}

const TheResistanceMain: React.FC<ResistanceProps> = ({ game }) => {
  const dispatch = useDispatch();

  const dummyMissionTeam = game.players;

  return (
    <div>
      resistance
      <button
        onClick={() =>
          dispatch(sendMessage(rstPickMissionTeam(dummyMissionTeam)))
        }
      >
        debug send PICK_ACTION_TEAM
      </button>
    </div>
  );
};

export default TheResistanceMain;
