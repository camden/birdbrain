import React, { useState } from 'react';
import {
  ResistanceGameState,
  ResistancePlayer,
} from '@server/store/games/the-resistance/types';
import useSelector from 'store/use-selector';
import { getCurrentUser } from 'store/selectors';
import { useDispatch } from 'react-redux';
import { rstPickMissionTeam } from '@server/store/games/the-resistance/actions';
import Button from 'components/shared/button/Button';
import { sendMessage } from 'store/websocket/actions';

export interface ResistanceProps {
  game: ResistanceGameState;
}

const TheResistancePickTeam: React.FC<ResistanceProps> = ({ game }) => {
  const user = useSelector(getCurrentUser());
  const dispatch = useDispatch();

  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);

  const onCheckboxChange = (player: ResistancePlayer) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let newSelectedPlayerIds;
    if (event.target.checked) {
      newSelectedPlayerIds = [...selectedPlayerIds, player.userId];
    } else {
      newSelectedPlayerIds = selectedPlayerIds.filter(
        id => id !== player.userId
      );
    }

    setSelectedPlayerIds(newSelectedPlayerIds);
  };

  if (user?.id !== game.missionLeader.userId) {
    return (
      <div>
        Waiting for {game.missionLeader.name} to pick a team for Mission{' '}
        {game.mission}.
      </div>
    );
  }

  return (
    <div>
      <h2>
        {game.missionLeader.name}, pick a team for Mission {game.mission}.
      </h2>
      <ul>
        {game.players.map(player => (
          <li key={player.userId}>
            <div>
              <input
                type="checkbox"
                checked={selectedPlayerIds.includes(player.userId)}
                onChange={onCheckboxChange(player)}
              />

              {player.name}
            </div>
          </li>
        ))}
      </ul>
      <Button
        onClick={() =>
          dispatch(sendMessage(rstPickMissionTeam(selectedPlayerIds)))
        }
      >
        Confirm Team
      </Button>
    </div>
  );
};

export default TheResistancePickTeam;
