import React, { ComponentProps } from 'react';
import styles from './User.module.css';
import { User as UserType } from '@server/store/general/types';
import UserAvatar from './UserAvatar';

export interface UserProps {
  user: UserType;
}

const User: React.FC<UserProps> = ({ user }) => {
  return (
    <div className={styles.user}>
      <UserAvatar user={user} />
      <div className={styles.name}>{user.name}</div>
    </div>
  );
};

export default User;
