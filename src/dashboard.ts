import { TARGET_APIS } from './config';

export function getDashboardHTML(): string {
    const tableHeaders = TARGET_APIS.map(api => `<th>${api.name}</th>`).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Echo | API Monitor</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #4f46e5;
            --primary-hover: #4338ca;
            --bg: #f8fafc;
            --card-bg: #ffffff;
            --text: #1e293b;
            --text-muted: #64748b;
            --success: #10b981;
            --error: #ef4444;
            --border: #e2e8f0;
            --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg);
            background-image: 
                radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.05) 0, transparent 50%), 
                radial-gradient(at 100% 100%, rgba(192, 132, 252, 0.05) 0, transparent 50%);
            color: var(--text);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 2rem;
            line-height: 1.5;
        }

        .container { max-width: 1000px; width: 100%; }

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2.5rem;
            background: var(--card-bg);
            padding: 1.25rem 2rem;
            border-radius: 1rem;
            box-shadow: var(--shadow);
            border: 1px solid var(--border);
        }

        h1 {
            font-size: 1.5rem;
            font-weight: 800;
            letter-spacing: -0.025em;
            color: var(--text);
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        h1::before {
            content: '';
            display: inline-block;
            width: 12px;
            height: 12px;
            background: var(--primary);
            border-radius: 3px;
        }

        .btn {
            background: var(--primary);
            color: white;
            border: none;
            padding: 0.625rem 1.25rem;
            border-radius: 0.5rem;
            font-weight: 600;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        }

        .btn:hover { transform: translateY(-1px); background: var(--primary-hover); box-shadow: var(--shadow); }
        .btn:active { transform: translateY(0); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2.5rem;
        }

        .card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 1rem;
            padding: 1.5rem;
            box-shadow: var(--shadow);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--primary); }

        .api-info { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
        .api-name { font-weight: 700; font-size: 1.125rem; color: var(--text); }

        .status-badge {
            padding: 0.25rem 0.625rem;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.025em;
        }

        .status-up { background: #dcfce7; color: #166534; }
        .status-down { background: #fee2e2; color: #991b1b; }

        .api-url { color: var(--text-muted); font-size: 0.875rem; word-break: break-all; margin-bottom: 1.25rem; font-family: monospace; background: #f1f5f9; padding: 0.5rem; border-radius: 6px; }

        .metrics { display: flex; gap: 2rem; font-size: 0.875rem; }
        .metric-item span { display: block; color: var(--text-muted); font-size: 0.75rem; font-weight: 500; margin-bottom: 0.25rem; }
        .metric-value { font-weight: 700; color: var(--text); font-size: 1rem; }

        .history-section {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 1rem;
            padding: 1.5rem 2rem;
            box-shadow: var(--shadow);
        }

        .history-title { font-size: 1.25rem; margin-bottom: 1.5rem; font-weight: 700; color: var(--text); }

        table { width: 100%; border-collapse: separate; border-spacing: 0; }
        th {
            text-align: left;
            color: var(--text-muted);
            font-weight: 600;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 1rem;
            border-bottom: 1px solid var(--border);
        }
        td { padding: 1rem; border-bottom: 1px solid var(--border); font-size: 0.875rem; color: var(--text); }
        tr:last-child td { border-bottom: none; }
        .timestamp { color: var(--text-muted); font-weight: 500; }

        @media (max-width: 640px) {
            body { padding: 1rem; }
            header { padding: 1rem; flex-direction: column; gap: 1rem; align-items: flex-start; }
            .btn { width: 100%; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Echo API Monitor</h1>
            <button id="triggerBtn" class="btn">Trigger Check</button>
        </header>

        <div id="latestGrid" class="grid"></div>

        <div class="history-section">
            <h2 class="history-title">Recent History</h2>
            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            ${tableHeaders}
                        </tr>
                    </thead>
                    <tbody id="historyBody"></tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
        async function fetchData() {
            try {
                const res = await fetch('/api/results');
                const history = await res.json();
                render(history);
            } catch (e) {
                console.error('Failed to fetch results', e);
            }
        }

        function render(history) {
            const latest = history[0];
            const grid = document.getElementById('latestGrid');
            const body = document.getElementById('historyBody');

            if (!latest) {
                grid.innerHTML = '<div class="card">No data yet. Trigger a check!</div>';
                return;
            }

            grid.innerHTML = latest.results.map(r => \`
                <div class="card">
                    <div class="api-info">
                        <div class="api-name">\${r.name}</div>
                        <span class="status-badge \${r.ok ? 'status-up' : 'status-down'}">\${r.ok ? 'Online' : 'Offline'}</span>
                    </div>
                    <div class="api-url">\${r.url}</div>
                    <div class="metrics">
                        <div class="metric-item">
                            <span>Status Code</span>
                            <div class="metric-value">\${r.status || 'Error'}</div>
                        </div>
                        <div class="metric-item">
                            <span>Response Time</span>
                            <div class="metric-value">\${r.responseTime}ms</div>
                        </div>
                    </div>
                </div>
            \`).join('');

            body.innerHTML = history.map(entry => \`
                <tr>
                    <td class="timestamp">\${new Date(entry.timestamp).toLocaleString()}</td>
                    \${entry.results.map(r => \`
                        <td>
                            <span style="color: \${r.ok ? 'var(--success)' : 'var(--error)'}">
                                \${r.ok ? '●' : '○'} \${r.responseTime}ms
                            </span>
                        </td>
                    \`).join('')}
                </tr>
            \`).join('');
        }

        document.getElementById('triggerBtn').addEventListener('click', async (e) => {
            const btn = e.target;
            btn.disabled = true;
            btn.innerText = 'Checking...';
            try {
                await fetch('/api/trigger', { method: 'POST' });
                await fetchData();
            } finally {
                btn.disabled = false;
                btn.innerText = 'Trigger Check';
            }
        });

        fetchData();
        setInterval(fetchData, 60000);
    </script>
</body>
</html>
	`;
}
