import { useCallback, useEffect, useState } from 'react';

const CATEGORY_ICONS: Record<string, string> = {
	wisdom: '🧠',
	affirmation: '✨',
	humor: '😄',
	tip: '💡'
};

export default function MessageOfTheDay() {
	const [message, setMessage] = useState('');
	const [category, setCategory] = useState('');
	const [timestamp, setTimestamp] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const fetchMotd = useCallback(async () => {
		setLoading(true);
		setError(false);
		try {
			const res = await fetch('/api/motd');
			const data = await res.json();
			setMessage(data.message);
			setCategory(data.category);
			setTimestamp(
				new Date(data.timestamp).toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit'
				})
			);
		} catch {
			setError(true);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchMotd();
	}, [fetchMotd]);

	return (
		<div className="mx-auto max-w-3xl rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 px-8 py-6 shadow-sm">
			<div className="mb-3 flex items-center justify-between">
				<span className="text-xs font-semibold uppercase tracking-widest text-primary">
					Message of the Day
				</span>
				{timestamp && !loading && (
					<span className="text-xs text-text-muted">{timestamp}</span>
				)}
			</div>

			{loading ? (
				<div className="animate-pulse space-y-2">
					<div className="h-5 w-3/4 rounded bg-overlay0"></div>
					<div className="h-5 w-1/2 rounded bg-overlay0"></div>
				</div>
			) : error ? (
				<p className="text-sm text-text-muted italic">Could not load today's message.</p>
			) : (
				<div className="flex items-start gap-3">
					<span className="mt-0.5 text-2xl leading-none">{CATEGORY_ICONS[category] ?? '⌨️'}</span>
					<p className="text-base leading-relaxed text-text-primary italic">"{message}"</p>
				</div>
			)}

			<div className="mt-4 flex justify-end">
				<button
					onClick={fetchMotd}
					className="text-xs text-text-muted transition-colors hover:text-primary disabled:opacity-50"
					disabled={loading}
					aria-label="Refresh message"
				>
					↻ another one
				</button>
			</div>
		</div>
	);
}
