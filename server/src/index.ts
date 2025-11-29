import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { puzzleRoutes } from './routes/puzzles';

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isDev = process.env.NODE_ENV !== 'production';

// Middleware
app.use(cors());
app.use(express.json());
if (isDev) {
  app.use(morgan('dev')); // Logging only in development
}

// Routes
app.use('/api/puzzles', puzzleRoutes);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
