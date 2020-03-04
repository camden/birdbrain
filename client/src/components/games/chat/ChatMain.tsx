import React from 'react';

import { ChatGameState } from '@server/store/games/chat/types';

export interface SkullProps {
  game: ChatGameState;
}

const ChatMain: React.FC<SkullProps> = ({ game }) => {
  return (
    <div>
      <h1>Birdbrain Chat</h1>
      <section>
        {game.messages.map(msg => (
          <div key={msg.id}>{msg.text}</div>
        ))}
      </section>
    </div>
  );
};

export default ChatMain;
