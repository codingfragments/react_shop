import { Link, useLocation } from 'react-router-dom';
import { APP_CONFIG } from '../lib/config';

interface CategoryNavProps {
	currentCategory?: string;
}

export default function CategoryNav({ currentCategory }: CategoryNavProps) {
	const location = useLocation();

	if (!currentCategory) {
		return null;
	}

	const isActive = (categorySlug: string) => currentCategory === categorySlug;

	return (
		<nav
			className="sticky top-16 z-40 border-b border-overlay0 bg-bg-secondary"
			aria-label="Category navigation"
		>
			<div className="container mx-auto px-4 py-3" style={{ maxWidth: 1200 }}>
				<div className="scrollbar-hide flex items-center space-x-1 overflow-x-auto">
					{/* All Products */}
					<Link
						to="/products"
						className={`flex items-center space-x-2 rounded-lg px-4 py-2 whitespace-nowrap transition-colors ${
							location.pathname === '/products'
								? 'bg-primary text-base'
								: 'text-text-secondary hover:bg-bg-elevated hover:text-primary'
						}`}
					>
						<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M19 11H5m14-7H5v14h14m0 0V4a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2z"
							></path>
						</svg>
						<span className="font-medium">All Products</span>
					</Link>

					{/* Divider */}
					<div className="mx-2 h-6 w-px bg-overlay0"></div>

					{/* Category Pills */}
					{APP_CONFIG.categories.map((category) => (
						<Link
							key={category.slug}
							to={`/${category.slug}`}
							className={`flex items-center space-x-2 rounded-lg px-4 py-2 whitespace-nowrap transition-colors ${
								isActive(category.slug) ? 'bg-primary ' : 'hover:-bg-elevated '
							} `}
						>
							<span className="text-sm">{category.icon}</span>
							<span
								className={`font-medium ${
									isActive(category.slug)
										? 'bg-primary text-crust'
										: 'hover:-bg-elevated text-secondary hover:text-primary'
								} `}
							>
								{category.name}
							</span>
						</Link>
					))}
				</div>
			</div>
		</nav>
	);
}
