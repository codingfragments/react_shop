import { Router } from 'express';
import { queries, db, type Category, type Product, type ProductPicture } from '../db/index.js';

interface CategoryWithStats extends Category {
	product_count: number;
	featured_count: number;
	in_stock_count: number;
}

interface CategoryWithProducts extends Category {
	product_count: number;
	products: Array<Product & { pictures: ProductPicture[] }>;
}

export const categoriesRouter = Router();

categoriesRouter.get('/', (req, res) => {
	try {
		const includeStats = req.query.stats === 'true';

		const categories = queries.getAllCategories.all() as Category[];

		let categoriesWithStats: CategoryWithStats[];

		if (includeStats) {
			categoriesWithStats = categories.map((category) => {
				const productCount = db
					.prepare('SELECT COUNT(*) as count FROM products WHERE category_id = ?')
					.get(category.id) as { count: number };

				const featuredCount = db
					.prepare('SELECT COUNT(*) as count FROM products WHERE category_id = ? AND featured = 1')
					.get(category.id) as { count: number };

				const inStockCount = db
					.prepare('SELECT COUNT(*) as count FROM products WHERE category_id = ? AND in_stock = 1')
					.get(category.id) as { count: number };

				return {
					...category,
					product_count: productCount.count,
					featured_count: featuredCount.count,
					in_stock_count: inStockCount.count
				};
			});
		} else {
			categoriesWithStats = categories.map((category) => ({
				...category,
				product_count: 0,
				featured_count: 0,
				in_stock_count: 0
			}));
		}

		res.json({
			categories: categoriesWithStats,
			total: categories.length
		});
	} catch (error) {
		console.error('Categories API error:', error);
		res.status(500).json({ error: 'Failed to fetch categories' });
	}
});

categoriesRouter.get('/:slug', (req, res) => {
	try {
		const { slug } = req.params;
		const limit = parseInt((req.query.limit as string) || '20');
		const offset = parseInt((req.query.offset as string) || '0');

		const category = queries.getCategoryBySlug.get(slug) as Category | undefined;

		if (!category) {
			res.status(404).json({ error: 'Category not found' });
			return;
		}

		const allProducts = queries.getProductsByCategory.all(slug) as Product[];
		const totalProducts = allProducts.length;

		const paginatedProducts = allProducts.slice(offset, offset + limit);

		const productsWithPictures = paginatedProducts.map((product) => {
			const pictures = queries.getProductPictures.all(product.id) as ProductPicture[];
			return { ...product, pictures };
		});

		const categoryWithProducts: CategoryWithProducts = {
			...category,
			product_count: totalProducts,
			products: productsWithPictures
		};

		res.json({
			category: categoryWithProducts,
			pagination: {
				total: totalProducts,
				limit,
				offset,
				hasNext: offset + limit < totalProducts,
				hasPrev: offset > 0
			}
		});
	} catch (error) {
		console.error('Category API error:', error);
		res.status(500).json({ error: 'Failed to fetch category' });
	}
});
