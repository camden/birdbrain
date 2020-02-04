import React, { ComponentProps } from 'react';
import styles from './Button.module.css';

export interface CustomButtonProps {}

export type ButtonProps = ComponentProps<'button'> | CustomButtonProps;

const Button: React.FC<ButtonProps> = props => {
  return <button {...props} className={styles.button} />;
};

export default Button;
