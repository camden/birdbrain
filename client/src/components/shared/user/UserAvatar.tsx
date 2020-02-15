import React, { ComponentProps } from 'react';
import styles from './UserAvatar.module.css';
import { User as UserType } from '@server/store/general/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';

export interface UserProps {
  user: UserType;
  icon?: IconDefinition;
  iconColor?: string;
}

const UserAvatar: React.FC<UserProps> = ({ user, icon, iconColor }) => {
  const letter = user.name.charAt(0).toUpperCase();
  return (
    <div className={styles.avatar}>
      <div>{letter}</div>
      {icon && (
        <FontAwesomeIcon
          className={styles.icon}
          icon={icon}
          style={{ color: iconColor || 'black' }}
        />
      )}
    </div>
  );
};

export default UserAvatar;
