// -----------------------------
// Element State Helpers
// -----------------------------
class ElementState {
    static _tableConfigs = {};

    static defaultTableConfig() {
        return {
            cloneState: false,
            controls: {
                search: { render: true },
                editToggle: { render: true },
                import: { render: false },
                addRow: { render: false },
                addCol: { render: false }
            }
        };
    }

    static _isPlainObject(value) {
        return value && typeof value === 'object' && !Array.isArray(value);
    }

    static _clone(value) {
        if (Array.isArray(value)) {
            return value.map(v => ElementState._clone(v));
        }
        if (ElementState._isPlainObject(value)) {
            const out = {};
            Object.entries(value).forEach(([key, val]) => {
                out[key] = ElementState._clone(val);
            });
            return out;
        }
        return value;
    }

    static _mergeObjects(base = {}, extra = {}) {
        const target = ElementState._isPlainObject(base) ? ElementState._clone(base) : {};
        Object.entries(extra || {}).forEach(([key, val]) => {
            if (ElementState._isPlainObject(val)) {
                const baseSection = ElementState._isPlainObject(target[key]) ? target[key] : {};
                target[key] = ElementState._mergeObjects(baseSection, val);
            } else if (Array.isArray(val)) {
                target[key] = val.map(item => ElementState._clone(item));
            } else {
                target[key] = val;
            }
        });
        return target;
    }

    static createConfig(overrides = {}) {
        return ElementState._mergeObjects(ElementState.defaultTableConfig(), overrides);
    }

    static _cloneConfig(config) {
        if (!config) return ElementState.defaultTableConfig();
        return ElementState._mergeObjects({}, config);
    }

    static setTableConfig(id, config) {
        if (!id) return;
        ElementState._tableConfigs[id] = ElementState._mergeObjects({}, config || ElementState.defaultTableConfig());
    }

    static getTableConfig(id) {
        if (!id) return ElementState.defaultTableConfig();
        const cfg = ElementState._tableConfigs[id];
        return cfg ? ElementState._cloneConfig(cfg) : ElementState.defaultTableConfig();
    }

    static createState({ id, title, searchPlaceholder, columns, editEnabled = false, bulkUploadEnabled = false, config }) {
        const firstColumnId = columns[0]?.id || null;
        const normalizedConfig = ElementState.createConfig(config || {});
        const tableState = {
            meta: {
                id,
                title,
                theme: document.documentElement.getAttribute('data-theme') || 'dark',
                editEnabled,
                bulkUpload: { enabled: bulkUploadEnabled },
                sorting: { enabled: true },
                search: { enabled: true, placeholder: searchPlaceholder || 'Search...' }
            },
            columns: columns.map(col => ({
                id: col.id,
                name: col.name,
                type: col.type || 'text',
                required: col.required || false,
                unique: col.unique || false,
                sortable: col.sortable !== false,
                searchable: col.searchable !== false,
                editable: col.editable !== undefined ? col.editable : editEnabled,
                align: col.align || (col.type === 'number' ? 'end' : 'start'),
                allowHtml: !!col.allowHtml,
                format: typeof col.format === 'function' ? col.format : null
            })),
            data: { rows: [] },
            ui: {
                editMode: false,
                sort: { columnId: firstColumnId, direction: 'asc' },
                filter: { searchQuery: '' }
            },
            __tableConfig: normalizedConfig
        };
        ElementState.setTableConfig(id, normalizedConfig);
        return tableState;
    }

    static _formatPrice(value) {
        if (value === null || value === undefined || value === '') return '-';
        const num = Number(value);
        return Number.isFinite(num) ? num.toFixed(2) : '-';
    }

    static _formatVolume(value) {
        if (value === null || value === undefined) return '-';
        const num = Number(value);
        if (!Number.isFinite(num)) return '-';
        return num.toLocaleString('en-US');
    }

    static _formatDirection(value) {
        const val = (value || '').toString();
        const isBullish = val.toLowerCase() === 'bullish';
        const color = isBullish ? 'text-success' : 'text-danger';
        return `<span class="${color} fw-bold">${val.toUpperCase() || '-'}</span>`;
    }

    static _formatSide(value) {
        const val = (value || '').toString();
        const isLong = val.toLowerCase() === 'long';
        const color = isLong ? 'text-success' : 'text-danger';
        return `<span class="${color} fw-bold">${val.toUpperCase() || '-'}</span>`;
    }

