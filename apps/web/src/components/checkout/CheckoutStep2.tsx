import { useState } from 'react';
import { useCartStore } from '../../lib/stores/cart';
import { useCheckoutStore } from '../../lib/stores/checkout';

const shippingOptions = [
	{
		id: 'standard',
		name: 'Standard Shipping',
		description: '5-7 business days',
		price: 0
	},
	{
		id: 'express',
		name: 'Express Shipping',
		description: '2-3 business days',
		price: 15.99
	},
	{
		id: 'overnight',
		name: 'Overnight Shipping',
		description: 'Next business day',
		price: 29.99
	}
];

function formatPrice(price: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	}).format(price);
}

export default function CheckoutStep2() {
	const { items, total, itemCount } = useCartStore();
	const { shippingAddress, shippingMethod: storedShippingMethod, orderNotes: storedOrderNotes, setStep, setShippingMethod, setOrderNotes } =
		useCheckoutStore();

	const [shippingMethod, setLocalShippingMethod] = useState(storedShippingMethod || 'standard');
	const [orderNotes, setLocalOrderNotes] = useState(storedOrderNotes || '');

	function handleBack() {
		setStep(1);
	}

	function handleContinue() {
		setShippingMethod(shippingMethod);
		setOrderNotes(orderNotes);
		setStep(3);
	}

	const selectedShipping = shippingOptions.find((option) => option.id === shippingMethod);
	const shippingCost = selectedShipping?.price || 0;
	const orderTotal = (total + shippingCost) * 1.08;

	return (
		<div>
			<h2 className="text-text-primary mb-6 text-2xl font-bold">Review Your Order</h2>
			<p className="text-text-muted mb-8">
				Please review your items and shipping details before proceeding to payment.
			</p>

			{/* Order Items */}
			<div className="mb-8 space-y-6">
				<h3 className="text-text-primary text-lg font-semibold">Order Items</h3>
				<div className="bg-bg-elevated border-overlay0 rounded-xl border p-6">
					<div className="space-y-4">
						{items.map((item) => (
							<div
								key={item.id}
								className="border-overlay0 flex items-center space-x-4 border-b pb-4 last:border-b-0 last:pb-0"
							>
								<div className="bg-bg-card border-overlay0 h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border">
									{item.image_path ? (
										<img src={item.image_path} alt={item.name} className="h-full w-full object-cover" />
									) : (
										<div className="text-text-muted flex h-full w-full items-center justify-center">📦</div>
									)}
								</div>
								<div className="flex-1">
									<h4 className="text-text-primary font-semibold">{item.name}</h4>
									<p className="text-text-muted text-sm capitalize">
										{item.category_slug?.replace('-', ' ')}
									</p>
									<div className="mt-1 flex items-center space-x-2">
										<span className="text-text-secondary text-sm">Qty: {item.quantity}</span>
										<span className="text-text-secondary text-sm">•</span>
										<span className="text-primary text-sm font-medium">{formatPrice(item.price)}</span>
									</div>
								</div>
								<div className="text-right">
									<div className="text-text-primary font-semibold">
										{formatPrice(item.price * item.quantity)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Shipping Address */}
			<div className="mb-8 space-y-6">
				<h3 className="text-text-primary text-lg font-semibold">Shipping Address</h3>
				<div className="bg-bg-elevated border-overlay0 rounded-xl border p-6">
					<div className="space-y-2">
						<p className="text-text-primary font-medium">
							{shippingAddress.firstName} {shippingAddress.lastName}
						</p>
						<p className="text-text-secondary">{shippingAddress.address1}</p>
						{shippingAddress.address2 && (
							<p className="text-text-secondary">{shippingAddress.address2}</p>
						)}
						<p className="text-text-secondary">
							{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
						</p>
						<div className="border-overlay0 mt-4 border-t pt-2">
							<p className="text-text-secondary text-sm">Contact: {shippingAddress.email}</p>
							<p className="text-text-secondary text-sm">Phone: {shippingAddress.phone}</p>
						</div>
					</div>
					<button
						onClick={handleBack}
						className="text-primary hover:text-secondary mt-4 text-sm font-medium transition-colors"
					>
						← Edit Address
					</button>
				</div>
			</div>

			{/* Shipping Options */}
			<div className="mb-8 space-y-6">
				<h3 className="text-text-primary text-lg font-semibold">Shipping Method</h3>
				<div className="space-y-3">
					{shippingOptions.map((option) => (
						<label key={option.id} className="block">
							<input
								type="radio"
								name="shipping"
								value={option.id}
								checked={shippingMethod === option.id}
								onChange={() => setLocalShippingMethod(option.id)}
								className="sr-only"
							/>
							<div
								className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-all duration-200 ${
									shippingMethod === option.id
										? 'border-violet-500'
										: 'border-overlay0 hover:border-overlay1'
								}`}
								style={
									shippingMethod === option.id
										? { backgroundColor: 'rgb(138 173 244 / 0.05)' }
										: undefined
								}
							>
								<div className="flex items-center space-x-4">
									<div
										className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
											shippingMethod === option.id
												? 'border-primary bg-violet-500'
												: 'border-overlay0'
										}`}
									>
										{shippingMethod === option.id && (
											<div className="bg-base h-2 w-2 rounded-full"></div>
										)}
									</div>
									<div>
										<div className="text-text-primary font-medium">{option.name}</div>
										<div className="text-text-muted text-sm">{option.description}</div>
									</div>
								</div>
								<div className="text-text-primary font-semibold">
									{option.price === 0 ? 'Free' : formatPrice(option.price)}
								</div>
							</div>
						</label>
					))}
				</div>
			</div>

			{/* Order Notes */}
			<div className="mb-8 space-y-4">
				<h3 className="text-text-primary text-lg font-semibold">Order Notes (Optional)</h3>
				<textarea
					value={orderNotes}
					onChange={(e) => setLocalOrderNotes(e.target.value)}
					placeholder="Add any special instructions for your order..."
					rows={4}
					className="bg-bg-elevated border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full resize-none rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
				></textarea>
			</div>

			{/* Order Summary */}
			<div className="bg-bg-elevated border-overlay0 mb-8 rounded-xl border p-6">
				<h3 className="text-text-primary mb-4 text-lg font-semibold">Order Summary</h3>
				<div className="space-y-3">
					<div className="text-text-secondary flex justify-between">
						<span>Subtotal ({itemCount} items)</span>
						<span>{formatPrice(total)}</span>
					</div>
					<div className="text-text-secondary flex justify-between">
						<span>Shipping</span>
						<span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
					</div>
					<div className="text-text-secondary flex justify-between">
						<span>Tax</span>
						<span>{formatPrice((total + shippingCost) * 0.08)}</span>
					</div>
					<div className="border-overlay0 border-t pt-3">
						<div className="text-text-primary flex justify-between text-xl font-bold">
							<span>Total</span>
							<span>{formatPrice(orderTotal)}</span>
						</div>
					</div>
				</div>
			</div>

			{/* Navigation */}
			<div className="flex justify-between pt-6">
				<button
					onClick={handleBack}
					className="border-primary text-primary hover:bg-primary rounded-2xl border px-8 py-3 font-semibold transition-all duration-300 hover:text-base"
				>
					← Back to Shipping
				</button>
				<button
					onClick={handleContinue}
					className="bg-primary border-primary rounded-2xl border-4 px-8 py-3 text-base font-semibold"
				>
					Continue to Payment
				</button>
			</div>
		</div>
	);
}
