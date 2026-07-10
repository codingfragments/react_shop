import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function DocSupportPage() {
	useEffect(() => {
		document.title = 'Help Channels | Next Century Keyboards Docs';
	}, []);

	return (
		<article className="space-y-12">
			<header className="rounded-3xl border border-overlay0 bg-bg-elevated/80 px-8 py-10 shadow-xl shadow-black/10 backdrop-blur">
				<h1 className="text-3xl font-semibold text-text-primary">Help Channels</h1>
				<p className="mt-4 leading-relaxed text-base text-text-muted">
					Whether you are deciding between two switch types or waiting on a shipment, several support
					channels stand ready to help. This guide maps each channel to the situations it handles best.
				</p>
			</header>

			<section className="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
				<h2 className="text-2xl font-semibold text-text-primary">Chatbot Concierge</h2>
				<p className="mt-3 text-sm leading-relaxed text-text-muted">
					The floating chatbot available on every page is the fastest way to get a contextual answer. It
					understands your current cart, recent product views, and can walk you through comparisons,
					compatibility checks, and order status questions in real time.
				</p>
				<ul className="mt-5 space-y-3 text-sm leading-relaxed text-text-muted">
					<li>
						<span className="font-medium text-text-primary">Best for:</span> Quick product comparisons,
						compatibility questions, and general shopping guidance.
					</li>
					<li>
						<span className="font-medium text-text-primary">Response time:</span> Instant, available
						24/7.
					</li>
				</ul>
				<figure className="mt-8 overflow-hidden rounded-3xl border border-dashed border-overlay1 bg-bg-elevated/60 p-4">
					<img
						src="/images/docs/support-chatbot.png"
						alt="Placeholder showing the chatbot answering a compatibility question"
						width="1280"
						height="720"
						className="h-auto w-full rounded-2xl"
					/>
					<figcaption className="mt-3 text-center text-xs tracking-wide text-text-muted uppercase">
						Replace with a 1280×720 capture of the chatbot conversation panel.
					</figcaption>
				</figure>
			</section>

			<section className="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
				<h2 className="text-2xl font-semibold text-text-primary">FAQ Library</h2>
				<p className="mt-3 text-sm leading-relaxed text-text-muted">
					The <Link to="/faq" className="text-primary underline">FAQ page</Link> covers recurring
					questions about shipping, returns, switch break-in, and compatibility. Entries are grouped by
					category and link out to relevant products when applicable.
				</p>
				<ul className="mt-5 space-y-3 text-sm leading-relaxed text-text-muted">
					<li>
						<span className="font-medium text-text-primary">Best for:</span> Policy questions and
						step-by-step troubleshooting that does not require a live conversation.
					</li>
					<li>
						<span className="font-medium text-text-primary">Response time:</span> Immediate — answers are
						already published.
					</li>
				</ul>
			</section>

			<section className="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
				<h2 className="text-2xl font-semibold text-text-primary">Direct Support</h2>
				<p className="mt-3 text-sm leading-relaxed text-text-muted">
					For account-specific or order-specific issues, reach the support team directly. Include your
					order number for the fastest resolution.
				</p>
				<div className="mt-6 grid gap-4 md:grid-cols-2">
					<div className="rounded-2xl border border-overlay0 bg-bg-elevated/80 p-6">
						<h3 className="text-lg font-semibold text-text-primary">Email</h3>
						<p className="mt-3 text-sm leading-relaxed text-text-muted">
							Write to{' '}
							<a href="mailto:support@nextcenturykeyboards.example" className="text-primary underline">
								support@nextcenturykeyboards.example
							</a>{' '}
							for order changes, refunds, or warranty claims. Typical response time is within one
							business day.
						</p>
					</div>
					<div className="rounded-2xl border border-overlay0 bg-bg-elevated/80 p-6">
						<h3 className="text-lg font-semibold text-text-primary">Contact Form</h3>
						<p className="mt-3 text-sm leading-relaxed text-text-muted">
							Visit the{' '}
							<Link to="/contact" className="text-primary underline">
								contact page
							</Link>{' '}
							to submit a structured request with attachments, such as photos of a damaged component.
						</p>
					</div>
				</div>
			</section>

			<section className="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
				<h2 className="text-2xl font-semibold text-text-primary">Community &amp; Self-Service</h2>
				<p className="mt-3 text-sm leading-relaxed text-text-muted">
					Beyond direct support, the community shares build logs, sound tests, and troubleshooting tips
					that often resolve questions faster than a support ticket.
				</p>
				<ul className="mt-5 space-y-3 text-sm leading-relaxed text-text-muted">
					<li>
						<span className="font-medium text-text-primary">Community forum:</span> Search past threads
						for build guides, lube comparisons, and firmware tips shared by other enthusiasts.
					</li>
					<li>
						<span className="font-medium text-text-primary">Documentation hub:</span> This section you
						are reading now covers navigation, cart, and checkout workflows end to end.
					</li>
				</ul>
			</section>

			<section className="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
				<h2 className="text-2xl font-semibold text-text-primary">Post-Purchase Monitoring</h2>
				<p className="mt-3 text-sm leading-relaxed text-text-muted">
					After checkout, use the{' '}
					<Link to="/track-order" className="text-primary underline">
						order tracking
					</Link>{' '}
					page to monitor shipment status. The order confirmation email and tracking timeline both link
					back to support if a delivery issue arises.
				</p>
				<ul className="mt-5 space-y-3 text-sm leading-relaxed text-text-muted">
					<li>
						<span className="font-medium text-text-primary">Order confirmation:</span> Confirms items,
						totals, and estimated delivery immediately after checkout.
					</li>
					<li>
						<span className="font-medium text-text-primary">Tracking timeline:</span> Shows each fulfillment
						milestone from processing to delivery, refreshing periodically.
					</li>
				</ul>
			</section>
		</article>
	);
}