    static _formatMonitorStatus(value) {
        const val = (value || '').toString() || '-';
        const isActive = val.toLowerCase() === 'active';
        const color = isActive ? 'success' : 'warning';
        return `<span class="badge bg-${color} bg-opacity-10 text-${color}">${val.toUpperCase()}</span>`;
    }

    static _formatLogStatus(value) {
        const val = (value || '').toString() || '-';
        const isSuccess = val.toLowerCase() === 'success';
        const color = isSuccess ? 'success' : 'danger';
        return `<span class="badge bg-${color} bg-opacity-10 text-${color}">${val.toUpperCase()}</span>`;
    }

    static _formatSignedPl(value) {
        if (value === null || value === undefined || value === '') return '-';
        const num = Number(value);
        if (!Number.isFinite(num)) return '-';
        const color = num >= 0 ? 'text-success' : 'text-danger';
        const sign = num >= 0 ? '+' : '';
        return `<span class="${color} fw-bold font-mono">${sign}${num.toFixed(2)}</span>`;
    }

    static _formatTransactionPl(value) {
        if (value === null || value === undefined || value === '') {
            return '<span class="text-secondary font-mono">-</span>';
        }
        const num = Number(value);
        if (!Number.isFinite(num)) return '<span class="text-secondary font-mono">-</span>';
        const color = num >= 0 ? 'text-success' : 'text-danger';
        const sign = num >= 0 ? '+' : '';
        return `<span class="${color} font-mono">${sign}${num.toFixed(2)}</span>`;
    }

    static _formatOrderType(value) {
        const val = (value || '').toString();
        const color = val.toLowerCase() === 'buy' ? 'text-success' : 'text-danger';
        return `<span class="${color}">${val.toUpperCase() || '-'}</span>`;
    }

    static _formatStockStatus(value) {
        const val = (value || '').toString() || '-';
        const isActive = val.toLowerCase() === 'active';
        const color = isActive ? 'success' : 'secondary';
        return `<span class="badge bg-${color} bg-opacity-10 text-${color}">${val.toUpperCase()}</span>`;
    }

    static stocksWatchlistTable = ElementState.createState({
        id: 'stocksWatchlist',
        title: 'Watchlist',
        searchPlaceholder: 'Search tickers...',
        editEnabled: true,
        bulkUploadEnabled: true,
        columns: [
            { id: 'code', name: 'Ticker', required: true, unique: true },
            { id: 'name', name: 'Name' },
            { id: 'exchange', name: 'Exchange' },
            { id: 'sector', name: 'Sector' },
            { id: 'type', name: 'Type' },
            { id: 'status', name: 'Status', allowHtml: true, format: ElementState._formatStockStatus }
        ],
        config: ElementState.createConfig({
            controls: {
                editToggle: { render: true },
                import: { render: true },
                addRow: { render: true },
                addCol: { render: true }
            }
        })
    });

    static ohlcvTable = ElementState.createState({
        id: 'ohlcvTable',
        title: 'OHLCV Data',
        searchPlaceholder: 'Search OHLCV...',
        columns: [
            { id: 'CandleTime', name: 'Time' },
            { id: 'Open', name: 'Open', type: 'number', align: 'end', format: ElementState._formatPrice },
            { id: 'High', name: 'High', type: 'number', align: 'end', format: ElementState._formatPrice },
            { id: 'Low', name: 'Low', type: 'number', align: 'end', format: ElementState._formatPrice },
            { id: 'Close', name: 'Close', type: 'number', align: 'end', format: ElementState._formatPrice },
            { id: 'Volume', name: 'Vol', type: 'number', align: 'end', format: ElementState._formatVolume }
        ],
        config: ElementState.createConfig()
    });

    static monitorTable = ElementState.createState({
        id: 'monitorTable',
        title: 'Scanner Signals',
        searchPlaceholder: 'Search signals...',
        columns: [
            { id: 'Ticker', name: 'Ticker' },
            { id: 'SignalType', name: 'Pattern' },
            { id: 'Direction', name: 'Side', allowHtml: true, format: ElementState._formatDirection },
            { id: 'GapLow', name: 'Zone Low', type: 'number', align: 'end', format: ElementState._formatPrice },
            { id: 'GapHigh', name: 'Zone High', type: 'number', align: 'end', format: ElementState._formatPrice },
            { id: 'SignalStartTime', name: 'Start Time' },
            { id: 'Status', name: 'State', allowHtml: true, format: ElementState._formatMonitorStatus }
        ],
        config: ElementState.createConfig()
    });

