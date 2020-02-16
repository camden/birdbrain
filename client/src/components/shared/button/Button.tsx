import React, { ComponentProps } from 'react';
import styles from './Button.module.css';
import cx from 'classnames';

export interface CustomButtonProps {
  className?: string;
}

export type ButtonProps = ComponentProps<'button'> | CustomButtonProps;

const Button: React.FC<ButtonProps> = props => {
  return <button {...props} className={cx(styles.button, props.className)} />;
};

export default Button;
