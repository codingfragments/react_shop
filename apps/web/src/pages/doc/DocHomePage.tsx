import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function DocHomePage() {
	useEffect(() => {
		document.title = 'Mission & Overview | Next Century Keyboards Docs';
	}, []);

	return (
		<article className="space-y-12">
			<header className="rounded-3xl border border-overlay0 bg-bg-elevated/80 px-8 py-12 shadow-xl shadow-black/10 backdrop-blur">
				<p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
					Next Century Keyboards
				</p>
				<h1 className="mt-4 text-4xl font-semibold text-text-primary">Mission &amp; Product Promise</h1>
				<p className="mt-6 max-w-3xl text-lg leading-relaxed text-text-muted">
					Next Century Keyboards is built for creators, competitive gamers, and professionals who view
					mechanical keyboards as mission-critical tools. Our mission is to remove the friction between
					curiosity and craftsmanship. We curate components that balance performance with personality,
					then back them with discovery workflows, transparent pricing, and guidance from the community
					that inspired the catalog. If you are deciding between your first hot-swap board or optimizing
					a daily driver with bespoke stabilizers, this shop is designed to meet you where you are.
				</p>
				<figure className="mt-10 overflow-hidden rounded-3xl border border-dashed border-overlay1 bg-bg-tertiary/40 p-4">
					<img
						src="/images/docs/home-overview-hero.png"
						alt="Placeholder for the home page hero and featured drops"
						width="1280"
						height="720"
						className="h-auto w-full rounded-2xl"
					/>
					<figcaption className="mt-3 text-center text-xs tracking-wide text-text-muted uppercase">
						Replace with a 1280×720 screenshot of the landing hero highlighting featured drops and
						mission copy.
					</figcaption>
				</figure>
			</header>

			<section className="grid gap-6 lg:grid-cols-2">
				<div className="rounded-3xl border border-overlay0 bg-bg-tertiary/70 p-8">
					<h2 className="text-2xl font-semibold text-text-primary">Who We Serve</h2>
					<ul className="mt-4 space-y-4 text-sm leading-relaxed text-text-muted">
						<li>
							<span className="font-medium text-text-primary">Design-forward professionals:</span> Seek
							ergonomic layouts that stay elegant on camera during client calls while retaining
							programmable macros for Figma, Notion, and IDE workflows.
						</li>
						<li>
							<span className="font-medium text-text-primary">Esports and speed typists:</span> Want
							consistent actuation, latency transparency, and switch characterizations that match their
							preferred games and keypress cadence.
						</li>
						<li>
							<span className="font-medium text-text-primary">Keyboard artisans and hobbyists:</span>{' '}
							Value limited-run group buys, artisan collabs, and the ability to validate compatibility
							between plates, PCB revisions, and keycap profiles before checking out.
						</li>
					</ul>
				</div>

				<div className="rounded-3xl border border-overlay0 bg-bg-tertiary/70 p-8">
					<h2 className="text-2xl font-semibold text-text-primary">Experience Guarantees</h2>
					<ul className="mt-4 space-y-4 text-sm leading-relaxed text-text-muted">
						<li>
							<span className="font-medium text-text-primary">Clarity at every step:</span> Specs,
							compatibility flags, and inventory signals surface in context so you never wonder whether
							a switch works with a plate or if a kit includes stabilizers.
						</li>
						<li>
							<span className="font-medium text-text-primary">Adaptive discovery:</span> Search,
							category hubs, recommendations, and FAQ callouts collaborate to suggest next steps based
							on everything you have browsed.
						</li>
						<li>
							<span className="font-medium text-text-primary">Actionable support:</span> From the
							chatbot to live order tracking, we surface answers before you have to ask, and we document
							every bailout path if something goes wrong.
						</li>
					</ul>
				</div>
			</section>

			<section className="rounded-3xl border border-overlay0 bg-bg-elevated/80 px-8 py-12 shadow-xl shadow-black/10 backdrop-blur">
				<h2 className="text-3xl font-semibold text-text-primary">Documentation Roadmap</h2>
				<p className="mt-4 max-w-3xl leading-relaxed text-base text-text-muted">
					Use this quickstart map to jump into the guidance that matches your current task. Each section
					leans on real app workflows so you can mirror the steps in your own browser session.
				</p>

				<div className="mt-10 grid gap-6 md:grid-cols-2">
					<Link
						to="/doc/navigation"
						className="group rounded-3xl border border-overlay0 bg-bg-tertiary/60 p-6 transition-colors hover:border-primary hover:bg-primary/5"
					>
						<p className="text-xs font-semibold tracking-wide text-primary uppercase">Product Discovery</p>
						<h3 className="mt-3 text-xl font-semibold text-text-primary">Navigation Playbook</h3>
						<p className="mt-3 text-sm leading-relaxed text-text-muted">
							Master global search, category paths, FAQ-driven discovery, and contextual recommendations
							so you always know the fastest route to the right component.
						</p>
						<span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
							Read guide
							<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
							</svg>
						</span>
					</Link>

					<Link
						to="/doc/cart"
						className="group rounded-3xl border border-overlay0 bg-bg-tertiary/60 p-6 transition-colors hover:border-primary hover:bg-primary/5"
					>
						<p className="text-xs font-semibold tracking-wide text-primary uppercase">Cart Stewardship</p>
						<h3 className="mt-3 text-xl font-semibold text-text-primary">Cart Operations</h3>
						<p className="mt-3 text-sm leading-relaxed text-text-muted">
							Dive into real-time subtotals, bundle logic, low-stock alerts, and save-for-later
							workflows to keep every build organized before you buy.
						</p>
						<span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
							Read guide
							<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
							</svg>
						</span>
					</Link>

					<Link
						to="/doc/checkout"
						className="group rounded-3xl border border-overlay0 bg-bg-tertiary/60 p-6 transition-colors hover:border-primary hover:bg-primary/5"
					>
						<p className="text-xs font-semibold tracking-wide text-primary uppercase">Purchase Flow</p>
						<h3 className="mt-3 text-xl font-semibold text-text-primary">Checkout Guide</h3>
						<p className="mt-3 text-sm leading-relaxed text-text-muted">
							Follow the step-by-step checkout journey, understand every validation, and learn how to
							handle payment timeouts, address mismatches, and shipment tracking.
						</p>
						<span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
							Read guide
							<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
							</svg>
						</span>
					</Link>

					<Link
						to="/doc/support"
						className="group rounded-3xl border border-overlay0 bg-bg-tertiary/60 p-6 transition-colors hover:border-primary hover:bg-primary/5"
					>
						<p className="text-xs font-semibold tracking-wide text-primary uppercase">
							Post-purchase Confidence
						</p>
						<h3 className="mt-3 text-xl font-semibold text-text-primary">Help Channels</h3>
						<p className="mt-3 text-sm leading-relaxed text-text-muted">
							Learn how the chatbot, FAQs, email, and community spaces combine to answer build
							questions, surface recommendations, and keep you informed after checkout.
						</p>
						<span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
							Read guide
							<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
							</svg>
						</span>
					</Link>
				</div>
			</section>

			<section className="rounded-3xl border border-dashed border-overlay1 bg-bg-tertiary/40 px-8 py-10">
				<h2 className="text-2xl font-semibold text-text-primary">How to Use This Documentation</h2>
				<ol className="mt-4 space-y-4 text-sm leading-relaxed text-text-muted">
					<li>
						Pair a guide with your current goal. The navigation sidebar mirrors the sections you see
						here, and every page links outward to the relevant routes in the app.
					</li>
					<li>
						Keep the shop open in another tab. Each walkthrough references interface labels and buttons
						verbatim so you can click along without second guessing.
					</li>
					<li>
						Loop in the chatbot when you need tailored suggestions. The bot can surface product picks
						while you read, saving you from toggling between guides and catalogs.
					</li>
				</ol>
			</section>
		</article>
	);
}