    static portfolioOpenTable = ElementState.createState({
        id: 'portfolioOpenTable',
        title: 'Open Positions',
        searchPlaceholder: 'Filter open positions...',
        columns: [
            { id: 'Ticker', name: 'Ticker' },
            { id: 'Side', name: 'Side', allowHtml: true, format: ElementState._formatSide },
            { id: 'EntryPrice', name: 'Entry', type: 'number', align: 'end', format: ElementState._formatPrice },
            { id: 'TargetPrice', name: 'Target', type: 'number', align: 'end', format: ElementState._formatPrice },
            { id: 'StopLossPrice', name: 'Stop', type: 'number', align: 'end', format: ElementState._formatPrice },
            { id: 'Quantity', name: 'Size', type: 'number', align: 'end' },
            { id: 'OpenDatetime', name: 'Time' }
        ],
        config: ElementState.createConfig()
    });

    static portfolioClosedTable = ElementState.createState({
        id: 'portfolioClosedTable',
        title: 'Closed Positions',
        searchPlaceholder: 'Filter closed positions...',
        columns: [
            { id: 'Ticker', name: 'Ticker' },
            { id: 'Side', name: 'Side', allowHtml: true, format: ElementState._formatSide },
            { id: 'EntryPrice', name: 'Entry', type: 'number', align: 'end', format: ElementState._formatPrice },
            { id: 'RealizedPL', name: 'Realized P&L', type: 'number', align: 'end', allowHtml: true, format: ElementState._formatSignedPl },
            { id: 'CloseDatetime', name: 'Closed At' }
        ],
        config: ElementState.createConfig()
    });

    static transactionsTable = ElementState.createState({
        id: 'transactionsTable',
        title: 'Order History',
        searchPlaceholder: 'Search orders...',
        columns: [
            { id: 'Datetime', name: 'Time' },
            { id: 'Ticker', name: 'Ticker' },
            { id: 'Type', name: 'Type', allowHtml: true, format: ElementState._formatOrderType },
            { id: 'Quantity', name: 'Qty', type: 'number', align: 'end' },
            { id: 'Price', name: 'Fill Price', type: 'number', align: 'end', format: ElementState._formatPrice },
            { id: 'RealizedPL', name: 'P&L', type: 'number', align: 'end', allowHtml: true, format: ElementState._formatTransactionPl }
        ],
        config: ElementState.createConfig()
    });

    static logsTable = ElementState.createState({
        id: 'logsTable',
        title: 'System Logs',
        searchPlaceholder: 'Search logs...',
        columns: [
            { id: 'StartedAt', name: 'Start' },
            { id: 'EndedAt', name: 'End' },
            { id: 'JobType', name: 'Job Name' },
            { id: 'Status', name: 'Status', allowHtml: true, format: ElementState._formatLogStatus },
            { id: 'Message', name: 'Output' }
        ]
    });

    static getState(key) {
        return ElementState[key] || null;
    }
}

// -----------------------------
// Stocks table helpers
// -----------------------------

function getStockWatchlistData() {
    return MockData.getStocks().map(s => ({
        code: s.Ticker,
        name: s.Name,
        exchange: s.Exchange,
        sector: s.Sector || "",
        type: s.Type || "",
        status: s.IsActive ? "Active" : "Inactive"
    }));
}

function renderStockWatchlist() {
    const loader = document.getElementById('loader-stocks');
    const emptyState = document.getElementById('stocksEmptyState');

    loader?.classList.add('active');
    if (loader) loader.style.display = 'flex';
    if (emptyState) emptyState.style.display = 'none';

    // Simulate async fetch for consistency with rest of UI
    setTimeout(() => {
        const data = getStockWatchlistData();
        if (!data.length) {
            if (emptyState) emptyState.style.display = 'block';
        } else {
            if (emptyState) emptyState.style.display = 'none';
        }
        UIRender.table('stocksWatchlistTable', '#stocksTableMount', data);
        if (loader) loader.style.display = 'none';
    }, 300);
}


