import { HistoryEntry, MonitorResult } from './types';
import { TARGET_APIS, HISTORY_KEY, MAX_HISTORY_ENTRIES } from './config';

export async function performChecks(env: Env): Promise<HistoryEntry> {
	const results: MonitorResult[] = await Promise.all(
		TARGET_APIS.map(async (api) => {
			const start = Date.now();
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 5000);

			try {
				const resp = await fetch(api.url, {
					method: 'HEAD',
					signal: controller.signal,
				});
				clearTimeout(timeoutId);

				return {
					name: api.name,
					url: api.url,
					status: resp.status,
					ok: resp.ok,
					responseTime: Date.now() - start,
				};
			} catch (err: any) {
				clearTimeout(timeoutId);
				return {
					name: api.name,
					url: api.url,
					status: 0,
					ok: false,
					responseTime: Date.now() - start,
					error: err.message || String(err),
				};
			}
		})
	);

	const entry: HistoryEntry = {
		timestamp: new Date().toISOString(),
		results,
	};

	// Save to KV
	const historyRaw = await env.API_MONITOR_KV.get(HISTORY_KEY);
	let history: HistoryEntry[] = historyRaw ? JSON.parse(historyRaw) : [];
	history.unshift(entry);
	history = history.slice(0, MAX_HISTORY_ENTRIES);
	await env.API_MONITOR_KV.put(HISTORY_KEY, JSON.stringify(history));
	return entry;
}

export async function getHistory(env: Env): Promise<HistoryEntry[]> {
	const historyRaw = await env.API_MONITOR_KV.get(HISTORY_KEY);
	return historyRaw ? JSON.parse(historyRaw) : [];
}
