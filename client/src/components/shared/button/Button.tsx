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
  playSound?: boolean;
  playSoundOnDown?: boolean;
}

export type ButtonProps = ComponentProps<'button'> & CustomButtonProps;

const Button: React.FC<ButtonProps> = props => {
  const { secondary, fullWidth, small, playSound, ...rest } = props;

  const playSoundFn = useSound(ButtonClickSound);

  return (
    <button
      {...rest}
      onClick={(...args) => {
        if (playSound) {
          playSoundFn();
        }
        props.onClick && props.onClick(...args);
      }}
      onMouseDown={(...args) => {
        if (props.playSoundOnDown) {
          playSoundFn();
        }
        props.onMouseDown && props.onMouseDown(...args);
      }}
      onTouchStart={(...args) => {
        if (props.playSoundOnDown) {
          playSoundFn();
        }
        props.onTouchStart && props.onTouchStart(...args);
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
