export interface MonitorResult {
	name: string;
	url: string;
	status: number;
	ok: boolean;
	responseTime: number;
}

export interface HistoryEntry {
	timestamp: string;
	results: MonitorResult[];
}
