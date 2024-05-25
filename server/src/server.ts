import express, { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());

const port = 5000;

const MARVEL_API_KEY = process.env.MARVEL_API_KEY;
const MARVEL_PRIVATE_KEY = process.env.MARVEL_PRIVATE_KEY;
const BASE_URL = 'https://gateway.marvel.com/v1/public';

const getMarvelAuthParams = (): string => {
  const ts = new Date().getTime();
  if (!MARVEL_PRIVATE_KEY || !MARVEL_API_KEY) {
    throw new Error('Marvel API key or private key not found');
  }
  const hash = crypto.createHash('md5').update(ts + MARVEL_PRIVATE_KEY + MARVEL_API_KEY).digest('hex');
  return `ts=${ts}&apikey=${MARVEL_API_KEY}&hash=${hash}`;
};

app.get('/characters', async (req: Request, res: Response) => {
  const { series, story, name, page = 1 } = req.query;
  const offset = (Number(page) - 1) * 20;

  try {
    const authParams = getMarvelAuthParams();
    let url = `${BASE_URL}/characters?${authParams}&offset=${offset}&limit=20`;

    if (series) {
      url += `&series=${series}`;
    }
    if (story) {
      url += `&stories=${story}`;
    }
    if (name) {
      url += `&nameStartsWith=${name}`;
    }

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).send('Error fetching characters');
  }
});

app.get('/series', async (req: Request, res: Response) => {
  try {
    const { titleStartsWith, page = 1 } = req.query;
    const offset = (Number(page) - 1) * 20;
    let url = `${BASE_URL}/series?${getMarvelAuthParams()}&offset=${offset}&limit=20`;

    if (titleStartsWith) url += `&titleStartsWith=${titleStartsWith}`;

    const response = await axios.get(url);
    res.json(response.data.data);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.get('/series/:seriesId/characters', async (req: Request, res: Response) => {
  const { seriesId } = req.params;
  const { page = 1 } = req.query;
  const offset = (Number(page) - 1) * 20;

  try {
    const authParams = getMarvelAuthParams();
    const url = `${BASE_URL}/series/${seriesId}/characters?${authParams}&offset=${offset}&limit=20`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching characters by series:', error);
    res.status(500).send('Error fetching characters by series');
  }
});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

