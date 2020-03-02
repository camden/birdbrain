import React, { ComponentProps } from 'react';
import Button from './Button';
import { withRouter, RouteComponentProps } from 'react-router';

export interface CustomButtonProps {
  to: string;
}

export type ButtonProps = ComponentProps<'button'> &
  CustomButtonProps &
  RouteComponentProps;

const LinkButton: React.FC<ButtonProps> = props => {
  const { staticContext, ...rest } = props;

  return (
    <Button {...rest} onClick={() => props.history.push(props.to)}></Button>
  );
};

export default withRouter(LinkButton);
