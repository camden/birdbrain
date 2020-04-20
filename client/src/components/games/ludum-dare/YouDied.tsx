import React from 'react';
import { LudumGameState } from '@server/store/games/ludum-dare/types';
import { useCurrentPlayer } from 'utils/ludum-dare-utils';
import LudumCharacter, { CharacterType, CharacterAnimation } from './Character';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { endCurrentGame } from '@server/store/general/actions';

export interface LudumYouDiedProps {
  game: LudumGameState;
}

const LudumYouDied: React.FC<LudumYouDiedProps> = ({ game }) => {
  const dispatch = useDispatch();
  const currentPlayer = useCurrentPlayer(game);
  const characterName = (
    <span style={{ color: currentPlayer.character.color }}>
      {currentPlayer.character.name}
    </span>
  );

  const areAllPlayersDead = game.players.every((p) => p.health === 0);

  const onReturnToRoom = () => {
    dispatch(sendMessage(endCurrentGame()));
  };

  return (
    <div>
      <h1>{characterName} died!</h1>
      <LudumCharacter
        id={currentPlayer.character.id}
        type={CharacterType.LOSE}
        animation={CharacterAnimation.SWAY}
        typeWhenPressed={CharacterType.NERVOUS}
      />
      {!areAllPlayersDead && <p>Wait for this game to end!</p>}
      {areAllPlayersDead && (
        <Button style={{ marginTop: 32 }} onClick={onReturnToRoom}>
          Return to room
        </Button>
      )}
    </div>
  );
};

export default LudumYouDied;
