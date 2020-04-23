import React from 'react';
import useClapDetection from './useClapDetection';

export interface ClapScoreProps {}

const ClapScore: React.FC<ClapScoreProps> = () => {
  useClapDetection();
  return <div>clapscore</div>;
};

export default ClapScore;
