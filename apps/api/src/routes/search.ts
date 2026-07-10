import { Router } from 'express';
import { queries, type Product, type ProductPicture } from '../db/index.js';

export const searchRouter = Router();

searchRouter.get('/', (req, res) => {
	try {
		const query = (req.query.q as string) || '';
		const category = (req.query.category as string) || null;
		const limit = parseInt((req.query.limit as string) || '10');

		if (!query || query.trim().length < 2) {
			res.json({
				results: [],
				query,
				total: 0
			});
			return;
		}

		const searchQuery = query.toLowerCase().trim();

		let products: Product[];
		if (category) {
			products = queries.getProductsByCategory.all(category) as Product[];
		} else {
			products = queries.getAllProducts.all() as Product[];
		}

		const searchResults = products
			.filter((product) => {
				const nameMatch = product.name.toLowerCase().includes(searchQuery);
				const descMatch =
					product.description && product.description.toLowerCase().includes(searchQuery);
				const skuMatch = product.sku && product.sku.toLowerCase().includes(searchQuery);
				const categoryMatch =
					product.category_name && product.category_name.toLowerCase().includes(searchQuery);

				return nameMatch || descMatch || skuMatch || categoryMatch;
			})
			.slice(0, limit)
			.map((product) => {
				const primaryPicture = queries.getPrimaryProductPicture.get(product.id) as
					| ProductPicture
					| undefined;
				return {
					...product,
					primary_picture: primaryPicture
				};
			});

		res.json({
			results: searchResults,
			query,
			total: searchResults.length,
			category
		});
	} catch (error) {
		console.error('Search API error:', error);
		res.status(500).json({ error: 'Search failed' });
	}
});
