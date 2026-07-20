import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { APP_CONFIG } from '../lib/config';
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
  products?: Product[];
}

interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const sortOptions = [
  { value: 'created_at', label: 'Newest First', order: 'DESC' },
  { value: 'created_at', label: 'Oldest First', order: 'ASC' },
  { value: 'name', label: 'Name A-Z', order: 'ASC' },
  { value: 'name', label: 'Name Z-A', order: 'DESC' },
  { value: 'price', label: 'Price: Low to High', order: 'ASC' },
  { value: 'price', label: 'Price: High to Low', order: 'DESC' }
];

export default function CategoryPage() {
  const { category: categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const validCategory = useMemo(
    () => APP_CONFIG.categories.find((cat) => cat.slug === categorySlug),
    [categorySlug]
  );

  const currentFilters = useMemo(
    () => ({
      search: searchParams.get('search') || '',
      sort: searchParams.get('sort') || 'created_at',
      order: searchParams.get('order') || 'DESC',
      page: parseInt(searchParams.get('page') || '1')
    }),
    [searchParams]
  );

  const [category, setCategory] = useState<Category | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    limit: 12,
    offset: 0,
    hasNext: false,
    hasPrev: false
  });
  const [notFound, setNotFound] = useState(false);

  const [sortBy, setSortBy] = useState(currentFilters.sort);
  const [orderBy, setOrderBy] = useState(currentFilters.order);
  const [searchQuery, setSearchQuery] = useState(currentFilters.search);

  useEffect(() => {
    setSortBy(currentFilters.sort);
    setOrderBy(currentFilters.order);
    setSearchQuery(currentFilters.search);
  }, [currentFilters]);

  useEffect(() => {
    if (category) {
      document.title = `${category.name} - KeyCraft`;
    }
  }, [category]);

  useEffect(() => {
    if (!validCategory || !categorySlug) {
      setNotFound(true);
      return;
    }
    setNotFound(false);

    const limit = 12;
    const offset = (currentFilters.page - 1) * limit;

    let cancelled = false;

    Promise.all([
      fetch(`/api/categories/${categorySlug}?limit=${limit}&offset=${offset}`),
      fetch('/api/categories?stats=true')
    ])
      .then(async ([categoryResponse, categoriesResponse]) => {
        if (!categoryResponse.ok) {
          if (!cancelled) setNotFound(true);
          return;
        }

        const categoryData = await categoryResponse.json();
        const categoriesData = await categoriesResponse.json();

        let products: Product[] = categoryData.category?.products || [];

        if (currentFilters.search) {
          const searchLower = currentFilters.search.toLowerCase();
          products = products.filter(
            (product) =>
              product.name.toLowerCase().includes(searchLower) ||
              (product.description && product.description.toLowerCase().includes(searchLower))
          );
        }

        products = [...products].sort((a, b) => {
          let aVal: any = a[currentFilters.sort as keyof Product];
          let bVal: any = b[currentFilters.sort as keyof Product];

          if (currentFilters.sort === 'price') {
            aVal = parseFloat(aVal);
            bVal = parseFloat(bVal);
          }

          if (currentFilters.order === 'ASC') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });

        const total = products.length;
        const paginatedProducts = products.slice(offset, offset + limit);

        if (cancelled) return;

        setCategory({
          ...categoryData.category,
          products: paginatedProducts
        });
        setAllCategories(categoriesData.categories || []);
        setPagination({
          total,
          limit,
          offset,
          hasNext: offset + limit < total,
          hasPrev: offset > 0
        });
      })
      .catch((error) => {
        console.error('Failed to load category page:', error);
        if (!cancelled) setNotFound(true);
      });

    return () => {
      cancelled = true;
    };
  }, [categorySlug, validCategory, currentFilters]);

  function updateFilters(overrides?: { search?: string; sort?: string; order?: string }) {
    const search = overrides?.search ?? searchQuery;
    const sort = overrides?.sort ?? sortBy;
    const order = overrides?.order ?? orderBy;

    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);
    if (order) params.set('order', order);

    navigate(`/${categorySlug}${params.toString() ? '?' + params.toString() : ''}`);
  }

  function handleSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const option = sortOptions[parseInt(event.target.value)];
    setSortBy(option.value);
    setOrderBy(option.order);
    updateFilters({ sort: option.value, order: option.order });
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
    navigate(`/${categorySlug}?${params.toString()}`);
  }

  const totalPages = Math.ceil((pagination?.total || 0) / 12);
  const currentPage = currentFilters.page || 1;

  if (notFound || !category) {
    return null;
  }

  return (
    <>
      {/* Category Navigation */}
      <CategoryNav currentCategory={category.slug} />

      <div className="container mx-auto px-4 py-8" style={{ maxWidth: 1400 }}>
        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center text-3xl">
              {category.icon}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-text-primary">{category.name}</h1>
              <p className="text-lg text-text-muted mt-1">
                {category.product_count} {category.product_count === 1 ? 'product' : 'products'}{' '}
                available
              </p>
            </div>
          </div>
          <p className="text-xl text-text-secondary max-w-3xl">{category.description}</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-bg-secondary border border-overlay0 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-text-primary mb-2">
                Search {category.name}
              </label>
              <input
                id="search"
                type="text"
                placeholder={`Search in ${category.name.toLowerCase()}...`}
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
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-overlay0">
            <div className="text-text-muted">
              <span className="text-sm">Showing</span>{' '}
              <span className="font-semibold text-text-primary">
                {category.products?.length || 0}
              </span>{' '}
              <span className="text-sm">of</span>{' '}
              <span className="font-semibold text-text-primary">{pagination?.total || 0}</span>{' '}
              <span className="text-sm">{category.name.toLowerCase()}</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {category.products && category.products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {category.products.map((product) => (
                <ProductCard key={product.id} product={product} showCategory={false} />
              ))}
            </div>

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
                      className={`w-10 h-10 border rounded-lg transition-colors ${currentPage === pageNum
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
            <h3 className="text-2xl font-semibold text-text-primary mb-2">
              No {category.name.toLowerCase()} found
            </h3>
            <p className="text-text-muted mb-6 max-w-md mx-auto">
              {searchQuery
                ? `No ${category.name.toLowerCase()} match your search for "${searchQuery}". Try adjusting your search terms.`
                : `No ${category.name.toLowerCase()} available in this category at the moment.`}
            </p>
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  updateFilters({ search: '' });
                }}
                className="px-6 py-3 bg-primary text-base rounded-lg hover:bg-secondary transition-colors font-medium"
              >
                Clear Search
              </button>
            ) : (
              <a
                href="/products"
                className="inline-flex px-6 py-3 bg-primary text-base rounded-lg hover:bg-secondary transition-colors font-medium"
              >
                Browse All Products
              </a>
            )}
          </div>
        )}
      </div>

      {/* Related Categories */}
      {allCategories && allCategories.length > 1 && (
        <section className="bg-bg-secondary border-t border-overlay0 py-16">
          <div className="container mx-auto px-4" style={{ maxWidth: 1400 }}>
            <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">
              Explore Other relevan Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {allCategories
                .filter((cat) => cat.slug !== category.slug)
                .map((cat) => (
                  <a
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    className="group bg-bg-card border border-overlay0 rounded-xl p-4 hover:border-primary transition-all duration-300 text-center"
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {cat.icon}
                    </div>
                    <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-text-muted">{cat.product_count} products</p>
                  </a>
                ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
