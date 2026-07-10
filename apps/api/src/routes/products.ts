import { Router } from 'express';
import { queries, type Product, type ProductPicture } from '../db/index.js';

interface ProductWithPictures extends Product {
	pictures: ProductPicture[];
}

export const productsRouter = Router();

productsRouter.get('/', (req, res) => {
	try {
		const searchParams = req.query;
		const category = (searchParams.category as string) || null;
		const search = (searchParams.search as string) || null;
		const featured = (searchParams.featured as string) || null;
		const limit = parseInt((searchParams.limit as string) || '20');
		const offset = parseInt((searchParams.offset as string) || '0');
		const sort = (searchParams.sort as string) || 'created_at';
		const order = (searchParams.order as string) || 'DESC';

		let products: Product[];

		if (category) {
			products = queries.getProductsByCategory.all(category) as Product[];
		} else {
			products = queries.getAllProducts.all() as Product[];
		}

		let filteredProducts = products;

		if (search) {
			const searchLower = search.toLowerCase();
			filteredProducts = products.filter(
				(product) =>
					product.name.toLowerCase().includes(searchLower) ||
					(product.description && product.description.toLowerCase().includes(searchLower))
			);
		}

		if (featured === 'true') {
			filteredProducts = filteredProducts.filter((product) => product.featured);
		}

		filteredProducts.sort((a, b) => {
			let aVal: any = a[sort as keyof Product];
			let bVal: any = b[sort as keyof Product];

			if (sort === 'price') {
				aVal = parseFloat(aVal);
				bVal = parseFloat(bVal);
			}

			if (order === 'ASC') {
				return aVal > bVal ? 1 : -1;
			} else {
				return aVal < bVal ? 1 : -1;
			}
		});

		const total = filteredProducts.length;
		const paginatedProducts = filteredProducts.slice(offset, offset + limit);

		const productsWithPictures: ProductWithPictures[] = paginatedProducts.map((product) => {
			const pictures = queries.getProductPictures.all(product.id) as ProductPicture[];
			return { ...product, pictures };
		});

		res.json({
			products: productsWithPictures,
			pagination: {
				total,
				limit,
				offset,
				hasNext: offset + limit < total,
				hasPrev: offset > 0
			},
			filters: {
				category,
				search,
				featured: featured === 'true',
				sort,
				order
			}
		});
	} catch (error) {
		console.error('Products API error:', error);
		res.status(500).json({ error: 'Failed to fetch products' });
	}
});

productsRouter.get('/:id', (req, res) => {
	try {
		const { id } = req.params;
		let product: Product | undefined;

		if (/^\d+$/.test(id)) {
			product = queries.getProductById.get(parseInt(id)) as Product | undefined;
		} else {
			product = queries.getProductBySlug.get(id) as Product | undefined;
		}

		if (!product) {
			res.status(404).json({ error: 'Product not found' });
			return;
		}

		const pictures = queries.getProductPictures.all(product.id) as ProductPicture[];

		const productWithPictures: ProductWithPictures = {
			...product,
			pictures
		};

		const relatedProducts = queries.getProductsByCategory
			.all(product.category_slug!)
			.filter((p: Product) => p.id !== product!.id)
			.slice(0, 4)
			.map((p: Product) => {
				const relatedPictures = queries.getProductPictures.all(p.id) as ProductPicture[];
				return { ...p, pictures: relatedPictures };
			});

		res.json({
			product: productWithPictures,
			related: relatedProducts
		});
	} catch (error) {
		console.error('Product API error:', error);
		res.status(500).json({ error: 'Failed to fetch product' });
	}
});
