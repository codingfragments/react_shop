import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { APP_CONFIG } from '../lib/config';
import {
	generateMockRating,
	generateMockReviews,
	generateMockSpecs,
	generateEnthusiastComment
} from '../lib/utils/mockData';
import { useCartStore } from '../lib/stores/cart';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import CategoryNav from '../components/CategoryNav';

interface ProductPicture {
	id: number;
	product_id: number;
	image_path: string;
	alt_text?: string;
	sort_order: number;
	is_primary: boolean;
}

interface Product {
	id: number;
	name: string;
	slug: string;
	description?: string;
	price: number;
	category_id: number;
	category_slug?: string;
	category_name?: string;
	in_stock: boolean;
	stock_quantity: number;
	featured: boolean;
	sku?: string;
	pictures: ProductPicture[];
	[key: string]: unknown;
}

function formatPrice(price: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	}).format(price);
}

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

function getStockStatus(inStock: boolean, quantity: number): { text: string; color: string } {
	if (!inStock) {
		return { text: 'Out of Stock', color: 'text-error' };
	}
	if (quantity < 5) {
		return { text: `Only ${quantity} left!`, color: 'text-warning' };
	}
	if (quantity < 20) {
		return { text: 'Low Stock', color: 'text-warning' };
	}
	return { text: 'In Stock', color: 'text-success' };
}

