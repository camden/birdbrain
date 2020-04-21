import React from 'react';
import fullHeart from 'assets/images/ludum-dare/gui/health/heartFull.png';
import emptyHeart from 'assets/images/ludum-dare/gui/health/heartEmpty.png';

export interface LudumHeartProps {
  className?: string;
  empty?: boolean;
}

const LudumHeart: React.FC<LudumHeartProps> = ({ className, empty }) => {
  const imgSrc = empty ? emptyHeart : fullHeart;
  return <img src={imgSrc} className={className} />;
};

export default LudumHeart;
