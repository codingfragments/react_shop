import { Link, Outlet, useLocation } from 'react-router-dom';

const navGroups = [
	{
		label: 'Foundation',
		items: [{ name: 'Mission & Overview', href: '/doc' }]
	},
	{
		label: 'Product Discovery',
		items: [{ name: 'Navigation Playbook', href: '/doc/navigation' }]
	},
	{
		label: 'Cart & Checkout',
		items: [
			{ name: 'Cart Operations', href: '/doc/cart' },
			{ name: 'Checkout Guide', href: '/doc/checkout' }
		]
	},
	{
		label: 'Support & Follow-up',
		items: [{ name: 'Help Channels', href: '/doc/support' }]
	}
];

export default function DocLayout() {
	const location = useLocation();

	return (
		<section className="bg-bg-primary text-text-primary">
			<div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:flex-row lg:gap-12">
				<aside className="sticky top-24 z-10 flex shrink-0 flex-col gap-6 rounded-2xl border border-overlay0 bg-bg-elevated/90 p-6 shadow-lg shadow-black/10 backdrop-blur lg:w-72">
					<h2 className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
						Help &amp; Documentation
					</h2>
					<nav className="space-y-6 text-sm">
						{navGroups.map((group) => (
							<div key={group.label} className="space-y-3">
								<p className="text-xs font-semibold tracking-wide text-text-muted uppercase">
									{group.label}
								</p>
								<ul className="space-y-2">
									{group.items.map((item) => (
										<li key={item.href}>
											{location.pathname === item.href ? (
												<span className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
													<span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
													{item.name}
												</span>
											) : (
												<Link
													to={item.href}
													className="flex items-center gap-2 rounded-lg px-3 py-2 text-text-muted transition-colors hover:bg-primary/10 hover:text-primary"
												>
													<span className="h-1.5 w-1.5 rounded-full bg-overlay1/60"></span>
													{item.name}
												</Link>
											)}
										</li>
									))}
								</ul>
							</div>
						))}
					</nav>
				</aside>

				<div className="flex-1">
					<Outlet />
				</div>
			</div>
		</section>
	);
}
