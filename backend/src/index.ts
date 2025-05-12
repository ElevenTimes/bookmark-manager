import express from 'express';
import cors from 'cors';
import bookmarksRouter from './routes/bookmarks';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000' // Replace with your frontend's origin if different
}));

app.use(express.json());

app.use('/api/bookmarks', bookmarksRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});




