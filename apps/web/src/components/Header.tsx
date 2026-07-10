import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_CONFIG } from '../lib/config';
import { useCartStore } from '../lib/stores/cart';
import SearchBar from './SearchBar';

export default function Header() {
	const location = useLocation();
	const { itemCount } = useCartStore();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isCategoryOpen, setIsCategoryOpen] = useState(false);

	function toggleMenu() {
		setIsMenuOpen((v) => !v);
	}

	function toggleCategory() {
		setIsCategoryOpen((v) => !v);
	}

	function closeMenus() {
		setIsMenuOpen(false);
		setIsCategoryOpen(false);
	}

	return (
		<header className="sticky top-0 z-50 border-b border-overlay0 bg-bg-primary backdrop-blur-sm">
			<div className="container mx-auto px-4 py-4" style={{ maxWidth: 1200 }}>
				<nav className="flex items-center justify-between">
					{/* Logo & Brand */}
					<div className="flex items-center space-x-4">
						<Link to="/" className="flex items-center space-x-3 transition-colors hover:text-primary">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
								<span className="font-bold text-base">⌨️</span>
							</div>
							<div className="hidden sm:block">
								<h1 className="text-xl font-bold text-primary">{APP_CONFIG.name}</h1>
								<p className="text-xs leading-none text-text-muted">Next Century Keyboards</p>
							</div>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden items-center space-x-8 lg:flex">
						<Link
							to="/"
							className={`font-medium text-text-primary transition-colors hover:text-primary ${
								location.pathname === '/' ? 'text-base' : ''
							}`}
						>
							Home
						</Link>

						<Link
							to="/products"
							className={`font-medium text-primary transition-colors hover:text-primary ${
								location.pathname === '/products' ? 'text-base' : ''
							}`}
						>
							All Products
						</Link>

						<Link
							to="/faq"
							className={`font-medium text-text-primary transition-colors hover:text-primary ${
								location.pathname === '/faq' ? 'text-base' : ''
							}`}
						>
							FAQ
						</Link>

						{/* Categories Dropdown */}
						<div className="relative">
							<button
								onClick={toggleCategory}
								className={`flex items-center space-x-1 font-medium text-text-primary transition-colors hover:text-primary ${
									location.pathname.startsWith('/categories') ? 'text-base' : ''
								}`}
							>
								<span>Categories</span>
								<svg
									className={`h-4 w-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
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

							{isCategoryOpen && (
								<div className="absolute top-full left-0 z-50 mt-2 w-64 rounded-2xl border border-overlay0 bg-bg-elevated py-2 shadow-xl">
									{APP_CONFIG.categories.map((category) => (
										<Link
											key={category.slug}
											to={`/${category.slug}`}
											className="flex items-center space-x-3 px-4 py-3 transition-colors hover:bg-bg-hover"
											onClick={closeMenus}
										>
											<span className="text-lg">{category.icon}</span>
											<div>
												<div className="font-medium text-text-primary">{category.name}</div>
												<div className="text-sm text-text-muted">{category.description}</div>
											</div>
										</Link>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Search Bar */}
					<div className="mx-8 hidden max-w-md flex-1 md:flex">
						<SearchBar />
					</div>

					{/* Actions */}
					<div className="flex items-center space-x-4">
						{/* Cart */}
						<Link
							to="/cart"
							className={`relative p-2 text-text-primary transition-colors hover:text-primary ${
								location.pathname === '/cart' ? 'text-base' : ''
							}`}
						>
							<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8v6a2 2 0 002 2h10a2 2 0 002-2V9M7 13v6a2 2 0 002 2h10a2 2 0 002-2V9"
								></path>
							</svg>
							{itemCount > 0 && (
								<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-base">
									{itemCount > 99 ? '99+' : itemCount}
								</span>
							)}
							<span className="sr-only">Shopping Cart ({itemCount} items)</span>
						</Link>

						{/* User */}
						<button className="p-2 text-text-primary transition-colors hover:text-primary">
							<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								></path>
							</svg>
						</button>

						{/* Mobile Menu Toggle */}
						<button
							onClick={toggleMenu}
							className="p-2 text-text-primary transition-colors hover:text-primary lg:hidden"
						>
							<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 6h16M4 12h16M4 18h16"
								></path>
							</svg>
						</button>
					</div>
				</nav>

				{/* Mobile Search */}
				<div className="mt-4 md:hidden">
					<SearchBar />
				</div>
			</div>

			{/* Mobile Menu */}
			{isMenuOpen && (
				<div className="border-t border-overlay0 bg-bg-secondary lg:hidden">
					<div className="container mx-auto space-y-4 px-4 py-4" style={{ maxWidth: 1200 }}>
						<Link
							to="/"
							className="block py-2 font-medium text-text-primary transition-colors hover:text-primary"
							onClick={closeMenus}
						>
							Home
						</Link>

						<Link
							to="/products"
							className="block py-2 font-medium text-text-primary transition-colors hover:text-primary"
							onClick={closeMenus}
						>
							All Products
						</Link>

						<Link
							to="/faq"
							className="block py-2 font-medium text-text-primary transition-colors hover:text-primary"
							onClick={closeMenus}
						>
							FAQ
						</Link>

						<div className="border-t border-overlay0 pt-4">
							<h3 className="mb-3 text-sm font-medium tracking-wider text-text-muted uppercase">
								Categories
							</h3>
							{APP_CONFIG.categories.map((category) => (
								<Link
									key={category.slug}
									to={`/${category.slug}`}
									className="flex items-center space-x-3 py-3 transition-colors hover:text-primary"
									onClick={closeMenus}
								>
									<span className="text-lg">{category.icon}</span>
									<div>
										<div className="font-medium text-text-primary">{category.name}</div>
										<div className="text-sm text-text-muted">{category.description}</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				</div>
			)}
		</header>
	);
}
