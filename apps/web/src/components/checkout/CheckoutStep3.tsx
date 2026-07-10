import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../lib/stores/cart';
import { useCheckoutStore } from '../../lib/stores/checkout';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 15 }, (_, i) => currentYear + i);
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

function formatCardNumber(value: string): string {
	return value
		.replace(/\D/g, '')
		.replace(/(\d{4})(?=\d)/g, '$1 ')
		.trim();
}

function getCardType(cardNumber: string): string {
	const number = cardNumber.replace(/\s/g, '');
	if (/^4/.test(number)) return 'visa';
	if (/^5[1-5]/.test(number)) return 'mastercard';
	if (/^3[47]/.test(number)) return 'amex';
	if (/^6/.test(number)) return 'discover';
	return 'card';
}

export default function CheckoutStep3() {
	const navigate = useNavigate();
	const clearCart = useCartStore((state) => state.clearCart);
	const { shippingAddress, updatePaymentInfo, setAgreedToTerms: storeSetAgreedToTerms, completeCheckout, setStep, reset } =
		useCheckoutStore();

	const [form, setForm] = useState({
		cardNumber: '',
		expiryMonth: '',
		expiryYear: '',
		cvv: '',
		cardholderName: '',
		sameAsBilling: true
	});

	const [billingForm, setBillingForm] = useState({
		firstName: shippingAddress.firstName || '',
		lastName: shippingAddress.lastName || '',
		address1: shippingAddress.address1 || '',
		address2: shippingAddress.address2 || '',
		city: shippingAddress.city || '',
		state: shippingAddress.state || '',
		zipCode: shippingAddress.zipCode || ''
	});

	const [agreedToTerms, setAgreedToTerms] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	function updateForm<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
		setForm((prev) => ({ ...prev, [key]: value }));
	}

	function updateBillingForm<K extends keyof typeof billingForm>(
		key: K,
		value: (typeof billingForm)[K]
	) {
		setBillingForm((prev) => ({ ...prev, [key]: value }));
	}

	function handleCardNumberInput(event: React.ChangeEvent<HTMLInputElement>) {
		updateForm('cardNumber', formatCardNumber(event.target.value));
	}

	function validateForm(): boolean {
		const newErrors: Record<string, string> = {};

		const cardNumber = form.cardNumber.replace(/\s/g, '');
		if (!cardNumber) newErrors.cardNumber = 'Card number is required';
		else if (cardNumber.length < 13 || cardNumber.length > 19)
			newErrors.cardNumber = 'Invalid card number';

		if (!form.expiryMonth) newErrors.expiryMonth = 'Expiry month is required';
		if (!form.expiryYear) newErrors.expiryYear = 'Expiry year is required';
		if (!form.cvv) newErrors.cvv = 'CVV is required';
		else if (form.cvv.length < 3 || form.cvv.length > 4) newErrors.cvv = 'Invalid CVV';
		if (!form.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';
		if (!agreedToTerms) newErrors.terms = 'You must agree to the terms and conditions';

		if (!form.sameAsBilling) {
			if (!billingForm.firstName.trim()) newErrors.billingFirstName = 'First name is required';
			if (!billingForm.lastName.trim()) newErrors.billingLastName = 'Last name is required';
			if (!billingForm.address1.trim()) newErrors.billingAddress1 = 'Address is required';
			if (!billingForm.city.trim()) newErrors.billingCity = 'City is required';
			if (!billingForm.state.trim()) newErrors.billingState = 'State is required';
			if (!billingForm.zipCode.trim()) newErrors.billingZipCode = 'ZIP code is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	async function handlePlaceOrder() {
		if (!validateForm()) return;

		setIsProcessing(true);

		try {
			// Save payment info (in real app, this would be securely processed)
			updatePaymentInfo({
				cardNumber: form.cardNumber.slice(-4), // Only store last 4 digits
				expiryMonth: form.expiryMonth,
				expiryYear: form.expiryYear,
				cardholderName: form.cardholderName
			});

			storeSetAgreedToTerms(agreedToTerms);
			completeCheckout();

			// Simulate processing time
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Generate order ID and redirect to confirmation
			const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
			clearCart();
			reset();

			navigate(`/order-confirmation/${orderId}`);
		} catch (error) {
			console.error('Payment processing error:', error);
			// Handle payment error
		} finally {
			setIsProcessing(false);
		}
	}

	function handleBack() {
		setStep(2);
	}

	const cardType = getCardType(form.cardNumber);

	return (
		<div>
			<h2 className="text-text-primary mb-6 text-2xl font-bold">Payment Information</h2>
			<p className="text-text-muted mb-8">Enter your payment details to complete your order.</p>

			<form className="space-y-8">
				{/* Payment Method */}
				<div className="space-y-6">
					<h3 className="text-text-primary text-lg font-semibold">Payment Method</h3>

					{/* Card Number */}
					<div>
						<label htmlFor="cardNumber" className="text-text-primary mb-2 block text-sm font-medium">
							Card Number ( can be fake like 4242 4242 4242 4242 )*
						</label>
						<div className="relative">
							<input
								id="cardNumber"
								value={form.cardNumber}
								onChange={handleCardNumberInput}
								type="text"
								maxLength={23}
								placeholder="1234 5678 9012 3456"
								className={`bg-bg-elevated border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 pr-12 transition-colors focus:ring-2 focus:outline-none ${
									errors.cardNumber ? 'border-error' : ''
								}`}
							/>
							<div className="absolute inset-y-0 right-0 flex items-center pr-3">
								{cardType === 'visa' ? (
									<span className="text-blue text-sm font-bold">VISA</span>
								) : cardType === 'mastercard' ? (
									<span className="text-red text-sm font-bold">MC</span>
								) : cardType === 'amex' ? (
									<span className="text-green text-sm font-bold">AMEX</span>
								) : cardType === 'discover' ? (
									<span className="text-orange text-sm font-bold">DISC</span>
								) : (
									<svg className="text-text-muted h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
										></path>
									</svg>
								)}
							</div>
						</div>
						{errors.cardNumber && <p className="text-error mt-1 text-xs">{errors.cardNumber}</p>}
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div>
							<label htmlFor="expiryMonth" className="text-text-primary mb-2 block text-sm font-medium">
								Expiry Month *
							</label>
							<select
								id="expiryMonth"
								value={form.expiryMonth}
								onChange={(e) => updateForm('expiryMonth', e.target.value)}
								className={`bg-bg-elevated border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none ${
									errors.expiryMonth ? 'border-error' : ''
								}`}
							>
								<option value="">Month</option>
								{months.map((month) => (
									<option key={month} value={month}>
										{month}
									</option>
								))}
							</select>
							{errors.expiryMonth && <p className="text-error mt-1 text-xs">{errors.expiryMonth}</p>}
						</div>

						<div>
							<label htmlFor="expiryYear" className="text-text-primary mb-2 block text-sm font-medium">
								Expiry Year *
							</label>
							<select
								id="expiryYear"
								value={form.expiryYear}
								onChange={(e) => updateForm('expiryYear', e.target.value)}
								className={`bg-bg-elevated border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none ${
									errors.expiryYear ? 'border-error' : ''
								}`}
							>
								<option value="">Year</option>
								{years.map((year) => (
									<option key={year} value={year.toString()}>
										{year}
									</option>
								))}
							</select>
							{errors.expiryYear && <p className="text-error mt-1 text-xs">{errors.expiryYear}</p>}
						</div>

						<div>
							<label htmlFor="cvv" className="text-text-primary mb-2 block text-sm font-medium">
								CVV *
							</label>
							<input
								id="cvv"
								value={form.cvv}
								onChange={(e) => updateForm('cvv', e.target.value)}
								type="text"
								maxLength={4}
								placeholder="123"
								className={`bg-bg-elevated border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none ${
									errors.cvv ? 'border-error' : ''
								}`}
							/>
							{errors.cvv && <p className="text-error mt-1 text-xs">{errors.cvv}</p>}
						</div>
					</div>

					<div>
						<label htmlFor="cardholderName" className="text-text-primary mb-2 block text-sm font-medium">
							Cardholder Name *
						</label>
						<input
							id="cardholderName"
							value={form.cardholderName}
							onChange={(e) => updateForm('cardholderName', e.target.value)}
							type="text"
							placeholder="John Doe"
							className={`bg-bg-elevated border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none ${
								errors.cardholderName ? 'border-error' : ''
							}`}
						/>
						{errors.cardholderName && <p className="text-error mt-1 text-xs">{errors.cardholderName}</p>}
					</div>
				</div>

				{/* Billing Address */}
				<div className="space-y-6">
					<h3 className="text-text-primary text-lg font-semibold">Billing Address</h3>

					<label className="flex items-center space-x-3">
						<input
							type="checkbox"
							checked={form.sameAsBilling}
							onChange={(e) => updateForm('sameAsBilling', e.target.checked)}
							className="border-overlay0 text-primary focus:ring-primary rounded focus:ring-offset-0"
						/>
						<span className="text-text-primary">Same as shipping address</span>
					</label>

					{!form.sameAsBilling && (
						<div className="bg-bg-elevated border-overlay0 space-y-4 rounded-xl border p-6">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<label className="text-text-primary mb-2 block text-sm font-medium">First Name *</label>
									<input
										value={billingForm.firstName}
										onChange={(e) => updateBillingForm('firstName', e.target.value)}
										type="text"
										className={`bg-bg-primary border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none ${
											errors.billingFirstName ? 'border-error' : ''
										}`}
									/>
									{errors.billingFirstName && (
										<p className="text-error mt-1 text-xs">{errors.billingFirstName}</p>
									)}
								</div>

								<div>
									<label className="text-text-primary mb-2 block text-sm font-medium">Last Name *</label>
									<input
										value={billingForm.lastName}
										onChange={(e) => updateBillingForm('lastName', e.target.value)}
										type="text"
										className={`bg-bg-primary border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none ${
											errors.billingLastName ? 'border-error' : ''
										}`}
									/>
									{errors.billingLastName && (
										<p className="text-error mt-1 text-xs">{errors.billingLastName}</p>
									)}
								</div>
							</div>

							<div>
								<label className="text-text-primary mb-2 block text-sm font-medium">Address *</label>
								<input
									value={billingForm.address1}
									onChange={(e) => updateBillingForm('address1', e.target.value)}
									type="text"
									className={`bg-bg-primary border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none ${
										errors.billingAddress1 ? 'border-error' : ''
									}`}
								/>
								{errors.billingAddress1 && (
									<p className="text-error mt-1 text-xs">{errors.billingAddress1}</p>
								)}
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
								<div>
									<label className="text-text-primary mb-2 block text-sm font-medium">City *</label>
									<input
										value={billingForm.city}
										onChange={(e) => updateBillingForm('city', e.target.value)}
										type="text"
										className={`bg-bg-primary border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none ${
											errors.billingCity ? 'border-error' : ''
										}`}
									/>
									{errors.billingCity && <p className="text-error mt-1 text-xs">{errors.billingCity}</p>}
								</div>

								<div>
									<label className="text-text-primary mb-2 block text-sm font-medium">State *</label>
									<input
										value={billingForm.state}
										onChange={(e) => updateBillingForm('state', e.target.value)}
										type="text"
										className={`bg-bg-primary border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none ${
											errors.billingState ? 'border-error' : ''
										}`}
									/>
									{errors.billingState && <p className="text-error mt-1 text-xs">{errors.billingState}</p>}
								</div>

								<div>
									<label className="text-text-primary mb-2 block text-sm font-medium">ZIP Code *</label>
									<input
										value={billingForm.zipCode}
										onChange={(e) => updateBillingForm('zipCode', e.target.value)}
										type="text"
										className={`bg-bg-primary border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none ${
											errors.billingZipCode ? 'border-error' : ''
										}`}
									/>
									{errors.billingZipCode && (
										<p className="text-error mt-1 text-xs">{errors.billingZipCode}</p>
									)}
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Terms and Conditions */}
				<div className="space-y-4">
					<label className="flex items-start space-x-3">
						<input
							type="checkbox"
							checked={agreedToTerms}
							onChange={(e) => setAgreedToTerms(e.target.checked)}
							className={`border-overlay0 text-primary focus:ring-primary mt-1 rounded focus:ring-offset-0 ${
								errors.terms ? 'border-error' : ''
							}`}
						/>
						<div className="text-sm">
							<span className="text-text-primary">
								I agree to the{' '}
								<a href="/terms" className="text-primary hover:text-secondary underline">
									Terms and Conditions
								</a>{' '}
								and{' '}
								<a href="/privacy" className="text-primary hover:text-secondary underline">
									Privacy Policy
								</a>
							</span>
						</div>
					</label>
					{errors.terms && <p className="text-error text-xs">{errors.terms}</p>}
				</div>

				{/* Security Notice */}
				<div className="bg-success/10 border-success/20 rounded-xl border p-4">
					<div className="flex items-center space-x-2">
						<svg className="text-success h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							></path>
						</svg>
						<span className="text-success font-medium">Your payment information is secure</span>
					</div>
					<p className="text-success mt-2 text-sm">
						We use industry-standard encryption to protect your payment details. Your card
						information is never stored on our servers.
					</p>
				</div>

				{/* Navigation */}
				<div className="flex justify-between pt-6">
					<button
						type="button"
						onClick={handleBack}
						className="border-primary text-primary hover:bg-primary rounded-2xl border px-8 py-3 font-semibold transition-all duration-300 hover:text-base"
					>
						← Back to Review
					</button>
					<button
						type="button"
						onClick={handlePlaceOrder}
						disabled={isProcessing}
						className="bg-primary relative overflow-hidden rounded-2xl border-4 border-primary px-8 py-3 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isProcessing ? (
							<span className="flex items-center space-x-2">
								<svg className="h-5 w-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 6v6m0 0v6m0-6h6m-6 0H6"
									></path>
								</svg>
								<span>Processing...</span>
							</span>
						) : (
							'Place Order'
						)}
					</button>
				</div>
			</form>
		</div>
	);
}
