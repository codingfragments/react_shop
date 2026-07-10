import { useEffect, useState } from 'react';
import { useCheckoutStore } from '../../lib/stores/checkout';

const states = [
	'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
	'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
	'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
	'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
	'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export default function CheckoutStep1() {
	const { shippingAddress, updateShippingAddress, setStep } = useCheckoutStore();

	const [form, setForm] = useState({
		firstName: shippingAddress.firstName || '',
		lastName: shippingAddress.lastName || '',
		email: shippingAddress.email || '',
		phone: shippingAddress.phone || '',
		address1: shippingAddress.address1 || '',
		address2: shippingAddress.address2 || '',
		city: shippingAddress.city || '',
		state: shippingAddress.state || '',
		zipCode: shippingAddress.zipCode || '',
		country: shippingAddress.country || 'US'
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	function validateForm(): boolean {
		const newErrors: Record<string, string> = {};

		if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
		if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
		if (!form.email.trim()) newErrors.email = 'Email is required';
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email format';
		if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
		if (!form.address1.trim()) newErrors.address1 = 'Address is required';
		if (!form.city.trim()) newErrors.city = 'City is required';
		if (!form.state.trim()) newErrors.state = 'State is required';
		if (!form.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	function handleContinue() {
		if (validateForm()) {
			updateShippingAddress(form);
			setStep(2);
		}
	}

	function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
		setForm((prev) => ({ ...prev, [key]: value }));
	}

	// Update store on input changes
	useEffect(() => {
		updateShippingAddress(form);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form]);

	return (
		<div>
			<h2 className="text-2xl font-bold text-text-primary mb-6">Shipping Information</h2>
			<p className="text-text-muted mb-8">Please provide your shipping address details.</p>

			<form className="space-y-6">
				{/* Contact Information */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-text-primary">Contact Information</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label htmlFor="firstName" className="block text-sm font-medium text-text-primary mb-2">
								First Name *
							</label>
							<input
								id="firstName"
								value={form.firstName}
								onChange={(e) => updateField('firstName', e.target.value)}
								type="text"
								className={`w-full px-4 py-3 bg-bg-elevated border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
									errors.firstName ? 'border-error' : 'border-overlay0'
								}`}
							/>
							{errors.firstName && <p className="text-error text-xs mt-1">{errors.firstName}</p>}
						</div>

						<div>
							<label htmlFor="lastName" className="block text-sm font-medium text-text-primary mb-2">
								Last Name *
							</label>
							<input
								id="lastName"
								value={form.lastName}
								onChange={(e) => updateField('lastName', e.target.value)}
								type="text"
								className={`w-full px-4 py-3 bg-bg-elevated border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
									errors.lastName ? 'border-error' : 'border-overlay0'
								}`}
							/>
							{errors.lastName && <p className="text-error text-xs mt-1">{errors.lastName}</p>}
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
								Email Address *
							</label>
							<input
								id="email"
								value={form.email}
								onChange={(e) => updateField('email', e.target.value)}
								type="email"
								className={`w-full px-4 py-3 bg-bg-elevated border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
									errors.email ? 'border-error' : 'border-overlay0'
								}`}
							/>
							{errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
						</div>

						<div>
							<label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
								Phone Number *
							</label>
							<input
								id="phone"
								value={form.phone}
								onChange={(e) => updateField('phone', e.target.value)}
								type="tel"
								className={`w-full px-4 py-3 bg-bg-elevated border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
									errors.phone ? 'border-error' : 'border-overlay0'
								}`}
							/>
							{errors.phone && <p className="text-error text-xs mt-1">{errors.phone}</p>}
						</div>
					</div>
				</div>

				{/* Shipping Address */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-text-primary">Shipping Address</h3>

					<div>
						<label htmlFor="address1" className="block text-sm font-medium text-text-primary mb-2">
							Street Address *
						</label>
						<input
							id="address1"
							value={form.address1}
							onChange={(e) => updateField('address1', e.target.value)}
							type="text"
							placeholder="123 Main Street"
							className={`w-full px-4 py-3 bg-bg-elevated border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
								errors.address1 ? 'border-error' : 'border-overlay0'
							}`}
						/>
						{errors.address1 && <p className="text-error text-xs mt-1">{errors.address1}</p>}
					</div>

					<div>
						<label htmlFor="address2" className="block text-sm font-medium text-text-primary mb-2">
							Apartment, Suite, etc. (Optional)
						</label>
						<input
							id="address2"
							value={form.address2}
							onChange={(e) => updateField('address2', e.target.value)}
							type="text"
							placeholder="Unit 4B"
							className="w-full px-4 py-3 bg-bg-elevated border border-overlay0 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label htmlFor="city" className="block text-sm font-medium text-text-primary mb-2">
								City *
							</label>
							<input
								id="city"
								value={form.city}
								onChange={(e) => updateField('city', e.target.value)}
								type="text"
								className={`w-full px-4 py-3 bg-bg-elevated border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
									errors.city ? 'border-error' : 'border-overlay0'
								}`}
							/>
							{errors.city && <p className="text-error text-xs mt-1">{errors.city}</p>}
						</div>

						<div>
							<label htmlFor="state" className="block text-sm font-medium text-text-primary mb-2">
								State *
							</label>
							<select
								id="state"
								value={form.state}
								onChange={(e) => updateField('state', e.target.value)}
								className={`w-full px-4 py-3 bg-bg-elevated border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
									errors.state ? 'border-error' : 'border-overlay0'
								}`}
							>
								<option value="">Select State</option>
								{states.map((state) => (
									<option key={state} value={state}>
										{state}
									</option>
								))}
							</select>
							{errors.state && <p className="text-error text-xs mt-1">{errors.state}</p>}
						</div>

						<div>
							<label htmlFor="zipCode" className="block text-sm font-medium text-text-primary mb-2">
								ZIP Code *
							</label>
							<input
								id="zipCode"
								value={form.zipCode}
								onChange={(e) => updateField('zipCode', e.target.value)}
								type="text"
								className={`w-full px-4 py-3 bg-bg-elevated border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
									errors.zipCode ? 'border-error' : 'border-overlay0'
								}`}
							/>
							{errors.zipCode && <p className="text-error text-xs mt-1">{errors.zipCode}</p>}
						</div>
					</div>
				</div>

				{/* Continue Button */}
				<div className="flex justify-end pt-6">
					<button
						type="button"
						onClick={handleContinue}
						className="px-8 py-3 bg-primary text-base rounded-2xl font-semibold border-4 border-primary"
					>
						Continue to Review
					</button>
				</div>
			</form>
		</div>
	);
}
