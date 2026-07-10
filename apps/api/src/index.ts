import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { productsRouter } from './routes/products.js';
import { categoriesRouter } from './routes/categories.js';
import { searchRouter } from './routes/search.js';
import { faqsRouter } from './routes/faqs.js';
import { healthRouter } from './routes/health.js';
import { motdRouter } from './routes/motd.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
// In production (single-container Docker) both the API and the static React
// build are served from this one process on the same port.
const PORT = process.env.PORT || process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/search', searchRouter);
app.use('/api/faqs', faqsRouter);
app.use('/api/health', healthRouter);
app.use('/api/motd', motdRouter);

const webDist = join(__dirname, '../public');
if (existsSync(webDist)) {
	app.use(express.static(webDist));
	app.get('*', (req, res) => {
		res.sendFile(join(webDist, 'index.html'));
	});
}

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
