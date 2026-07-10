import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

function formatDateTime(dateString: string): string {
	return new Date(dateString).toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
}

function getStatusIcon(status: string): string {
	switch (status.toLowerCase()) {
		case 'order placed':
			return '📦';
		case 'processing':
			return '⚡';
		case 'shipped':
			return '🚚';
		case 'in transit':
			return '🚛';
		case 'out for delivery':
			return '🚚';
		case 'delivered':
			return '✅';
		default:
			return '📍';
	}
}

export default function TrackOrderPage() {
	const { trackingNumber } = useParams();
	const [lastUpdated, setLastUpdated] = useState(() => new Date());

	// Mock tracking data (in real app, this would come from shipping provider API)
	const trackingData = useMemo(
		() => ({
			number: trackingNumber,
			status: 'in_transit',
			carrier: 'UPS',
			estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
			currentLocation: 'San Francisco, CA',
			recipient: 'John Doe',
			address: '123 Main Street, Unit 4B, San Francisco, CA 94105',
			events: [
				{
					date: '2024-01-15T10:30:00Z',
					status: 'Order Placed',
					location: 'KeyCraft Fulfillment Center',
					description: 'Your order has been received and is being processed.'
				},
				{
					date: '2024-01-15T14:45:00Z',
					status: 'Processing',
					location: 'KeyCraft Fulfillment Center',
					description: 'Items are being picked and packed for shipment.'
				},
				{
					date: '2024-01-16T09:15:00Z',
					status: 'Shipped',
					location: 'KeyCraft Fulfillment Center',
					description: 'Package has been shipped and is on its way to you.'
				},
				{
					date: '2024-01-16T16:20:00Z',
					status: 'In Transit',
					location: 'UPS Facility - Oakland, CA',
					description: 'Package is in transit to the next facility.'
				},
				{
					date: '2024-01-17T08:45:00Z',
					status: 'In Transit',
					location: 'UPS Facility - San Francisco, CA',
					description: 'Package has arrived at the destination facility.'
				},
				{
					date: '2024-01-17T12:00:00Z',
					status: 'Out for Delivery',
					location: 'San Francisco, CA',
					description: 'Package is out for delivery and will arrive today.'
				}
			]
		}),
		[trackingNumber]
	);

	const currentEventIndex = trackingData.events.length - 1;

	useEffect(() => {
		document.title = `Track Order #${trackingNumber} - KeyCraft`;
	}, [trackingNumber]);

	useEffect(() => {
		// Auto-refresh tracking data every 5 minutes
		const interval = setInterval(() => {
			// In real app, fetch latest tracking data
			console.log('Refreshing tracking data...');
			setLastUpdated(new Date());
		}, 5 * 60 * 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="container mx-auto px-4 py-8" style={{ maxWidth: 1400 }}>
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-text-primary mb-2">Track Your Order</h1>
					<p className="text-text-muted">
						Tracking Number: <span className="font-mono font-bold text-primary">{trackingNumber}</span>
					</p>
				</div>

				{/* Status Overview */}
				<div className="bg-bg-card border border-overlay0 rounded-2xl p-8 mb-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="text-center">
							<div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
									></path>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-text-primary mb-2">Current Status</h3>
							<p className="text-2xl font-bold text-primary mb-1">
								{trackingData.events[currentEventIndex]?.status || 'In Transit'}
							</p>
							<p className="text-text-muted">{trackingData.currentLocation}</p>
						</div>

						<div className="text-center">
							<div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 10V7"
									></path>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-text-primary mb-2">Estimated Delivery</h3>
							<p className="text-2xl font-bold text-success mb-1">{trackingData.estimatedDelivery}</p>
							<p className="text-text-muted">Before 8:00 PM</p>
						</div>

						<div className="text-center">
							<div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									></path>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									></path>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-text-primary mb-2">Delivery Address</h3>
							<p className="font-semibold text-text-primary">{trackingData.recipient}</p>
							<p className="text-text-muted text-sm">{trackingData.address}</p>
						</div>
					</div>
				</div>

				{/* Tracking Timeline */}
				<div className="bg-bg-card border border-overlay0 rounded-2xl p-8">
					<h2 className="text-2xl font-bold text-text-primary mb-8">Tracking Timeline</h2>

					<div className="relative">
						{/* Timeline Line */}
						<div className="absolute left-8 top-0 bottom-0 w-0.5 bg-overlay0"></div>
						<div
							className="absolute left-8 top-0 w-0.5 bg-primary transition-all duration-1000"
							style={{ height: `${((currentEventIndex + 1) / trackingData.events.length) * 100}%` }}
						></div>

						{/* Timeline Events */}
						<div className="space-y-8">
							{trackingData.events.map((event, index) => {
								const isPast = index <= currentEventIndex;
								const isCurrent = index === currentEventIndex;
								return (
									<div key={index} className="relative flex items-start space-x-6">
										{/* Timeline Dot */}
										<div
											className={`relative z-10 w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl transition-all duration-300 ${
												isPast
													? 'bg-primary border-primary text-base'
													: 'bg-bg-primary border-overlay0 text-text-muted'
											}`}
										>
											{isPast ? (
												isCurrent ? (
													<div className="animate-pulse">{getStatusIcon(event.status)}</div>
												) : (
													<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="3"
															d="M5 13l4 4L19 7"
														></path>
													</svg>
												)
											) : (
												getStatusIcon(event.status)
											)}
										</div>

										{/* Event Details */}
										<div className="flex-1 pb-8">
											<div
												className={`p-6 rounded-xl border transition-all duration-300 ${
													!isPast ? 'bg-bg-elevated border-overlay0' : ''
												}`}
												style={
													isPast
														? {
																backgroundColor: 'rgb(138 173 244 / 0.05)',
																borderColor: 'rgb(138 173 244 / 0.2)'
															}
														: undefined
												}
											>
												<div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
													<h3
														className={`text-lg font-bold mb-1 md:mb-0 ${
															isPast ? 'text-primary' : 'text-text-muted'
														}`}
													>
														{event.status}
														{isCurrent && (
															<span className="inline-block ml-2">
																<div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
															</span>
														)}
													</h3>
													<div
														className={`text-sm font-medium ${
															isPast ? 'text-primary' : 'text-text-muted'
														}`}
													>
														{formatDateTime(event.date)}
													</div>
												</div>

												<div className="space-y-2">
													<p className={`font-medium ${isPast ? 'text-text-primary' : 'text-text-muted'}`}>
														📍 {event.location}
													</p>
													<p className={`text-sm ${isPast ? 'text-text-secondary' : 'text-text-muted'}`}>
														{event.description}
													</p>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Additional Information */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
					{/* Shipping Details */}
					<div className="bg-bg-card border border-overlay0 rounded-2xl p-6">
						<h3 className="text-lg font-semibold text-text-primary mb-4">Shipping Details</h3>
						<div className="space-y-3">
							<div>
								<p className="text-sm text-text-muted">Carrier</p>
								<p className="font-medium text-text-primary">{trackingData.carrier}</p>
							</div>
							<div>
								<p className="text-sm text-text-muted">Service Type</p>
								<p className="font-medium text-text-primary">Ground</p>
							</div>
							<div>
								<p className="text-sm text-text-muted">Package Weight</p>
								<p className="font-medium text-text-primary">2.1 lbs</p>
							</div>
							<div>
								<p className="text-sm text-text-muted">Dimensions</p>
								<p className="font-medium text-text-primary">12" × 8" × 3"</p>
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="bg-bg-card border border-overlay0 rounded-2xl p-6">
						<h3 className="text-lg font-semibold text-text-primary mb-4">Need Help?</h3>
						<div className="space-y-4">
							<button className="w-full px-4 py-3 bg-primary/10 border border-primary text-primary rounded-xl hover:bg-primary hover:text-base transition-colors font-semibold">
								Update Delivery Instructions
							</button>
							<button className="w-full px-4 py-3 border border-overlay0 text-text-primary rounded-xl hover:bg-bg-hover transition-colors font-medium">
								Report a Problem
							</button>
							<div className="pt-4 border-t border-overlay0">
								<p className="text-sm text-text-muted mb-2">Customer Support</p>
								<p className="font-medium text-text-primary">1-800-KEYCRAFT</p>
								<p className="text-sm text-text-muted">Available 24/7</p>
							</div>
						</div>
					</div>
				</div>

				{/* Auto-refresh Notice */}
				<div className="text-center mt-8">
					<p className="text-text-muted text-sm">
						This page automatically refreshes every 5 minutes. Last updated:{' '}
						{lastUpdated.toLocaleTimeString()}
					</p>
				</div>
			</div>
		</div>
	);
}
