import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

const CLIENT_ID = '49714a7299e84b1e984cd89a00876f7c';
const CLIENT_SECRET = '95791aeb527747eb80991880b6719b1d';
const PLAYLIST_ID = '2OBlneqkcrvg1hHaaQtVEp';

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.get('/api/spotify-tracks', async (req, res) => {
  try {
    console.log('Request received for /api/spotify-tracks');

    // Get access token
    console.log('Getting access token...');
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    console.log('Token response status:', tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token request failed:', tokenResponse.status, errorText);
      throw new Error(`Token request failed: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('Token data received');
    const accessToken = tokenData.access_token;

    // Get playlist tracks
    console.log('Fetching playlist tracks...');
    const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    console.log('Playlist response status:', playlistResponse.status);

    if (!playlistResponse.ok) {
      const errorText = await playlistResponse.text();
      console.error('Playlist request failed:', playlistResponse.status, errorText);
      throw new Error(`Playlist request failed: ${playlistResponse.status}`);
    }

    const playlistData = await playlistResponse.json();
    console.log('Playlist data received, items count:', playlistData.items.length);

    // Extract track data
    const tracks = playlistData.items.map(item => ({
      title: item.track.name,
      artist: item.track.artists[0].name,
      albumArt: item.track.album.images[0]?.url || '/packages/images/hand-disc.jpg'
    }));

    console.log('Tracks extracted:', tracks.length);
    res.json(tracks);
  } catch (error) {
    console.error('Error in /api/spotify-tracks:', error);
    res.status(500).json({ error: 'Failed to fetch Spotify data', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Spotify proxy server running on http://localhost:${PORT}`);
});