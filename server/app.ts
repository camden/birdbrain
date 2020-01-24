import express from 'express';
import path from 'path';

const app: express.Application = express();

app.use(
  '/static',
  express.static(path.resolve(__dirname, '../client/build/static/'))
);

app.use(
  '/favicon.ico',
  express.static(path.resolve(__dirname, '../client/build/favicon.ico'))
);

app.use(
  '/favicon-32x32.png',
  express.static(path.resolve(__dirname, '../client/build/favicon-32x32.png'))
);

app.use(
  '/favicon-64x64.png',
  express.static(path.resolve(__dirname, '../client/build/favicon-64x64.png'))
);

app.use(
  '/site.webmanifest',
  express.static(path.resolve(__dirname, '../client/build/site.webmanifest'))
);

app.use(
  '/apple-touch-icon.png',
  express.static(
    path.resolve(__dirname, '../client/build/apple-touch-icon.png')
  )
);

app.use(
  '/safari-pinned-tab.svg',
  express.static(
    path.resolve(__dirname, '../client/build/safari-pinned-tab.svg')
  )
);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
});

app.listen(process.env.PORT || 3000, function() {
  console.log(`Example app listening on port ${process.env.PORT || 3000}!`);
});
