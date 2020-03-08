import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface MetaProps {
  title?: string;
  description?: string;
}

const PUBLIC_URL = 'https://birdbrain.games/';

const Meta: React.FC<MetaProps> = () => {
  return (
    <Helmet>
      <title>Birdbrain Games</title>
      <meta name="title" content="Birdbrain Games" />
      <meta
        name="description"
        content="Play free local-multiplayer games with your friends!"
      />
    </Helmet>
  );
};

export default Meta;