// -----------------------------
// Mock Data
// -----------------------------
class MockData {
    static getDashboard() {
        return {
            plToday: 12500.50,
            plTodayPct: 2.8,
            openPl: 8500.75,
            activeMonitors: 7,
            tradesToday: 12,
            equityCurve: [
                { label: 'Mon', value: 100000 },
                { label: 'Tue', value: 101500 },
                { label: 'Wed', value: 100800 },
                { label: 'Thu', value: 103200 },
                { label: 'Fri', value: 102500 }
            ]
        };
    }

    static getStocks() {
        return [
            { ID: '1', Ticker: 'RELIANCE', Name: 'Reliance Industries', Exchange: 'NSE', IsActive: true },
            { ID: '2', Ticker: 'TCS', Name: 'Tata Consultancy', Exchange: 'NSE', IsActive: true },
            { ID: '3', Ticker: 'INFY', Name: 'Infosys Ltd', Exchange: 'NSE', IsActive: true },
            { ID: '4', Ticker: 'HDFCBANK', Name: 'HDFC Bank', Exchange: 'NSE', IsActive: false }
        ];
    }

    static getOhlcv() {
        return [
            { Ticker: 'RELIANCE', Timeframe: '5m', CandleTime: '2025-01-01 09:20', Open: 2450, High: 2456, Low: 2447, Close: 2454, Volume: 120000 },
            { Ticker: 'RELIANCE', Timeframe: '5m', CandleTime: '2025-01-01 09:25', Open: 2454, High: 2459, Low: 2450, Close: 2457, Volume: 95000 },
            { Ticker: 'RELIANCE', Timeframe: '5m', CandleTime: '2025-01-01 09:30', Open: 2457, High: 2462, Low: 2455, Close: 2460, Volume: 84000 }
        ];
    }

    static getMonitor() {
        return [
            { ID: 'M1', Ticker: 'RELIANCE', SignalType: 'FVG', Direction: 'Bullish', GapLow: 2445, GapHigh: 2455, SignalStartTime: '2025-01-01 09:20', SignalEndTime: '2025-01-01 09:35', Status: 'Active' },
            { ID: 'M2', Ticker: 'TCS', SignalType: 'FVG', Direction: 'Bearish', GapLow: 3700, GapHigh: 3710, SignalStartTime: '2025-01-01 10:10', SignalEndTime: '2025-01-01 10:25', Status: 'Triggered' }
        ];
    }

    static getPortfolio() {
        return {
            open: [
                { ID: 'P1', Ticker: 'RELIANCE', Side: 'Long', EntryPrice: 2450, Quantity: 50, TargetPrice: 2480, StopLossPrice: 2430, OpenDatetime: '2025-01-01 09:25', Status: 'Open' },
                { ID: 'P2', Ticker: 'TCS', Side: 'Short', EntryPrice: 3720, Quantity: 30, TargetPrice: 3680, StopLossPrice: 3745, OpenDatetime: '2025-01-01 10:15', Status: 'Open' }
            ],
            closed: [
                { ID: 'P0', Ticker: 'INFY', Side: 'Long', EntryPrice: 1450, Quantity: 40, TargetPrice: 1475, StopLossPrice: 1435, OpenDatetime: '2024-12-31 10:00', Status: 'Closed', CloseDatetime: '2024-12-31 11:00', RealizedPL: 1000 }
            ]
        };
    }

    static getTransactions() {
        return [
            { ID: 'T1', PortfolioId: 'P1', Datetime: '2025-01-01 09:25', Ticker: 'RELIANCE', Type: 'Buy', Quantity: 50, Price: 2450, TargetPrice: 2480, StopLossPrice: 2430, RealizedPL: '' },
            { ID: 'T2', PortfolioId: 'P2', Datetime: '2025-01-01 10:15', Ticker: 'TCS', Type: 'Sell', Quantity: 30, Price: 3720, TargetPrice: 3680, StopLossPrice: 3745, RealizedPL: '' },
            { ID: 'T0', PortfolioId: 'P0', Datetime: '2024-12-31 11:00', Ticker: 'INFY', Type: 'Sell', Quantity: 40, Price: 1475, TargetPrice: 1475, StopLossPrice: 1435, RealizedPL: 1000 }
        ];
    }

