export interface MonitorResult {
	name: string;
	url: string;
	status: number;
	ok: boolean;
	responseTime: number;
	error?: string;
}

export interface HistoryEntry {
	timestamp: string;
	results: MonitorResult[];
}
