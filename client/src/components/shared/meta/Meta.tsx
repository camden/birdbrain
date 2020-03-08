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

      <meta property="og:type" content="website" />
      <meta property="og:url" content={PUBLIC_URL} />
      <meta property="og:title" content="Birdbrain Games" />
      <meta
        property="og:description"
        content="Play free local-multiplayer games with your friends!"
      />
      <meta
        property="og:image"
        content={`${PUBLIC_URL}meta-tile-1200x628.png`}
      />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={PUBLIC_URL} />
      <meta property="twitter:title" content="Birdbrain Games" />
      <meta
        property="twitter:description"
        content="Play free local-multiplayer games with your friends!"
      />
      <meta
        property="twitter:image"
        content={`${PUBLIC_URL}meta-tile-1200x628.png`}
      ></meta>
    </Helmet>
  );
};

export default Meta;
