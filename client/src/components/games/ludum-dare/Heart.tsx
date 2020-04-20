import React from 'react';
import fullHeart from 'assets/images/ludum-dare/gui/heatlh/heartFull.png';

export interface LudumHeartProps {
  className?: string;
}

const LudumHeart: React.FC<LudumHeartProps> = ({ className }) => {
  return <img src={fullHeart} className={className} />;
};

export default LudumHeart;
