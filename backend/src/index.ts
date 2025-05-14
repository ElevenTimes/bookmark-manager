import express from 'express';
import cors from 'cors';
import bookmarksRouter from './routes/bookmarks';
import keywordRoutes from './routes/keywords';

const app = express();

app.use(cors({
  origin: ['http://frontend:3000', 'http://localhost:3000'], // Allow both local and Docker-originated requests
}));

app.use(express.json());

// Use the bookmarks router for the /api/bookmark path
app.use('/api/bookmark', bookmarksRouter);
app.use('/api/keyword', keywordRoutes);

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




