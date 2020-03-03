import React from 'react';
import Button from 'components/shared/button/Button';
import CustomGameCard from 'components/shared/game-card/CustomGameCard';

const resistanceDescription = `
A classic party game of social deduction.
`;

const Demo = () => {
  return (
    <div>
      <br />
      <CustomGameCard
        title="The Resistance (non-selectable)"
        playerCount="5-10"
        time="30 min"
        description={resistanceDescription}
      />
      <br />
      <CustomGameCard
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
