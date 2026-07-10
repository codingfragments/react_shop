import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

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
	icon?: string;
	product_count?: number;
}

interface Pagination {
	total?: number;
	limit?: number;
	offset?: number;
	hasNext?: boolean;
	hasPrev?: boolean;
}

const sortOptions = [
	{ value: 'created_at', label: 'Newest First', order: 'DESC' },
	{ value: 'created_at', label: 'Oldest First', order: 'ASC' },
	{ value: 'name', label: 'Name A-Z', order: 'ASC' },
	{ value: 'name', label: 'Name Z-A', order: 'DESC' },
	{ value: 'price', label: 'Price: Low to High', order: 'ASC' },
	{ value: 'price', label: 'Price: High to Low', order: 'DESC' }
];

export default function AllProductsPage() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const currentFilters = useMemo(() => {
		return {
			category: searchParams.get('category') || '',
			search: searchParams.get('search') || '',
			sort: searchParams.get('sort') || 'created_at',
			order: searchParams.get('order') || 'DESC',
			page: parseInt(searchParams.get('page') || '1')
		};
	}, [searchParams]);

	const [products, setProducts] = useState<Product[]>([]);
	const [pagination, setPagination] = useState<Pagination>({});
	const [categories, setCategories] = useState<Category[]>([]);

	const [sortBy, setSortBy] = useState(currentFilters.sort);
	const [orderBy, setOrderBy] = useState(currentFilters.order);
	const [selectedCategory, setSelectedCategory] = useState(currentFilters.category);
	const [searchQuery, setSearchQuery] = useState(currentFilters.search);

	useEffect(() => {
		setSortBy(currentFilters.sort);
		setOrderBy(currentFilters.order);
		setSelectedCategory(currentFilters.category);
		setSearchQuery(currentFilters.search);
	}, [currentFilters]);

	useEffect(() => {
		document.title = 'All Products - KeyCraft';
	}, []);

	useEffect(() => {
		const limit = 12;
		const offset = (currentFilters.page - 1) * limit;

		const apiUrl = new URL('/api/products', window.location.origin);
		if (currentFilters.category) apiUrl.searchParams.set('category', currentFilters.category);
		if (currentFilters.search) apiUrl.searchParams.set('search', currentFilters.search);
		apiUrl.searchParams.set('sort', currentFilters.sort);
		apiUrl.searchParams.set('order', currentFilters.order);
		apiUrl.searchParams.set('limit', limit.toString());
		apiUrl.searchParams.set('offset', offset.toString());

		let cancelled = false;

		Promise.all([fetch(apiUrl.toString()), fetch('/api/categories?stats=true')])
			.then(async ([productsResponse, categoriesResponse]) => {
				const productsData = await productsResponse.json();
				const categoriesData = await categoriesResponse.json();
				if (cancelled) return;
				setProducts(productsData.products || []);
				setPagination(productsData.pagination || {});
				setCategories(categoriesData.categories || []);
			})
			.catch((error) => {
				console.error('Failed to load products page:', error);
				if (!cancelled) {
					setProducts([]);
					setPagination({});
					setCategories([]);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [currentFilters]);

	function updateFilters(overrides?: {
		category?: string;
		search?: string;
		sort?: string;
		order?: string;
	}) {
		const category = overrides?.category ?? selectedCategory;
		const search = overrides?.search ?? searchQuery;
		const sort = overrides?.sort ?? sortBy;
		const order = overrides?.order ?? orderBy;

		const params = new URLSearchParams();
		if (category) params.set('category', category);
		if (search) params.set('search', search);
		if (sort) params.set('sort', sort);
		if (order) params.set('order', order);

		navigate(`/products${params.toString() ? '?' + params.toString() : ''}`);
	}

	function handleSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
		const option = sortOptions[parseInt(event.target.value)];
		setSortBy(option.value);
		setOrderBy(option.order);
		updateFilters({ sort: option.value, order: option.order });
	}

	function handleCategoryFilter(categorySlug: string) {
		const next = selectedCategory === categorySlug ? '' : categorySlug;
		setSelectedCategory(next);
		updateFilters({ category: next });
	}

	function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
		const value = event.target.value;
		setSearchQuery(value);

		setTimeout(() => {
			updateFilters({ search: value });
		}, 500);
	}

	function goToPage(pageNum: number) {
		const params = new URLSearchParams(searchParams);
		params.set('page', pageNum.toString());
		navigate(`/products?${params.toString()}`);
	}

	const totalPages = Math.ceil((pagination?.total || 0) / 12);
	const currentPage = currentFilters.page || 1;

	return (
		<div className="container mx-auto px-4 py-8" style={{ maxWidth: 1400 }}>
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-4xl font-bold text-text-primary mb-4">All Products</h1>
				<p className="text-xl text-text-muted max-w-3xl">
					Discover our complete collection of premium mechanical keyboards, custom switches,
					artisan keycaps, and accessories
				</p>
			</div>

			{/* Filters and Search */}
			<div className="bg-bg-secondary border border-overlay0 rounded-2xl p-6 mb-8">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Search */}
					<div className="lg:col-span-2">
						<label htmlFor="search" className="block text-sm font-medium text-text-primary mb-2">
							Search Products
						</label>
						<input
							id="search"
							type="text"
							placeholder="Search keyboards, switches, keycaps..."
							value={searchQuery}
							onChange={handleSearch}
							className="w-full px-4 py-3 bg-bg-elevated border border-overlay0 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
						/>
					</div>

					{/* Sort */}
					<div>
						<label htmlFor="sort" className="block text-sm font-medium text-text-primary mb-2">
							Sort By
						</label>
						<select
							id="sort"
							onChange={handleSortChange}
							value={sortOptions.findIndex(
								(option) => option.value === sortBy && option.order === orderBy
							)}
							className="w-full px-4 py-3 bg-bg-elevated border border-overlay0 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
						>
							{sortOptions.map((option, index) => (
								<option key={index} value={index}>
									{option.label}
								</option>
							))}
						</select>
					</div>

					{/* Results Count */}
					<div className="flex items-end">
						<div className="text-text-muted">
							<span className="text-sm">Showing</span>{' '}
							<span className="font-semibold text-text-primary">{products.length}</span>{' '}
							<span className="text-sm">of</span>{' '}
							<span className="font-semibold text-text-primary">{pagination?.total || 0}</span>{' '}
							<span className="text-sm">products</span>
						</div>
					</div>
				</div>

				{/* Category Filters */}
				<div className="mt-6 pt-6 border-t border-overlay0">
					<h3 className="text-sm font-medium text-text-primary mb-3">Filter by Category</h3>
					<div className="flex flex-wrap gap-2">
						<button
							onClick={() => handleCategoryFilter('')}
							className={`px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${
								!selectedCategory
									? 'bg-primary text-base border-primary'
									: 'bg-bg-elevated text-text-primary border-overlay0 hover:border-primary'
							}`}
						>
							All Categories
						</button>

						{categories.map((category) => (
							<button
								key={category.slug}
								onClick={() => handleCategoryFilter(category.slug)}
								className={`px-4 py-2 rounded-lg border transition-colors text-sm font-medium flex items-center space-x-2 ${
									selectedCategory === category.slug
										? 'bg-primary text-base border-primary'
										: 'bg-bg-elevated text-text-primary border-overlay0 hover:border-primary'
								}`}
							>
								<span>{category.icon}</span>
								<span>{category.name}</span>
								<span className="text-xs opacity-75">({category.product_count})</span>
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Products Grid */}
			{products.length > 0 ? (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
						{products.map((product) => (
							<ProductCard key={product.id} product={product} showCategory={!selectedCategory} />
						))}
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex items-center justify-center space-x-2">
							<button
								disabled={currentPage <= 1}
								onClick={() => goToPage(currentPage - 1)}
								className="px-4 py-2 border border-overlay0 rounded-lg text-text-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								Previous
							</button>

							{Array.from({ length: Math.min(totalPages, 7) }).map((_, index) => {
								const pageNum = Math.max(1, Math.min(totalPages - 6, currentPage - 3)) + index;
								if (pageNum > totalPages) return null;
								return (
									<button
										key={pageNum}
										onClick={() => goToPage(pageNum)}
										className={`w-10 h-10 border rounded-lg transition-colors ${
											currentPage === pageNum
												? 'bg-primary text-base border-primary'
												: 'border-overlay0 text-text-primary hover:border-primary'
										}`}
									>
										{pageNum}
									</button>
								);
							})}

							<button
								disabled={currentPage >= totalPages}
								onClick={() => goToPage(currentPage + 1)}
								className="px-4 py-2 border border-overlay0 rounded-lg text-text-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								Next
							</button>
						</div>
					)}
				</>
			) : (
				<div className="text-center py-16">
					<div className="w-24 h-24 mx-auto mb-6 text-overlay0">
						<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							></path>
						</svg>
					</div>
					<h3 className="text-2xl font-semibold text-text-primary mb-2">No products found</h3>
					<p className="text-text-muted mb-6 max-w-md mx-auto">
						{searchQuery
							? `No products match your search for "${searchQuery}". Try adjusting your search terms.`
							: selectedCategory
							? 'No products found in this category. Try browsing other categories.'
							: 'No products available at the moment. Check back soon!'}
					</p>
					<button
						onClick={() => {
							setSelectedCategory('');
							setSearchQuery('');
							updateFilters({ category: '', search: '' });
						}}
						className="px-6 py-3 bg-primary text-base rounded-lg hover:bg-secondary transition-colors font-medium"
					>
						Clear Filters
					</button>
				</div>
			)}
		</div>
	);
}