    static getLogs() {
        return [
            { ID: 'L1', JobType: 'OhlcvBatch', StartedAt: '2025-01-01 09:15:00', EndedAt: '2025-01-01 09:15:05', Status: 'Success', Message: 'Fetched OHLCV for 4 tickers.' },
            { ID: 'L2', JobType: 'MonitorCheck', StartedAt: '2025-01-01 09:16:00', EndedAt: '2025-01-01 09:16:02', Status: 'Success', Message: 'Evaluated 2 monitor entries.' },
            { ID: 'L3', JobType: 'MonitorCheck', StartedAt: '2025-01-01 09:17:00', EndedAt: '2025-01-01 09:17:02', Status: 'Fail', Message: 'Price API timeout (mock).' }
        ];
    }
}

// -----------------------------
// Mock "API"
// -----------------------------
class ApiMock {
    static delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    static async getDashboard() { await this.delay(500); return MockData.getDashboard(); }
    // Stocks tab pulls data directly via getStockWatchlistData
    static async getOhlcv() { await this.delay(500); return MockData.getOhlcv(); }
    static async getMonitor() { await this.delay(500); return MockData.getMonitor(); }
    static async getPortfolio() { await this.delay(500); return MockData.getPortfolio(); }
    static async getTransactions() { await this.delay(500); return MockData.getTransactions(); }
    static async getLogs() { await this.delay(500); return MockData.getLogs(); }
}

// -----------------------------
// UI Rendering Helpers
// -----------------------------
class UIRender {
    static tableInstances = new Map();

    static table(stateKey, selector, data, configOverride = null) {
        const container = document.querySelector(selector);
        if (!container) return;
        const state = ElementState.getState(stateKey);
        if (!state) return;

        state.meta.theme = document.documentElement.getAttribute('data-theme') || 'dark';
        state.data.rows = UIRender._buildRows(state, data);
        const tableConfig = configOverride
            ? ElementState.createConfig(configOverride)
            : (state.__tableConfig ? ElementState.createConfig(state.__tableConfig) : ElementState.getTableConfig(state.meta.id));

        let instance = UIRender.tableInstances.get(stateKey);
        if (!instance) {
            instance = JSTable.create(container, state, tableConfig);
            UIRender.tableInstances.set(stateKey, instance);
        } else {
            instance.renderAll();
        }
    }

    static _buildRows(state, data) {
        if (!Array.isArray(data) || !state?.columns) return [];
        return data.map(item => state.columns.map(col => {
            const cellValue = item?.[col.id];
            if (col.type === 'number') {
                if (cellValue === null || cellValue === undefined || cellValue === '') return null;
                const num = Number(cellValue);
                return Number.isFinite(num) ? num : null;
            }
            return cellValue ?? null;
        }));
    }

    static setText(selector, text) {
        const el = document.querySelector(selector);
        if (el) el.textContent = text;
    }
    static showLoader(selector) { document.querySelector(selector)?.classList.add('active'); }
    static hideLoader(selector) { document.querySelector(selector)?.classList.remove('active'); }
    static hideGlobalLoader() { document.getElementById('global-loader')?.classList.add('hidden'); }
    static populateSelect(selector, options) {
        const el = document.querySelector(selector);
        if (!el) return;
        el.innerHTML = '';
        options.forEach(opt => {
            const o = document.createElement('option');
            o.value = opt.value; o.textContent = opt.label; el.appendChild(o);
        });
    }
}

// -----------------------------
// App Controller
// -----------------------------
class App {
    static init() {
        this.bindSidebarNav();
        this.bindSidebarToggle();
        this.bindThemeSwitcher();
        this.loadInitialTab();
    }

