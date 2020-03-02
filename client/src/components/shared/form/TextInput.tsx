import React, { ComponentProps } from 'react';
import styles from './TextInput.module.css';
import cx from 'classnames';

export interface CustomTextInputProps {}

export type TextInputProps = ComponentProps<'input'> & CustomTextInputProps;

const TextInput: React.FC<TextInputProps> = props => {
  const classNames = cx(props.className, styles.input);
  return <input type="text" {...props} className={classNames} />;
};

export default TextInput;
