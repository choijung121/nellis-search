import express from 'express';
import { searchListings } from './src/nellis-scraper.mjs';

const app = express();
const port = Number(process.env.PORT || 3000);
app.use(express.json());
app.get('/favicon.ico', (_request, response) => response.status(204).end());
app.use(express.static('public'));

app.post('/api/search', async (request, response) => {
  const query = String(request.body?.query || '').trim();
  if (query.length < 2 || query.length > 100) return response.status(400).json({ error: 'Enter a search term between 2 and 100 characters.' });
  try {
    const results = await searchListings(query);
    return response.json({ query, count: results.length, results });
  } catch (error) {
    console.error('Auction search failed:', error);
    return response.status(502).json({ error: 'The auction site could not be searched right now. Please try again shortly.' });
  }
});

app.listen(port, () => console.log(`Auction search POC is running at http://localhost:${port}`));
