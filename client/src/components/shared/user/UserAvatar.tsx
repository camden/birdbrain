import React from 'react';
import styles from './UserAvatar.module.css';
import { User as UserType } from '@server/store/general/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import cx from 'classnames';

export interface UserProps {
  user: UserType;
  onClick?: () => void;
  small?: boolean;
  icon?: IconDefinition;
  iconColor?: string;
  isBordered?: boolean;
  borderColor?: string;
}

const UserAvatar: React.FC<UserProps> = ({
  user,
  icon,
  small,
  iconColor,
  onClick,
  isBordered,
  borderColor,
}) => {
  const letter = user.name.charAt(0).toUpperCase();
  return (
    <div
      className={cx(styles.avatar, {
        [styles.bordered]: isBordered,
        [styles.small]: small,
      })}
      onClick={onClick}
    >
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
