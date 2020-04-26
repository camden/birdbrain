import React from 'react';
import fullHeart from 'assets/images/ludum-dare-original/gui/health/heartFull.png';
import emptyHeart from 'assets/images/ludum-dare-original/gui/health/heartEmpty.png';

export interface LudumOriginalHeartProps {
  className?: string;
  empty?: boolean;
}

const LudumOriginalHeart: React.FC<LudumOriginalHeartProps> = ({
  className,
  empty,
}) => {
  const imgSrc = empty ? emptyHeart : fullHeart;
  return <img src={imgSrc} className={className} />;
};

export default LudumOriginalHeart;
