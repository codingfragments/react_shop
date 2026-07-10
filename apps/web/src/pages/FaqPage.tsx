import { useEffect, useState } from 'react';

interface FAQProduct {
	id: number;
	faq_id: number;
	product_id: number;
	sort_order: number;
	created_at: string;
	name: string;
	slug: string;
	price: number;
	category_slug: string;
}

interface FAQ {
	id: number;
	question: string;
	answer: string;
	category: string;
	sort_order: number;
	is_featured: boolean;
	created_at: string;
	updated_at: string;
	related_products: FAQProduct[];
}

const categoryMetadata: Record<string, { name: string; icon: string }> = {
	keyboards: { name: 'Keyboards', icon: '⌨️' },
	keycaps: { name: 'Keycaps', icon: '🔤' },
	switches: { name: 'Switches', icon: '🔧' },
	cables: { name: 'Cables', icon: '🔌' },
	accessories: { name: 'Accessories', icon: '🎯' },
	general: { name: 'General', icon: '❓' }
};

function getCategoryInfo(categorySlug: string) {
	return (
		categoryMetadata[categorySlug] || {
			name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
			icon: '📝'
		}
	);
}

export default function FaqPage() {
	const [faqsByCategory, setFaqsByCategory] = useState<Record<string, FAQ[]>>({});
	const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

	useEffect(() => {
		document.title = 'FAQ - KeyCraft';
	}, []);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				const response = await fetch('/api/faqs');
				if (!response.ok) {
					throw new Error('Failed to fetch FAQs');
				}
				const faqs: FAQ[] = await response.json();

				const grouped = faqs.reduce((acc: Record<string, FAQ[]>, faq) => {
					const category = faq.category || 'general';
					if (!acc[category]) {
						acc[category] = [];
					}
					acc[category].push(faq);
					return acc;
				}, {});

				if (!cancelled) setFaqsByCategory(grouped);
			} catch (error) {
				console.error('Error loading FAQs:', error);
				if (!cancelled) setFaqsByCategory({});
			}
		}

		load();

		return () => {
			cancelled = true;
		};
	}, []);

	function toggleExpanded(itemId: string) {
		setExpandedItems((prev) => {
			const next = new Set(prev);
			if (next.has(itemId)) {
				next.delete(itemId);
			} else {
				next.add(itemId);
			}
			return next;
		});
	}

	return (
		<div className="container mx-auto px-4 py-8" style={{ maxWidth: 1200 }}>
			<div className="mx-auto max-w-4xl">
				{/* Header */}
				<div className="mb-12 text-center">
					<h1 className="mb-4 text-4xl font-bold text-text-primary">Frequently Asked Questions</h1>
					<p className="mx-auto max-w-2xl text-lg text-text-muted">
						Get answers to common questions about mechanical keyboards, switches, keycaps, and
						accessories. Click any question to expand and see recommended products.
					</p>
				</div>

				{/* FAQ Categories */}
				<div className="space-y-8">
					{Object.entries(faqsByCategory).map(([categorySlug, faqs]) => {
						const categoryInfo = getCategoryInfo(categorySlug);
						return (
							<div
								key={categorySlug}
								className="overflow-hidden rounded-2xl border border-overlay0 bg-bg-elevated"
							>
								{/* Category Header */}
								<div className="border-b border-overlay0 bg-bg-secondary px-6 py-4">
									<div className="flex items-center space-x-3">
										<span className="text-2xl">{categoryInfo.icon}</span>
										<h2 className="text-xl font-semibold text-text-primary">{categoryInfo.name}</h2>
										<span className="text-sm text-text-muted">({faqs.length} questions)</span>
									</div>
								</div>

								{/* FAQ Items */}
								<div className="divide-y divide-overlay0">
									{faqs.map((faq) => {
										const isExpanded = expandedItems.has(faq.id.toString());
										return (
											<div key={faq.id} className="p-6">
												{/* Question */}
												<button
													onClick={() => toggleExpanded(faq.id.toString())}
													className="group flex w-full items-center justify-between text-left transition-colors hover:text-primary"
												>
													<h3 className="pr-4 text-lg font-medium text-text-primary group-hover:text-primary">
														{faq.question}
													</h3>
													<svg
														className={`h-5 w-5 flex-shrink-0 text-text-muted transition-transform group-hover:text-primary ${
															isExpanded ? 'rotate-180' : ''
														}`}
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M19 9l-7 7-7-7"
														></path>
													</svg>
												</button>

												{/* Answer (Expandable) */}
												{isExpanded && (
													<div className="mt-4 space-y-4">
														<p className="leading-relaxed text-text-secondary">{faq.answer}</p>

														{/* Related Products */}
														{faq.related_products && faq.related_products.length > 0 && (
															<div className="rounded-xl border border-overlay0 bg-bg-secondary p-4">
																<h4 className="mb-3 text-sm font-medium tracking-wider text-text-muted uppercase">
																	{faq.related_products.length > 1
																		? 'Recommended Products'
																		: 'Recommended Product'}
																</h4>
																<div className="space-y-3">
																	{faq.related_products.map((product) => (
																		<div key={product.id} className="flex items-center space-x-4">
																			<div className="flex h-16 w-16 items-center justify-center rounded-lg bg-bg-hover">
																				<span className="text-2xl">📦</span>
																			</div>
																			<div className="flex-1">
																				<h5 className="font-medium text-text-primary">
																					{product.name}
																				</h5>
																				<p className="text-sm text-text-muted">
																					${product.price.toFixed(2)}
																				</p>
																			</div>
																			<a
																				href={`/${product.category_slug}/${product.slug}`}
																				className="rounded-lg bg-primary px-4 py-2 font-medium text-crust transition-colors hover:bg-primary/90"
																			>
																				<span className="text-crust">View Product</span>
																			</a>
																		</div>
																	))}
																</div>
															</div>
														)}
													</div>
												)}
											</div>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>

				{/* Contact Section */}
				<div className="mt-12 rounded-2xl border border-overlay0 bg-bg-elevated p-8 text-center">
					<h2 className="mb-4 text-2xl font-semibold text-text-primary">Still Have Questions?</h2>
					<p className="mb-6 text-text-muted">
						Can't find what you're looking for? Our keyboard experts are here to help.
					</p>
					<div className="flex flex-col justify-center gap-4 sm:flex-row">
						<a
							href="mailto:support@keycraft.com"
							className="rounded-lg bg-primary px-6 py-3 font-medium text-base transition-colors hover:bg-primary/90"
						>
							Email Support
						</a>
						<a
							href="/contact"
							className="rounded-lg border border-overlay0 bg-bg-secondary px-6 py-3 font-medium text-text-primary transition-colors hover:bg-bg-hover"
						>
							Contact Form
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
