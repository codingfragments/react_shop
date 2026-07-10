import { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateMockRating } from '../lib/utils/mockData';
import { useCartStore } from '../lib/stores/cart';
import StarRating from './StarRating';

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
	description?: string;
	price: number;
	category_id: number;
	category_name?: string;
	category_slug?: string;
	in_stock: boolean;
	stock_quantity: number;
	featured: boolean;
	pictures: ProductPicture[];
}

interface ProductCardProps {
	product: Product;
	size?: 'sm' | 'md' | 'lg';
	showCategory?: boolean;
}

const sizeClasses = {
	sm: 'max-w-sm',
	md: 'max-w-md',
	lg: 'max-w-lg'
};

const imageSizeClasses = {
	sm: 'h-48',
	md: 'h-56',
	lg: 'h-64'
};

function formatPrice(price: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	}).format(price);
}

function getStockStatus(inStock: boolean, quantity: number): { text: string; color: string } {
	if (!inStock) {
		return { text: 'Out of Stock', color: 'text-error' };
	}
	if (quantity < 5) {
		return { text: `Only ${quantity} left`, color: 'text-warning' };
	}
	if (quantity < 20) {
		return { text: 'Low Stock', color: 'text-warning' };
	}
	return { text: 'In Stock', color: 'text-success' };
}

export default function ProductCard({ product, size = 'md', showCategory = true }: ProductCardProps) {
	const addItem = useCartStore((state) => state.addItem);
	const [isAddingToCart, setIsAddingToCart] = useState(false);

	const mockRating = generateMockRating(product.id);
	const primaryImage = product.pictures.find((p) => p.is_primary) || product.pictures[0];
	const stockStatus = getStockStatus(product.in_stock, product.stock_quantity);

	function handleAddToCart(event: React.MouseEvent) {
		event.preventDefault();
		event.stopPropagation();

		if (isAddingToCart) return;

		setIsAddingToCart(true);

		addItem(
			{
				id: product.id,
				name: product.name,
				slug: product.slug,
				category_slug: product.category_slug || '',
				price: product.price,
				image_path: primaryImage?.image_path,
				in_stock: product.in_stock,
				stock_quantity: product.stock_quantity
			},
			1
		);

		setTimeout(() => {
			setIsAddingToCart(false);
		}, 800);
	}

	return (
		<div
			className={`group bg-bg-card border-overlay0 hover:border-primary hover:shadow-primary/10 overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl ${sizeClasses[size]}`}
		>
			{/* Product Image */}
			<div className={`relative ${imageSizeClasses[size]} bg-bg-elevated overflow-hidden`}>
				<Link to={`/${product.category_slug}/${product.slug}`} className="block h-full w-full">
					{primaryImage ? (
						<img
							src={primaryImage.image_path}
							alt={primaryImage.alt_text || product.name}
							className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
							loading="lazy"
						/>
					) : (
						<div className="text-text-muted flex h-full w-full items-center justify-center">
							<svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								></path>
							</svg>
						</div>
					)}
				</Link>

				{/* Out of Stock Overlay */}
				{!product.in_stock && (
					<div className="bg-base/80 absolute inset-0 flex items-center justify-center backdrop-blur-sm">
						<div className="relative">
							{/* Diagonal Strikethrough */}
							<svg
								className="text-error absolute inset-0 h-full w-full"
								viewBox="0 0 100 100"
								preserveAspectRatio="none"
							>
								<line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="8" opacity="0.9" />
								<line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="8" opacity="0.9" />
							</svg>
							{/* Out of Stock Badge */}
							<div className="bg-error rotate-12 transform rounded-2xl border-2 border-white px-6 py-3 text-lg font-bold text-white shadow-lg">
								OUT OF STOCK
							</div>
						</div>
					</div>
				)}

				{/* Badges */}
				<div className="absolute top-3 left-3 flex flex-col space-y-2">
					{product.featured && (
						<span className="bg-primary rounded-lg px-2 py-1 text-base text-xs font-medium">
							Featured
						</span>
					)}
					{!product.in_stock ? (
						<span className="bg-error rounded-lg px-2 py-1 text-xs font-medium text-white">
							Sold Out
						</span>
					) : product.stock_quantity < 5 ? (
						<span className="bg-warning rounded-lg px-2 py-1 text-base text-xs font-medium">
							Low Stock
						</span>
					) : null}
				</div>

				{/* Quick Actions */}
				<div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
					<button className="bg-bg-primary/80 border-overlay0 hover:bg-bg-secondary rounded-lg border p-2 backdrop-blur-sm transition-colors">
						<svg className="text-text-primary h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
							></path>
						</svg>
						<span className="sr-only">Add to Wishlist</span>
					</button>
					<button className="bg-bg-primary/80 border-overlay0 hover:bg-bg-secondary rounded-lg border p-2 backdrop-blur-sm transition-colors">
						<svg className="text-text-primary h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							></path>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
							></path>
						</svg>
						<span className="sr-only">Quick View</span>
					</button>
				</div>
			</div>

			{/* Product Info */}
			<div className="space-y-3 p-4">
				{/* Category & Name */}
				<div className="space-y-1">
					{showCategory && product.category_name && (
						<p className="text-text-muted text-sm font-medium tracking-wide uppercase">
							{product.category_name}
						</p>
					)}
					<h3 className="text-text-primary group-hover:text-primary line-clamp-2 font-semibold transition-colors">
						<Link to={`/${product.category_slug}/${product.slug}`} className="hover:underline">
							{product.name}
						</Link>
					</h3>
				</div>

				{/* Rating */}
				<div className="flex items-center justify-between">
					<StarRating rating={mockRating.rating} size="sm" />
					<span className="text-text-muted text-sm">({mockRating.count})</span>
				</div>

				{/* Price & Stock */}
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<p className="text-primary text-xl font-bold">{formatPrice(product.price)}</p>
						<p className={`text-sm ${stockStatus.color}`}>{stockStatus.text}</p>
					</div>

					{/* Add to Cart */}
					<button
						onClick={handleAddToCart}
						disabled={!product.in_stock || isAddingToCart}
						className={`bg-primary hover:bg-secondary disabled:bg-overlay0 disabled:text-text-muted relative overflow-hidden rounded-lg border-2 border-transparent px-4 py-2 text-base text-sm font-medium transition-all duration-200 active:scale-95 hover:enabled:border-violet-800 hover:enabled:font-bold disabled:cursor-not-allowed ${
							isAddingToCart ? 'animate-pulse bg-success border-success' : ''
						}`}
					>
						{isAddingToCart ? (
							<>
								{/* Success Animation */}
								<span className="flex items-center space-x-2">
									<svg className="h-4 w-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
									</svg>
									<span>Added!</span>
								</span>
								{/* Ripple effect */}
								<div className="absolute inset-0 animate-ping rounded-lg bg-white opacity-20"></div>
							</>
						) : product.in_stock ? (
							'Add to Cart'
						) : (
							'Sold Out'
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
