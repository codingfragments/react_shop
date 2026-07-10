import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function formatPrice(price: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	}).format(price);
}

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

interface ConfettiParticle {
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;
	speed: number;
	angle: number;
}

export default function OrderConfirmationPage() {
	const { orderId } = useParams();
	const navigate = useNavigate();

	// Mock order data (in real app, this would come from API)
	const order = useMemo(
		() => ({
			id: orderId,
			date: new Date().toISOString(),
			status: 'confirmed',
			estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
			tracking: {
				number: `KCT${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
				carrier: 'UPS',
				url: `https://www.ups.com/track?loc=en_US&tracknum=KCT${Math.random()
					.toString(36)
					.substr(2, 8)
					.toUpperCase()}`
			},
			items: [
				{
					id: 1,
					name: 'GMMK Pro Mechanical Keyboard',
					category: 'Keyboards',
					price: 169.99,
					quantity: 1,
					image: '/images/keyboards/gmmk-pro.jpg'
				}
			],
			shipping: {
				method: 'Standard Shipping',
				address: {
					name: 'John Doe',
					line1: '123 Main Street',
					line2: 'Unit 4B',
					city: 'San Francisco',
					state: 'CA',
					zip: '94105'
				}
			},
			payment: {
				method: 'Credit Card',
				last4: '4242'
			},
			totals: {
				subtotal: 169.99,
				shipping: 0,
				tax: 13.6,
				total: 183.59
			}
		}),
		[orderId]
	);

	useEffect(() => {
		document.title = 'Order Confirmation - KeyCraft';
	}, []);

	function continueShopping() {
		navigate('/products');
	}

	function trackOrder() {
		navigate(`/track-order/${order.tracking.number}`);
	}

	useEffect(() => {
		// Confetti animation
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.position = 'fixed';
		canvas.style.top = '0';
		canvas.style.left = '0';
		canvas.style.pointerEvents = 'none';
		canvas.style.zIndex = '9999';
		document.body.appendChild(canvas);

		const confetti: ConfettiParticle[] = [];
		const colors = ['#8AADF4', '#F5BDE6', '#A6DA95', '#EED49F', '#F0C6C6'];

		for (let i = 0; i < 50; i++) {
			confetti.push({
				x: Math.random() * canvas.width,
				y: -10,
				width: Math.random() * 10 + 5,
				height: Math.random() * 10 + 5,
				color: colors[Math.floor(Math.random() * colors.length)],
				speed: Math.random() * 3 + 2,
				angle: Math.random() * 360
			});
		}

		let animationFrameId: number;

		function animate() {
			if (!ctx) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (let i = confetti.length - 1; i >= 0; i--) {
				const particle = confetti[i];
				particle.y += particle.speed;
				particle.angle += 2;

				ctx.save();
				ctx.translate(particle.x + particle.width / 2, particle.y + particle.height / 2);
				ctx.rotate((particle.angle * Math.PI) / 180);
				ctx.fillStyle = particle.color;
				ctx.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
				ctx.restore();

				if (particle.y > canvas.height) {
					confetti.splice(i, 1);
				}
			}

			if (confetti.length > 0) {
				animationFrameId = requestAnimationFrame(animate);
			} else {
				document.body.removeChild(canvas);
			}
		}

		animate();

		return () => {
			cancelAnimationFrame(animationFrameId);
			if (canvas.parentNode) {
				document.body.removeChild(canvas);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="container mx-auto px-4 py-8" style={{ maxWidth: 1400 }}>
			<div className="max-w-4xl mx-auto">
				{/* Success Header */}
				<div className="text-center mb-12">
					<div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
						<svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
						</svg>
					</div>
					<h1 className="text-4xl font-bold text-text-primary mb-4">Order Confirmed! 🎉</h1>
					<p className="text-xl text-text-muted mb-2">Thank you for your purchase!</p>
					<p className="text-text-secondary">
						Your order <span className="font-mono font-bold text-primary">#{order.id}</span> has
						been confirmed and is being prepared for shipment.
					</p>
				</div>

				{/* Order Summary Card */}
				<div className="bg-bg-card border border-overlay0 rounded-2xl overflow-hidden mb-8">
					{/* Order Header */}
					<div className="bg-bg-elevated border-b border-overlay0 px-8 py-6">
						<div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
							<div>
								<h2 className="text-2xl font-bold text-text-primary mb-2">Order #{order.id}</h2>
								<p className="text-text-muted">Placed on {formatDate(order.date)}</p>
							</div>
							<div className="flex space-x-4">
								<button
									onClick={trackOrder}
									className="px-6 py-3 bg-primary text-base rounded-xl hover:bg-secondary transition-colors font-semibold"
								>
									Track Order
								</button>
								<button
									onClick={continueShopping}
									className="px-6 py-3 border border-primary text-primary rounded-xl hover:bg-primary hover:text-base transition-colors font-semibold"
								>
									Continue Shopping
								</button>
							</div>
						</div>
					</div>

					{/* Order Items */}
					<div className="px-8 py-6">
						<h3 className="text-lg font-semibold text-text-primary mb-6">Order Items</h3>
						<div className="space-y-4">
							{order.items.map((item) => (
								<div key={item.id} className="flex items-center space-x-4 p-4 bg-bg-elevated rounded-xl">
									<div className="w-16 h-16 bg-bg-card border border-overlay0 rounded-lg overflow-hidden flex-shrink-0">
										<img
											src={item.image}
											alt={item.name}
											className="w-full h-full object-cover"
											loading="lazy"
										/>
									</div>
									<div className="flex-1">
										<h4 className="font-semibold text-text-primary">{item.name}</h4>
										<p className="text-sm text-text-muted">{item.category}</p>
										<p className="text-sm text-text-secondary">Quantity: {item.quantity}</p>
									</div>
									<div className="text-right">
										<div className="font-semibold text-text-primary">
											{formatPrice(item.price * item.quantity)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Order Details Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
					{/* Shipping Information */}
					<div className="bg-bg-card border border-overlay0 rounded-2xl p-6">
						<h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
								></path>
							</svg>
							<span>Shipping Information</span>
						</h3>
						<div className="space-y-3">
							<div>
								<p className="font-medium text-text-primary">{order.shipping.address.name}</p>
								<p className="text-text-secondary">{order.shipping.address.line1}</p>
								{order.shipping.address.line2 && (
									<p className="text-text-secondary">{order.shipping.address.line2}</p>
								)}
								<p className="text-text-secondary">
									{order.shipping.address.city}, {order.shipping.address.state}{' '}
									{order.shipping.address.zip}
								</p>
							</div>
							<div className="pt-3 border-t border-overlay0">
								<p className="text-sm text-text-muted">Shipping Method</p>
								<p className="font-medium text-text-primary">{order.shipping.method}</p>
							</div>
							<div>
								<p className="text-sm text-text-muted">Estimated Delivery</p>
								<p className="font-medium text-success">{order.estimatedDelivery}</p>
							</div>
						</div>
					</div>

					{/* Payment & Tracking */}
					<div className="space-y-6">
						{/* Payment Information */}
						<div className="bg-bg-card border border-overlay0 rounded-2xl p-6">
							<h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
									></path>
								</svg>
								<span>Payment Information</span>
							</h3>
							<div className="space-y-3">
								<div>
									<p className="text-sm text-text-muted">Payment Method</p>
									<p className="font-medium text-text-primary">
										{order.payment.method} ending in {order.payment.last4}
									</p>
								</div>
								<div className="space-y-2 pt-3 border-t border-overlay0">
									<div className="flex justify-between text-text-secondary">
										<span>Subtotal</span>
										<span>{formatPrice(order.totals.subtotal)}</span>
									</div>
									<div className="flex justify-between text-text-secondary">
										<span>Shipping</span>
										<span>
											{order.totals.shipping === 0 ? 'Free' : formatPrice(order.totals.shipping)}
										</span>
									</div>
									<div className="flex justify-between text-text-secondary">
										<span>Tax</span>
										<span>{formatPrice(order.totals.tax)}</span>
									</div>
									<div className="flex justify-between text-lg font-bold text-text-primary pt-2 border-t border-overlay0">
										<span>Total</span>
										<span>{formatPrice(order.totals.total)}</span>
									</div>
								</div>
							</div>
						</div>

						{/* Tracking Information */}
						<div className="bg-bg-card border border-overlay0 rounded-2xl p-6">
							<h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
									></path>
								</svg>
								<span>Tracking Information</span>
							</h3>
							<div className="space-y-3">
								<div>
									<p className="text-sm text-text-muted">Tracking Number</p>
									<p className="font-mono font-bold text-primary text-lg">{order.tracking.number}</p>
								</div>
								<div>
									<p className="text-sm text-text-muted">Carrier</p>
									<p className="font-medium text-text-primary">{order.tracking.carrier}</p>
								</div>
								<button
									onClick={trackOrder}
									className="w-full mt-4 px-4 py-3 bg-primary/10 border border-primary text-primary rounded-xl hover:bg-primary hover:text-base transition-colors font-semibold"
								>
									Track Your Package
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Next Steps */}
				<div className="bg-bg-elevated border border-overlay0 rounded-2xl p-8">
					<h3 className="text-xl font-bold text-text-primary mb-6">What happens next?</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M5 13l4 4L19 7"
									></path>
								</svg>
							</div>
							<h4 className="font-semibold text-text-primary mb-2">Order Confirmed</h4>
							<p className="text-sm text-text-muted">Your order has been received and is being processed.</p>
						</div>

						<div className="text-center">
							<div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
									></path>
								</svg>
							</div>
							<h4 className="font-semibold text-text-primary mb-2">Preparing for Shipment</h4>
							<p className="text-sm text-text-muted">
								We're carefully packing your items for safe delivery.
							</p>
						</div>

						<div className="text-center">
							<div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8v6a2 2 0 002 2h10a2 2 0 002-2V9M7 13v6a2 2 0 002 2h10a2 2 0 002-2V9"
									></path>
								</svg>
							</div>
							<h4 className="font-semibold text-text-primary mb-2">Delivered</h4>
							<p className="text-sm text-text-muted">Your order will arrive by {order.estimatedDelivery}.</p>
						</div>
					</div>
				</div>

				{/* Support */}
				<div className="text-center mt-12">
					<p className="text-text-muted mb-4">Need help with your order?</p>
					<div className="flex flex-wrap justify-center gap-4">
						<a href="/support" className="text-primary hover:text-secondary font-medium">
							Contact Support
						</a>
						<span className="text-text-muted">•</span>
						<a href="/faq" className="text-primary hover:text-secondary font-medium">
							FAQ
						</a>
						<span className="text-text-muted">•</span>
						<a href="/returns" className="text-primary hover:text-secondary font-medium">
							Return Policy
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
