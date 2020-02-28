import React from 'react';
import GameCard from 'components/shared/game-card/GameCard';
import Button from 'components/shared/button/Button';

const resistanceDescription = `
A classic party game of social deduction.
`;

const Demo = () => {
  return (
    <div>
      <br />
      <GameCard
        title="The Resistance (non-selectable)"
        playerCount="5-10"
        time="30 min"
        description={resistanceDescription}
      />
      <br />
      <GameCard
        title="The Resistance"
        playerCount="5-10"
        time="30 min"
        description={resistanceDescription}
        onClick={() => null}
      />
      <br />
      <Button>click me</Button>
      <br />
      <Button secondary>click me</Button>
    </div>
  );
};

export default Demo;
