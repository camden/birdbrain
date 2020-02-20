import React from 'react';
import styles from './UserAvatar.module.css';
import { User as UserType } from '@server/store/general/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import cx from 'classnames';

export interface UserProps {
  user: UserType;
  onClick?: () => void;
  icon?: IconDefinition;
  iconColor?: string;
  isBordered?: boolean;
  borderColor?: string;
}

const UserAvatar: React.FC<UserProps> = ({
  user,
  icon,
  iconColor,
  onClick,
  isBordered,
  borderColor,
}) => {
  const letter = user.name.charAt(0).toUpperCase();
  return (
    <div
      className={cx(
        styles.avatar,

        {
          [styles.bordered]: isBordered,
        }
      )}
      style={{
        borderColor: isBordered ? borderColor || 'black' : 'transparent',
      }}
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
