import React, { ComponentProps } from 'react';
import Button, { CustomButtonProps } from './Button';
import { withRouter, RouteComponentProps } from 'react-router';

export interface CustomLinkButtonProps {
  to: string;
}

export type ButtonProps = ComponentProps<'button'> &
  CustomLinkButtonProps &
  CustomButtonProps &
  RouteComponentProps;

const LinkButton: React.FC<ButtonProps> = props => {
  const { staticContext, ...rest } = props;

  return (
    <Button
      {...rest}
      onClick={evt => {
        props.onClick && props.onClick(evt);
        props.history.push(props.to);
      }}
    ></Button>
  );
};

export default withRouter(LinkButton);
