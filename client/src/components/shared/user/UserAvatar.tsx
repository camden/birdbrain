import React, { ComponentProps } from 'react';
import styles from './UserAvatar.module.css';
import { User as UserType } from '@server/store/general/types';

export interface UserProps {
  user: UserType;
}

const UserAvatar: React.FC<UserProps> = ({ user }) => {
  const letter = user.name.charAt(0).toUpperCase();
  return <div className={styles.avatar}>{letter}</div>;
};

export default UserAvatar;
