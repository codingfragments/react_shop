import { useEffect, useState } from 'react';
import { APP_CONFIG } from '../lib/config';
import ProductCard from '../components/ProductCard';
import MessageOfTheDay from '../components/MessageOfTheDay';

interface ProductPicture {
	id: number;
	image_path: string;
	alt_text?: string;
	is_primary: boolean;
}

interface Product {
	id: number;
	name: string;
	slug: string;
	price: number;
	category_id: number;
	category_slug?: string;
	category_name?: string;
	in_stock: boolean;
	stock_quantity: number;
	featured: boolean;
	pictures: ProductPicture[];
	[key: string]: unknown;
}

interface Category {
	id: number;
	name: string;
	slug: string;
	description?: string;
	icon?: string;
	product_count?: number;
}

export default function HomePage() {
	const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		document.title = `${APP_CONFIG.name} - Next Century Keyboard Shop :)`;

		let cancelled = false;

		async function load() {
			try {
				const [productsResponse, categoriesResponse] = await Promise.all([
					fetch('/api/products?featured=true&limit=6'),
					fetch('/api/categories?stats=true')
				]);
				const productsData = await productsResponse.json();
				const categoriesData = await categoriesResponse.json();

				if (cancelled) return;
				setFeaturedProducts(productsData.products || []);
				setCategories(categoriesData.categories || []);
			} catch (error) {
				console.error('Failed to load homepage data:', error);
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		load();

		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<>
			{/* Hero Section */}
			<section className="relative bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary py-24">
				<div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
				<div className="relative container mx-auto px-4" style={{ maxWidth: 1200 }}>
					<div className="mx-auto max-w-4xl space-y-8 text-center">
						{/* Hero Content */}
						<div className="space-y-6">
							<h1 className="text-5xl leading-tight font-bold text-text-primary md:text-6xl">
								Welcome to{' '}
								<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
									{APP_CONFIG.name}
								</span>
							</h1>
							<p className="mx-auto max-w-3xl text-xl leading-relaxed text-text-secondary md:text-2xl">
								{APP_CONFIG.description}
							</p>
							<p className="mx-auto max-w-2xl text-lg text-text-muted">
								Discover premium mechanical keyboards, custom switches, artisan keycaps, and
								accessories crafted for enthusiasts who demand perfection.
							</p>
							<p className="mx-auto max-w-2xl text-lg font-bold text-warning">
								⚠️ This is only a demo shop - no real products are sold here.
							</p>
						</div>

						{/* CTA Buttons */}
						<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
							<a
								href="/products"
								className="rounded-2xl bg-primary px-8 py-4 text-lg font-semibold text-crust shadow-lg transition-colors hover:bg-secondary hover:shadow-xl"
							>
								<span className="text-crust">Shop All new Products</span>
							</a>
							<a
								href="#categories"
								className="rounded-2xl border border-primary px-8 py-4 text-lg font-semibold text-primary transition-colors hover:bg-primary hover:text-base"
							>
								Browse Categories
							</a>
						</div>
					</div>
				</div>
			</section>

			{/* Message of the Day */}
			<section className="bg-bg-primary py-8">
				<div className="container mx-auto px-4" style={{ maxWidth: 1200 }}>
					<MessageOfTheDay />
				</div>
			</section>

			{/* Categories Section */}
			<section id="categories" className="bg-bg-secondary py-16">
				<div className="container mx-auto px-4" style={{ maxWidth: 1200 }}>
					<div className="mb-12 space-y-4 text-center">
						<h2 className="text-4xl font-bold text-text-primary">Shop by Category</h2>
						<p className="mx-auto max-w-2xl text-xl text-text-muted">
							Explore our curated collection of mechanical keyboard essentials
						</p>
					</div>

					{loading ? (
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="animate-pulse rounded-2xl border border-overlay0 bg-bg-card p-6">
									<div className="mb-4 h-16 w-16 rounded-2xl bg-overlay0"></div>
									<div className="mb-2 h-6 rounded bg-overlay0"></div>
									<div className="mb-4 h-4 w-3/4 rounded bg-overlay0"></div>
									<div className="h-4 w-1/2 rounded bg-overlay0"></div>
								</div>
							))}
						</div>
					) : (
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{categories.map((category) => (
								<a
									key={category.slug}
									href={`/${category.slug}`}
									className="group rounded-2xl border border-overlay0 bg-bg-card p-6 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
								>
									<div className="flex items-start space-x-4">
										<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 text-2xl transition-transform duration-300 group-hover:scale-110">
											{category.icon}
										</div>
										<div className="min-w-0 flex-1">
											<h3 className="mb-2 text-xl font-semibold text-text-primary transition-colors group-hover:text-primary">
												{category.name}
											</h3>
											<p
												className="mb-3 text-sm text-text-muted"
												style={{
													display: '-webkit-box',
													WebkitLineClamp: 2,
													WebkitBoxOrient: 'vertical',
													overflow: 'hidden'
												}}
											>
												{category.description}
											</p>
											<div className="flex items-center justify-between text-sm">
												<span className="text-text-secondary">{category.product_count} products</span>
												<span className="text-primary transition-transform duration-200 group-hover:translate-x-1">
													→
												</span>
											</div>
										</div>
									</div>
								</a>
							))}
						</div>
					)}
				</div>
			</section>

			{/* Featured Products Section */}
			<section className="bg-bg-primary py-16">
				<div className="container mx-auto px-4" style={{ maxWidth: 1200 }}>
					<div className="mb-12 space-y-4 text-center">
						<h2 className="text-4xl font-bold text-text-primary">Featured Products</h2>
						<p className="mx-auto max-w-2xl text-xl text-text-muted">
							Hand-picked favorites from our community of keyboard enthusiasts
						</p>
					</div>

					{loading ? (
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="animate-pulse rounded-2xl border border-overlay0 bg-bg-card">
									<div className="h-56 rounded-t-2xl bg-overlay0"></div>
									<div className="space-y-3 p-4">
										<div className="h-4 w-1/3 rounded bg-overlay0"></div>
										<div className="h-5 rounded bg-overlay0"></div>
										<div className="flex space-x-1">
											{Array.from({ length: 5 }).map((_, j) => (
												<div key={j} className="h-4 w-4 rounded bg-overlay0"></div>
											))}
										</div>
										<div className="flex items-center justify-between">
											<div className="h-6 w-20 rounded bg-overlay0"></div>
											<div className="h-8 w-24 rounded bg-overlay0"></div>
										</div>
									</div>
								</div>
							))}
						</div>
					) : featuredProducts.length > 0 ? (
						<>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
								{featuredProducts.map((product) => (
									<ProductCard key={product.id} product={product} />
								))}
							</div>

							{/* View All Link */}
							<div className="mt-12 text-center">
								<a
									href="/products"
									className="inline-flex items-center space-x-2 rounded-2xl border border-primary px-8 py-4 text-lg font-semibold text-primary transition-colors hover:bg-primary hover:text-base"
								>
									<span>View All Products</span>
									<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M17 8l4 4m0 0l-4 4m4-4H3"
										></path>
									</svg>
								</a>
							</div>
						</>
					) : (
						<div className="py-12 text-center">
							<p className="text-lg text-text-muted">No featured products available.</p>
						</div>
					)}
				</div>
			</section>

			{/* Newsletter Section */}
			<section className="border-t border-overlay0 bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
				<div className="container mx-auto px-4" style={{ maxWidth: 1200 }}>
					<div className="mx-auto max-w-3xl space-y-8 text-center">
						<div className="space-y-4">
							<h2 className="text-4xl font-bold text-text-primary">Stay in the Loop</h2>
							<p className="text-xl text-text-muted">
								Get notified about new products, group buys, and exclusive deals for keyboard
								enthusiasts
							</p>
						</div>

						<div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
							<input
								type="email"
								placeholder="Enter your email address"
								className="flex-1 rounded-lg border border-overlay0 bg-bg-elevated px-4 py-3 text-text-primary placeholder-text-muted transition-colors focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
							/>
							<button className="rounded-lg bg-primary px-6 py-3 font-medium whitespace-nowrap text-base transition-colors hover:bg-secondary">
								Subscribe
							</button>
						</div>

						<p className="text-sm text-text-muted">
							Join 10,000+ keyboard enthusiasts. Unsubscribe at any time.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}
