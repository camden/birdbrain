import React, { ComponentProps } from 'react';
import styles from './Button.module.scss';
import cx from 'classnames';

export interface CustomButtonProps {
  className?: string;
  secondary?: boolean;
  small?: boolean;
  fullWidth?: boolean;
}

export type ButtonProps = ComponentProps<'button'> & CustomButtonProps;

const Button: React.FC<ButtonProps> = props => {
  const { secondary, fullWidth, ...rest } = props;

  return (
    <button
      {...rest}
      className={cx(styles.button, props.className, {
        [styles.primary]: !props.secondary,
        [styles.secondary]: props.secondary,
        [styles.full_width]: props.fullWidth,
        [styles.small]: props.small,
      })}
    />
  );
};

export default Button;
