import { Hono } from 'hono';
import { performChecks, getHistory } from './monitor';
import { getDashboardHTML } from './dashboard';

const app = new Hono<{ Bindings: Env }>();

// UI: Dashboard
app.get('/', (c) => {
	return c.html(getDashboardHTML());
});

// API: Get history
app.get('/api/results', async (c) => {
	const history = await getHistory(c.env);
	return c.json(history);
});

// API: Manual trigger
app.post('/api/trigger', async (c) => {
	const entry = await performChecks(c.env);
	return c.json(entry);
});

export default {
	fetch: app.fetch,

	async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
		ctx.waitUntil(performChecks(env));
	},
} satisfies ExportedHandler<Env>;
