import React, { ComponentProps } from 'react';
import styles from './Button.module.scss';
import cx from 'classnames';

export interface CustomButtonProps {
  className?: string;
  secondary?: boolean;
}

export type ButtonProps = ComponentProps<'button'> & CustomButtonProps;

const Button: React.FC<ButtonProps> = props => {
  return (
    <button
      {...props}
      className={cx(styles.button, props.className, {
        [styles.primary]: !props.secondary,
        [styles.secondary]: props.secondary,
      })}
    />
  );
};

export default Button;
