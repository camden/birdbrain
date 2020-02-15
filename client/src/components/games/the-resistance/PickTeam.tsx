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
import User from 'components/shared/user/User';
import { sendMessage } from 'store/websocket/actions';
import styles from './PickTeam.module.css';

export interface ResistanceProps {
  game: ResistanceGameState;
}

const TheResistancePickTeam: React.FC<ResistanceProps> = ({ game }) => {
  const user = useSelector(getCurrentUser());
  const dispatch = useDispatch();

  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);

  const onUserSelect = (player: ResistancePlayer) => () => {
    let newSelectedPlayerIds;
    const playerWasNotSelected = !selectedPlayerIds.includes(player.userId);
    if (playerWasNotSelected) {
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
      <h2>
        Waiting for {game.missionLeader.name} to pick a team for Mission{' '}
        {game.mission}.
      </h2>
    );
  }

  const currentMission = game.allMissions[game.mission - 1];

  return (
    <div>
      <h2>Pick a team for Mission {game.mission}.</h2>
      <h3>Choose {currentMission.requiredPlayers} players:</h3>
      <section className={styles.user_list}>
        {game.players.map(player => (
          <User
            key={player.userId}
            user={{ id: player.userId, name: player.name }}
            isSelected={selectedPlayerIds.includes(player.userId)}
            onSelect={onUserSelect(player)}
            disabled={
              selectedPlayerIds.length >= currentMission.requiredPlayers &&
              !selectedPlayerIds.includes(player.userId)
            }
          />
        ))}
      </section>
      <Button
        disabled={selectedPlayerIds.length < currentMission.requiredPlayers}
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