export default function ProductPage() {
	const { category: categorySlug, product: productSlug } = useParams();

	const validCategory = useMemo(
		() => APP_CONFIG.categories.find((cat) => cat.slug === categorySlug),
		[categorySlug]
	);

	const [product, setProduct] = useState<Product | null>(null);
	const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
	const [notFound, setNotFound] = useState(false);

	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
	const [isAddingToCart, setIsAddingToCart] = useState(false);

	const addItem = useCartStore((state) => state.addItem);

	useEffect(() => {
		if (!validCategory || !productSlug) {
			setNotFound(true);
			return;
		}
		setNotFound(false);
		setSelectedImageIndex(0);
		setQuantity(1);
		setActiveTab('details');

		let cancelled = false;

		fetch(`/api/products/${productSlug}`)
			.then(async (response) => {
				if (!response.ok) {
					if (!cancelled) setNotFound(true);
					return;
				}
				const data = await response.json();

				if (data.product.category_slug !== categorySlug) {
					if (!cancelled) setNotFound(true);
					return;
				}

				if (cancelled) return;
				setProduct(data.product);
				setRelatedProducts(data.related || []);
			})
			.catch((error) => {
				console.error('Failed to load product page:', error);
				if (!cancelled) setNotFound(true);
			});

		return () => {
			cancelled = true;
		};
	}, [categorySlug, productSlug, validCategory]);

	useEffect(() => {
		if (product && validCategory) {
			document.title = `${product.name} - ${validCategory.name} - KeyCraft`;
		}
	}, [product, validCategory]);

	const mockRating = useMemo(() => (product ? generateMockRating(product.id) : null), [product]);
	const mockReviews = useMemo(
		() => (product && validCategory ? generateMockReviews(product.id, validCategory.slug, 5) : []),
		[product, validCategory]
	);
	const mockSpecs = useMemo(
		() => (product && validCategory ? generateMockSpecs(validCategory.slug, product.name) : {}),
		[product, validCategory]
	);
	const enthusiastComment = useMemo(
		() =>
			product && validCategory
				? generateEnthusiastComment(product.id, validCategory.slug, product.name)
				: '',
		[product, validCategory]
	);

	if (notFound || !product || !validCategory || !mockRating) {
		return null;
	}

	const stockStatus = getStockStatus(product.in_stock, product.stock_quantity);

	function handleAddToCart() {
		if (isAddingToCart || !product) return;

		setIsAddingToCart(true);

		addItem(
			{
				id: product.id,
				name: product.name,
				slug: product.slug,
				category_slug: product.category_slug || '',
				price: product.price,
				image_path: product.pictures?.[0]?.image_path,
				in_stock: product.in_stock,
				stock_quantity: product.stock_quantity
			},
			quantity
		);

		setTimeout(() => {
			setIsAddingToCart(false);
		}, 1200);
	}

	return (
		<>
			{/* Category Navigation */}
			<CategoryNav currentCategory={validCategory.slug} />

			<div className="container mx-auto px-4 py-8" style={{ maxWidth: 1400 }}>
				{/* Breadcrumb */}
				<nav className="flex items-center space-x-2 text-sm text-text-muted mb-8">
					<a href="/" className="hover:text-primary transition-colors">
						Home
					</a>
					<span>→</span>
					<a href={`/${validCategory.slug}`} className="hover:text-primary transition-colors capitalize">
						{validCategory.name}
					</a>
					<span>→</span>
					<span className="text-text-primary">{product.name}</span>
				</nav>

				{/* Product Details */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
					{/* Product Images */}
					<div className="space-y-4">
						{/* Main Image */}
						<div className="aspect-square bg-bg-elevated border border-overlay0 rounded-2xl overflow-hidden">
							{product.pictures && product.pictures.length > 0 ? (
								<img
									src={product.pictures[selectedImageIndex]?.image_path}
									alt={product.pictures[selectedImageIndex]?.alt_text || product.name}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center text-text-muted">
									<svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
										></path>
									</svg>
								</div>
							)}
						</div>

						{/* Image Thumbnails */}
						{product.pictures && product.pictures.length > 1 && (
							<div className="grid grid-cols-4 gap-3">
								{product.pictures.map((picture, index) => (
									<button
										key={picture.id}
										onClick={() => setSelectedImageIndex(index)}
										className={`aspect-square bg-bg-elevated border rounded-lg overflow-hidden hover:border-primary transition-colors ${
											selectedImageIndex === index ? 'border-primary' : 'border-overlay0'
										}`}
									>
										<img
											src={picture.image_path}
											alt={picture.alt_text || `${product.name} ${index + 1}`}
											className="w-full h-full object-cover"
										/>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Product Info */}
					<div className="space-y-6">
						<div>
							<p className="text-text-muted text-sm uppercase tracking-wide font-medium mb-2">
								{validCategory.name}
							</p>
							<h1 className="text-3xl font-bold text-text-primary mb-4">{product.name}</h1>

							{/* Rating */}
							<div className="flex items-center space-x-4 mb-4">
								<StarRating rating={mockRating.rating} size="lg" />
								<span className="text-text-muted">({mockRating.count} reviews)</span>
							</div>

							{/* Price */}
							<div className="mb-6">
								<span className="text-4xl font-bold text-primary">{formatPrice(product.price)}</span>
							</div>

							{/* Stock Status */}
							<div className="mb-6">
								<span className={`font-medium ${stockStatus.color}`}>{stockStatus.text}</span>
								{product.sku && (
									<span className="text-text-muted text-sm block mt-1">SKU: {product.sku}</span>
								)}
							</div>
						</div>

						{/* Description */}
						{product.description && (
							<div className="prose prose-invert max-w-none">
								<p className="text-text-secondary leading-relaxed">{product.description}</p>
							</div>
						)}

						{/* Enthusiast Comment */}
						<div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6">
							<div className="flex items-start space-x-4">
								<div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
									🎯
								</div>
								<div className="flex-1">
									<h4 className="font-semibold text-primary mb-2 flex items-center space-x-2">
										<span>Enthusiast's Take</span>
										<span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
											Verified Review
										</span>
									</h4>
									<blockquote className="text-text-secondary italic leading-relaxed">
										"{enthusiastComment}"
									</blockquote>
									<div className="flex items-center space-x-2 mt-3 text-sm text-text-muted">
										<span>— KeyboardNinja47</span>
										<span>•</span>
										<span>Community Expert</span>
										<span>•</span>
										<StarRating rating={5} size="sm" showValue={false} />
									</div>
								</div>
							</div>
						</div>

						{/* Quantity & Add to Cart */}
						<div className="border-t border-overlay0 pt-6">
							<div className="flex items-center space-x-4 mb-6">
								<label htmlFor="quantity" className="text-text-primary font-medium">
									Quantity:
								</label>
								<div className="flex items-center border border-overlay0 rounded-lg">
									<button
										disabled={quantity <= 1}
										onClick={() => setQuantity(Math.max(1, quantity - 1))}
										className="px-3 py-2 text-text-primary hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										−
									</button>
									<input
										id="quantity"
										type="number"
										value={quantity}
										onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
										min="1"
										max={product.stock_quantity}
										className="w-16 px-2 py-2 text-center bg-transparent border-0 text-text-primary focus:outline-none"
									/>
									<button
										disabled={quantity >= product.stock_quantity}
										onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
										className="px-3 py-2 text-text-primary hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										+
									</button>
								</div>
							</div>

							<div className="flex flex-col sm:flex-row gap-4">
								<button
									onClick={handleAddToCart}
									disabled={!product.in_stock || isAddingToCart}
									className={`relative flex-1 px-8 py-4 bg-primary text-base rounded-2xl hover:bg-secondary disabled:bg-overlay0 disabled:text-text-muted disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg border-2 border-transparent hover:enabled:border-yellow hover:enabled:font-bold active:scale-98 overflow-hidden ${
										isAddingToCart ? 'animate-pulse bg-success border-success shadow-xl' : ''
									}`}
								>
									{isAddingToCart ? (
										<>
											<span className="flex items-center justify-center space-x-3">
												<svg
													className="w-6 h-6 animate-bounce"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8v6a2 2 0 002 2h10a2 2 0 002-2V9M7 13v6a2 2 0 002 2h10a2 2 0 002-2V9"
													></path>
												</svg>
												<span>Added {quantity} to Cart!</span>
												<svg
													className="w-5 h-5 animate-spin"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M5 13l4 4L19 7"
													></path>
												</svg>
											</span>
											<div className="absolute inset-0 bg-white opacity-25 animate-ping rounded-2xl"></div>
											<div className="absolute inset-0 bg-success opacity-10 animate-pulse rounded-2xl"></div>
										</>
									) : product.in_stock ? (
										'Add to Cart'
									) : (
										'Out of Stock'
									)}
								</button>
								<button className="px-6 py-4 border border-primary text-primary rounded-2xl hover:bg-primary hover:text-base transition-colors font-semibold">
									♡ Wishlist
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Product Details Tabs */}
				<div className="bg-bg-secondary border border-overlay0 rounded-2xl overflow-hidden mb-16">
					{/* Tab Headers */}
					<div className="border-b border-overlay0">
						<div className="flex">
							<button
								onClick={() => setActiveTab('details')}
								className={`px-6 py-4 font-medium transition-colors border-b-2 ${
									activeTab === 'details'
										? 'border-primary text-primary'
										: 'border-transparent text-text-muted'
								}`}
							>
								Specifications
							</button>
							<button
								onClick={() => setActiveTab('reviews')}
								className={`px-6 py-4 font-medium transition-colors border-b-2 ${
									activeTab === 'reviews'
										? 'border-primary text-primary'
										: 'border-transparent text-text-muted'
								}`}
							>
								Reviews ({mockRating.count})
							</button>
						</div>
					</div>

					{/* Tab Content */}
					<div className="p-8">
						{activeTab === 'details' ? (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{Object.entries(mockSpecs).map(([key, value]) => (
									<div key={key} className="flex justify-between py-3 border-b border-overlay0 last:border-b-0">
										<span className="font-medium text-text-primary">{key}:</span>
										<span className="text-text-secondary">{String(value)}</span>
									</div>
								))}
							</div>
						) : (
							<div className="space-y-8">
								{/* Rating Summary */}
								<div className="bg-bg-elevated border border-overlay0 rounded-xl p-6">
									<div className="flex items-center justify-between mb-4">
										<div>
											<div className="flex items-center space-x-4 mb-2">
												<span className="text-3xl font-bold text-text-primary">
													{mockRating.rating.toFixed(1)}
												</span>
												<StarRating rating={mockRating.rating} size="lg" showValue={false} />
											</div>
											<p className="text-text-muted">Based on {mockRating.count} reviews</p>
										</div>
									</div>

									{/* Rating Breakdown */}
									<div className="space-y-2">
										{[5, 4, 3, 2, 1].map((stars) => (
											<div key={stars} className="flex items-center space-x-3">
												<span className="text-sm text-text-muted w-8">{stars}★</span>
												<div className="flex-1 bg-overlay0 rounded-full h-2">
													<div
														className="bg-yellow h-2 rounded-full"
														style={{
															width: `${(mockRating.breakdown[stars as 1 | 2 | 3 | 4 | 5] / mockRating.count) * 100}%`
														}}
													></div>
												</div>
												<span className="text-sm text-text-muted w-8">
													{mockRating.breakdown[stars as 1 | 2 | 3 | 4 | 5]}
												</span>
											</div>
										))}
									</div>
								</div>

								{/* Individual Reviews */}
								<div className="space-y-6">
									{mockReviews.map((review) => (
										<div key={review.id} className="border-b border-overlay0 pb-6 last:border-b-0">
											<div className="flex items-start space-x-4">
												<img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full" />
												<div className="flex-1">
													<div className="flex items-center space-x-3 mb-2">
														<span className="font-medium text-text-primary">{review.user}</span>
														{review.verified && (
															<span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">
																Verified Purchase
															</span>
														)}
														<span className="text-sm text-text-muted">{formatDate(review.date)}</span>
													</div>
													<div className="flex items-center space-x-3 mb-3">
														<StarRating rating={review.rating} size="sm" showValue={false} />
														<h4 className="font-medium text-text-primary">{review.title}</h4>
													</div>
													<p className="text-text-secondary leading-relaxed mb-3">{review.content}</p>
													<button className="text-text-muted hover:text-primary text-sm transition-colors">
														Helpful ({review.helpful})
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Related Products */}
				{relatedProducts && relatedProducts.length > 0 && (
					<section>
						<h2 className="text-3xl font-bold text-text-primary mb-8">Related Products</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{relatedProducts.map((relatedProduct) => (
								<ProductCard key={relatedProduct.id} product={relatedProduct} size="sm" showCategory={false} />
							))}
						</div>
					</section>
				)}
			</div>
		</>
	);
}