    static bindSidebarNav() {
        const links = document.querySelectorAll('.td-nav-link[data-tab]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = link.getAttribute('data-tab');
                App.showTab(tab);
                if (window.innerWidth < 992) App.closeSidebar();
            });
        });
    }

    static bindSidebarToggle() {
        const btn = document.getElementById('sidebarToggleBtn');
        const backdrop = document.getElementById('sidebarBackdrop');
        if (btn) {
            const toggleMenu = () => {
                document.getElementById('sidebar').classList.toggle('open');
                backdrop.classList.toggle('show');
            };
            btn.addEventListener('click', toggleMenu);
            if (backdrop) backdrop.addEventListener('click', toggleMenu);
        }
        const desktopToggle = document.getElementById('sidebarDesktopToggle');
        if (desktopToggle) {
            desktopToggle.addEventListener('click', () => {
                document.getElementById('sidebar').classList.toggle('collapsed');
            });
        }
    }

    static bindThemeSwitcher() {
        const selector = document.getElementById('themeSelect');
        if (!selector) return;
        selector.addEventListener('change', (e) => {
            const theme = e.target.value;
            document.documentElement.setAttribute('data-theme', theme);
            const bsTheme = theme === 'light' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-bs-theme', bsTheme);
        });
    }

    static closeSidebar() {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebarBackdrop').classList.remove('show');
    }

    static loadInitialTab() {
        this.showTab('dashboard');
        setTimeout(() => UIRender.hideGlobalLoader(), 700);
    }

    static async showTab(tabId) {
        document.querySelectorAll('.td-nav-link[data-tab]').forEach(link => link.classList.toggle('active', link.getAttribute('data-tab') === tabId));
        document.querySelectorAll('.tab-view').forEach(view => view.classList.toggle('active', view.id === 'tab-' + tabId));

        switch (tabId) {
            case 'dashboard': await this.loadDashboard(); break;
            case 'stocks': await this.loadStocks(); break;
            case 'ohlcv': await this.loadOhlcv(); break;
            case 'monitor': await this.loadMonitor(); break;
            case 'portfolio': await this.loadPortfolio(); break;
            case 'transactions': await this.loadTransactions(); break;
            case 'logs': await this.loadLogs(); break;
        }
    }

    static async loadDashboard() {
        UIRender.showLoader('#loader-dashboard-equity');
        const data = await ApiMock.getDashboard();

        UIRender.setText('#metricPlToday', (data.plToday >= 0 ? '+' : '') + data.plToday.toFixed(2));
        UIRender.setText('#metricPlTodayPct', (data.plTodayPct >= 0 ? '+' : '') + data.plTodayPct.toFixed(1) + '%');
        UIRender.setText('#metricOpenPl', (data.openPl >= 0 ? '+' : '') + data.openPl.toFixed(2));
        UIRender.setText('#metricActiveMonitors', String(data.activeMonitors));
        UIRender.setText('#metricTradesToday', String(data.tradesToday));

        const plEl = document.getElementById('metricPlToday');
        if (plEl) {
            plEl.style.color = data.plToday >= 0 ? 'var(--td-success)' : 'var(--td-danger)';
        }

        UIRender.hideLoader('#loader-dashboard-equity');
        document.getElementById('dashboard-equity-placeholder').style.display = 'block';
    }

    static async loadStocks() {
        renderStockWatchlist();
    }

    static async loadOhlcv() {
        UIRender.showLoader('#loader-ohlcv');
        const data = await ApiMock.getOhlcv();
        const tickers = Array.from(new Set(data.map(r => r.Ticker))).map(t => ({ value: t, label: t }));
        UIRender.populateSelect('#ohlcvTickerSelect', tickers);
        UIRender.table('ohlcvTable', '#ohlcv-table', data);
        UIRender.hideLoader('#loader-ohlcv');
    }

    static async loadMonitor() {
        UIRender.showLoader('#loader-monitor');
        const monitor = await ApiMock.getMonitor();
        UIRender.table('monitorTable', '#monitor-table', monitor);
        UIRender.hideLoader('#loader-monitor');
    }

    static async loadPortfolio() {
        const portfolio = await ApiMock.getPortfolio();
        UIRender.showLoader('#loader-portfolio-open');
        UIRender.table('portfolioOpenTable', '#portfolio-open-table', portfolio.open);
        UIRender.hideLoader('#loader-portfolio-open');

        UIRender.showLoader('#loader-portfolio-closed');
        UIRender.table('portfolioClosedTable', '#portfolio-closed-table', portfolio.closed);
        UIRender.hideLoader('#loader-portfolio-closed');
    }

    static async loadTransactions() {
        UIRender.showLoader('#loader-transactions');
        const tx = await ApiMock.getTransactions();
        UIRender.table('transactionsTable', '#transactions-table', tx);
        UIRender.hideLoader('#loader-transactions');
    }

    static async loadLogs() {
        UIRender.showLoader('#loader-logs');
        const logs = await ApiMock.getLogs();
        UIRender.table('logsTable', '#logs-table', logs);
        UIRender.hideLoader('#loader-logs');
    }
}

document.addEventListener('DOMContentLoaded', () => { App.init(); });
