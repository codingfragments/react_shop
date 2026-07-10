import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../lib/stores/cart';
import { useCheckoutStore } from '../lib/stores/checkout';
import CheckoutStep1 from '../components/checkout/CheckoutStep1';
import CheckoutStep2 from '../components/checkout/CheckoutStep2';
import CheckoutStep3 from '../components/checkout/CheckoutStep3';

function formatPrice(price: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	}).format(price);
}

const steps = [
	{ number: 1, title: 'Shipping Details', description: 'Enter your address details' },
	{ number: 2, title: 'Review Order', description: 'Confirm your items and shipping' },
	{ number: 3, title: 'Payment', description: 'Enter payment information' }
];

export default function CheckoutPage() {
	const navigate = useNavigate();
	const items = useCartStore((state) => state.items);
	const total = useCartStore((state) => state.total);
	const currentStep = useCheckoutStore((state) => state.currentStep);

	useEffect(() => {
		if (items.length === 0) {
			navigate('/cart');
		}
	}, [items, navigate]);

	useEffect(() => {
		document.title = 'Checkout - KeyCraft';
	}, []);

	return (
		<div className="container mx-auto px-4 py-8" style={{ maxWidth: 1400 }}>
			<div className="mx-auto max-w-4xl">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-text-primary mb-2 text-3xl font-bold">Checkout</h1>
					<p className="text-text-muted">Complete this order in a few simple steps</p>
				</div>

				{/* Progress Steps */}
				<div className="mb-12 pb-5">
					<div className="relative flex items-center justify-between">
						{/* Progress Line */}
						<div className="bg-overlay0 absolute top-4 right-0 left-0 h-0.5">
							<div
								className="bg-primary h-full transition-all duration-500"
								style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
							></div>
						</div>

						{steps.map((step) => (
							<div key={step.number} className="bg-bg-primary relative">
								<div
									className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${
										currentStep >= step.number
											? 'border-primary bg-primary text-base'
											: 'border-overlay0 text-text-muted'
									}`}
								>
									{currentStep > step.number ? (
										<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M5 13l4 4L19 7"
											></path>
										</svg>
									) : (
										step.number
									)}
								</div>
								<div className="absolute top-10 left-1/2 -translate-x-1/2 transform text-center whitespace-nowrap">
									<div
										className={`mb-1 text-sm font-medium ${
											currentStep >= step.number ? 'text-primary' : 'text-text-muted'
										}`}
									>
										{step.title}
									</div>
									<div className="text-text-muted max-w-24 text-xs leading-tight">
										{step.description}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Step Content */}
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					{/* Main Content */}
					<div className="lg:col-span-2">
						<div className="bg-bg-card border-overlay0 rounded-2xl border p-8">
							{currentStep === 1 && <CheckoutStep1 />}
							{currentStep === 2 && <CheckoutStep2 />}
							{currentStep === 3 && <CheckoutStep3 />}
						</div>
					</div>

					{/* Order Summary Sidebar */}
					<div className="lg:col-span-1">
						<div className="bg-bg-elevated border-overlay0 sticky top-8 rounded-2xl border p-6">
							<h3 className="text-text-primary mb-6 text-lg font-bold">Order Summary</h3>

							{/* Items */}
							<div className="mb-6 space-y-4">
								{items.map((item) => (
									<div key={item.id} className="flex items-center space-x-3">
										<div className="bg-bg-card border-overlay0 h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border">
											{item.image_path ? (
												<img
													src={item.image_path}
													alt={item.name}
													className="h-full w-full object-cover"
												/>
											) : (
												<div className="text-text-muted flex h-full w-full items-center justify-center">
													📦
												</div>
											)}
										</div>
										<div className="min-w-0 flex-1">
											<div className="text-text-primary truncate text-sm font-medium">
												{item.name}
											</div>
											<div className="text-text-muted text-xs">Qty: {item.quantity}</div>
										</div>
										<div className="text-text-primary text-sm font-semibold">
											{formatPrice(item.price * item.quantity)}
										</div>
									</div>
								))}
							</div>

							{/* Totals */}
							<div className="border-overlay0 space-y-3 border-t pt-4">
								<div className="text-text-secondary flex justify-between">
									<span>Subtotal</span>
									<span>{formatPrice(total)}</span>
								</div>
								<div className="text-text-secondary flex justify-between">
									<span>Shipping</span>
									<span className="text-success">Free</span>
								</div>
								<div className="text-text-secondary flex justify-between">
									<span>Tax</span>
									<span>{formatPrice(total * 0.08)}</span>
								</div>
								<div className="border-overlay0 border-t pt-3">
									<div className="text-text-primary flex justify-between text-lg font-bold">
										<span>Total</span>
										<span>{formatPrice(total * 1.08)}</span>
									</div>
								</div>
							</div>

							{/* Security Badge */}
							<div className="border-overlay0 mt-6 border-t pt-6">
								<div className="text-text-muted flex items-center space-x-2 text-sm">
									<svg
										className="text-success h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
										></path>
									</svg>
									<span>Secure 256-bit SSL encryption</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
