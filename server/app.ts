import express from 'express';
import path from 'path';

// Create a new express application instance
const app: express.Application = express();

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.use(
  '/static',
  express.static(path.resolve(__dirname, '../client/build/static/'))
);

app.get('/app', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
