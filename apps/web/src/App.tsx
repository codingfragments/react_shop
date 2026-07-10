import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import HomePage from './pages/HomePage';
import AllProductsPage from './pages/AllProductsPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import FaqPage from './pages/FaqPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import TrackOrderPage from './pages/TrackOrderPage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import DocLayout from './pages/doc/DocLayout';
import DocHomePage from './pages/doc/DocHomePage';
import DocCartPage from './pages/doc/DocCartPage';
import DocCheckoutPage from './pages/doc/DocCheckoutPage';
import DocNavigationPage from './pages/doc/DocNavigationPage';
import DocSupportPage from './pages/doc/DocSupportPage';

export default function App() {
	return (
		<div className="flex min-h-screen flex-col bg-bg-primary text-text-primary">
			<Header />

			<main className="flex-1">
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/products" element={<AllProductsPage />} />
					<Route path="/search" element={<SearchPage />} />
					<Route path="/cart" element={<CartPage />} />
					<Route path="/checkout" element={<CheckoutPage />} />
					<Route path="/faq" element={<FaqPage />} />
					<Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
					<Route path="/track-order/:trackingNumber" element={<TrackOrderPage />} />
					<Route path="/doc" element={<DocLayout />}>
						<Route index element={<DocHomePage />} />
						<Route path="cart" element={<DocCartPage />} />
						<Route path="checkout" element={<DocCheckoutPage />} />
						<Route path="navigation" element={<DocNavigationPage />} />
						<Route path="support" element={<DocSupportPage />} />
					</Route>
					<Route path="/:category/:product" element={<ProductPage />} />
					<Route path="/:category" element={<CategoryPage />} />
				</Routes>
			</main>

			<Footer />

			<Chatbot />
		</div>
	);
}
