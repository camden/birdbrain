import React from 'react';
import styles from './LabelWithIcon.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface LabelWithIconProps {
  label: string | number;
  icon: IconProp;
}

const LabelWithIcon: React.FC<LabelWithIconProps> = props => {
  return (
    <span>
      <FontAwesomeIcon icon={props.icon} className={styles.icon} />
      {props.label}
    </span>
  );
};

export default LabelWithIcon;
