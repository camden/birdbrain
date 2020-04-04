import React, { ComponentProps } from 'react';
import styles from './Button.module.scss';
import cx from 'classnames';
import useSound from 'hooks/use-sound';
const ButtonClickSound = require('assets/sounds/button-click.wav');

export interface CustomButtonProps {
  className?: string;
  secondary?: boolean;
  small?: boolean;
  fullWidth?: boolean;
  disableSound?: boolean;
}

export type ButtonProps = ComponentProps<'button'> & CustomButtonProps;

const Button: React.FC<ButtonProps> = props => {
  const { secondary, fullWidth, small, disableSound, ...rest } = props;

  const playSoundFn = useSound(ButtonClickSound);

  return (
    <button
      {...rest}
      onClick={(...args) => {
        if (!disableSound) {
          playSoundFn();
        }
        props.onClick && props.onClick(...args);
      }}
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
