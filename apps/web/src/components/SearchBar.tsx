import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchProduct {
	id: number;
	name: string;
	slug: string;
	category_slug: string;
	category_name: string;
	price: number;
	primary_picture?: {
		image_path: string;
		alt_text?: string;
	};
}

export default function SearchBar() {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const searchInputRef = useRef<HTMLInputElement | null>(null);
	const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	async function performSearch(query: string) {
		if (!query || query.trim().length < 2) {
			setSearchResults([]);
			setShowResults(false);
			return;
		}

		setIsSearching(true);

		try {
			const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`);
			const data = await response.json();

			setSearchResults(data.results || []);
			setShowResults(true);
		} catch (error) {
			console.error('Search error:', error);
			setSearchResults([]);
		} finally {
			setIsSearching(false);
		}
	}

	function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
		const value = event.target.value;
		setSearchQuery(value);
		clearTimeout(searchTimeoutRef.current);
		searchTimeoutRef.current = setTimeout(() => {
			performSearch(value);
		}, 300);
	}

	function handleKeydown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === 'Enter' && searchQuery.trim()) {
			event.preventDefault();
			navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
			hideResults();
		} else if (event.key === 'Escape') {
			hideResults();
			searchInputRef.current?.blur();
		}
	}

	function hideResults() {
		setShowResults(false);
	}

	function selectResult(product: SearchProduct) {
		navigate(`/${product.category_slug}/${product.slug}`);
		hideResults();
		setSearchQuery('');
	}

	useEffect(() => {
		function handleGlobalKeydown(event: KeyboardEvent) {
			if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
				event.preventDefault();
				searchInputRef.current?.focus();
			}
		}

		document.addEventListener('keydown', handleGlobalKeydown);

		return () => {
			document.removeEventListener('keydown', handleGlobalKeydown);
			clearTimeout(searchTimeoutRef.current);
		};
	}, []);

	return (
		<div className="relative w-full">
			<div className="relative">
				<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<svg className="h-5 w-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						></path>
					</svg>
				</div>

				<input
					ref={searchInputRef}
					value={searchQuery}
					onChange={handleInput}
					onKeyDown={handleKeydown}
					onFocus={() => searchQuery && performSearch(searchQuery)}
					onBlur={() => setTimeout(hideResults, 150)}
					type="text"
					placeholder="Search keyboards, switches, keycaps..."
					className="block w-full pl-10 pr-16 py-2 bg-bg-elevated border border-overlay0 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
				/>

				<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
					{isSearching ? (
						<div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
					) : (
						<kbd className="hidden sm:inline-flex items-center px-2 py-0.5 border border-overlay0 rounded text-xs text-text-muted bg-bg-hover">
							⌘K
						</kbd>
					)}
				</div>
			</div>

			{/* Search Results Dropdown */}
			{showResults && (searchResults.length > 0 || searchQuery.length >= 2) && (
				<div className="absolute top-full left-0 right-0 mt-2 bg-bg-elevated border border-overlay0 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
					{searchResults.length > 0 ? (
						<>
							{searchResults.map((product) => (
								<button
									key={product.id}
									onClick={() => selectResult(product)}
									className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-bg-hover transition-colors text-left border-b border-overlay0 last:border-b-0"
								>
									{product.primary_picture ? (
										<img
											src={product.primary_picture.image_path}
											alt={product.primary_picture.alt_text || product.name}
											className="w-10 h-10 object-cover rounded-lg bg-bg-card"
											loading="lazy"
										/>
									) : (
										<div className="w-10 h-10 bg-bg-card rounded-lg flex items-center justify-center">
											<span className="text-text-muted">📦</span>
										</div>
									)}

									<div className="flex-1 min-w-0">
										<div className="font-medium text-text-primary truncate">{product.name}</div>
										<div className="text-sm text-text-muted flex items-center space-x-2">
											<span className="capitalize">{product.category_name}</span>
											<span>•</span>
											<span className="font-medium text-primary">${product.price}</span>
										</div>
									</div>
								</button>
							))}

							{searchQuery.trim().length >= 2 && (
								<div className="px-4 py-3 border-t border-overlay0">
									<button
										onClick={() => {
											navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
											hideResults();
										}}
										className="text-primary hover:text-secondary transition-colors text-sm font-medium"
									>
										View all results for "{searchQuery}"
									</button>
								</div>
							)}
						</>
					) : (
						<div className="px-4 py-6 text-center text-text-muted">
							<svg
								className="mx-auto h-12 w-12 text-overlay0 mb-3"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								></path>
							</svg>
							<p className="text-sm">No products found for "{searchQuery}"</p>
							<p className="text-xs mt-1">Try searching for keyboards, switches, or keycaps</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
