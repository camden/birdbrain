import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LogoHeader.module.css';
import birdbrainLogo from 'assets/images/birdbrain-logo.svg';

const LogoHeader = () => {
  return (
    <header className={styles.header}>
      <Link
        to="/"
        onClick={() => {
          window.history.replaceState(null, '', window.location.pathname);
          window.location.reload();
        }}
      >
        <img src={birdbrainLogo} className={styles.birdbrain_logo} alt="logo" />
      </Link>
    </header>
  );
};

export default LogoHeader;
