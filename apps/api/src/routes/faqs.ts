import { Router } from 'express';
import { queries } from '../db/index.js';

export const faqsRouter = Router();

faqsRouter.get('/', (req, res) => {
	try {
		const category = (req.query.category as string) || null;

		let faqs;
		if (category) {
			faqs = queries.getFAQsByCategory.all(category);
		} else {
			faqs = queries.getAllFAQs.all();
		}

		const faqsWithProducts = [];
		for (const faq of faqs as any[]) {
			const products = queries.getFAQProducts.all(faq.id);
			faqsWithProducts.push({
				...faq,
				related_products: products
			});
		}

		res.json(faqsWithProducts);
	} catch (error) {
		console.error('Failed to fetch FAQs:', error);
		res.status(500).json({ error: 'Failed to fetch FAQs' });
	}
});
