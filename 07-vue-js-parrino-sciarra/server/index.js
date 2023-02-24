import express from 'express';
import https from 'https';

export default (app) => {
  app.use(express.json());
  
  app.get('/playlists', (req, res) => {
    https.get('https://api.deezer.com/chart/0/playlists?limit=20', response => {
      let data = '';
      response.on('data', chunk => {
        data += chunk;
      });
      response.on('end', () => {
        res.header('Content-Type', 'application/json');
        res.send(data);
      })
    }).on('error', err => console.error(err));
  });
  
  app.get('/playlists/:id', (req, res) => {
    https.get(`https://api.deezer.com/playlist/${req.params.id}`, response => {
      let data = '';
      response.on('data', chunk => {
        data += chunk;
      });
      response.on('end', () => {
        res.header('Content-Type', 'application/json');
        res.send(data);
      })
    }).on('error', err => console.error(err));
  });
}
