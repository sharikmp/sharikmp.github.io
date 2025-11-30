class JSTable {
            static DEFAULT_CONFIG = {
                controls: {
                    search: { render: true },
                    editToggle: { render: true },
                    import: { render: true },
                    addRow: { render: true },
                    addCol: { render: true }
                },
                cloneState: true,
                onChange: null
            };

            static create(container, state, config) {
                return new JSTable(container, state, config);
            }

            static deepMerge(base, extra) {
                const out = { ...(base || {}) };
                Object.entries(extra || {}).forEach(([key, val]) => {
                    if (val && typeof val === "object" && !Array.isArray(val)) {
                        out[key] = JSTable.deepMerge(base?.[key] || {}, val);
                    } else {
                        out[key] = val;
                    }
                });
                return out;
            }

            static cloneState(obj) {
                return JSON.parse(JSON.stringify(obj ?? {}));
            }

            static makeId(prefix = "js-table") {
                return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
            }

            static normalizeValue(val, colType) {
                if (colType === "number") {
                    const num = Number(val);
                    return Number.isFinite(num) ? num : null;
                }
                return val ?? null;
            }

            static isEmpty(val) {
                return val === null || val === undefined || String(val).trim() === "";
            }

            constructor(container, state, config = {}) {
                if (!container) throw new Error("JSTable: container is required");
                this.container = container;
                this.config = JSTable.deepMerge(JSTable.DEFAULT_CONFIG, config);
                this.state = this.config.cloneState ? JSTable.cloneState(state) : (state || {});
                this._ensureStateShape();
                this._elements = {};
                this._validationState = { invalidCells: new Set(), messages: [] };
                this.instanceId = JSTable.makeId();
                this._buildSkeleton();
                this._wireEvents();
                this._applyTheme();
                this.renderAll();
            }

                /* ---------- Public API ---------- */

                renderAll() {
                    this._renderControls();
                    this._renderHeader();
                    this._renderBody();
                    this._updateFooter();
                }

                setTheme(themeName) {
                    this.state.meta.theme = themeName;
                    this._applyTheme();
                }

                getState() {
                    return this.state;
                }

                addRow() {
                    const cols = this.state.columns.length;
                    this.state.data.rows.push(new Array(cols).fill(null));
                    this.renderAll();
                    this._notifyChange("addRow");
                }

                addColumn(def) {
                    const name = (def && def.name ? def.name : "New Column").trim();
                    const type = (def && def.type ? def.type : "text").toLowerCase();
                    const required = !!(def && def.required);
                    const unique = !!(def && def.unique);
                    const options = Array.isArray(def?.options) ? def.options : [];

                    const idBase = (def && def.id ? def.id : name)
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "_") || `col_${Date.now()}`;

                    let id = idBase;
                    let suffix = 1;
                    while (this.state.columns.some(c => c.id === id)) {
                        id = `${idBase}_${suffix++}`;
                    }

                    const newCol = {
                        id,
                        name,
                        type,
                        required,
                        unique,
                        options,
                        sortable: def?.sortable ?? true,
                        searchable: def?.searchable ?? true,
                        editable: def?.editable ?? true
                    };

                    this.state.columns.push(newCol);
                    this.state.data.rows.forEach(row => row.push(null));
                    this.renderAll();
                    this._notifyChange("addColumn");
                }

                bulkUploadFile(file) {
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = e => {
                        const text = e.target.result;
                        this._bulkUploadCsvText(text);
                    };
                    reader.readAsText(file);
                }

                toggleEditMode() {
                    if (!this.state.meta.editEnabled) {
                        Notification.toast("Editing is disabled for this table", "warning");
                        return;
                    }

                    if (!this.state.ui.editMode) {
                        this.state.ui.editMode = true;
                        this._clearValidation();
                        this.renderAll();
                        return;
                    }

                    const validation = this._validateData();
                    this._validationState = validation;
                    if (!validation.ok) {
                        const msg = validation.messages.join(" | ") || "Please complete required fields";
                        Notification.toast(`Cannot save: ${msg}`, "warning");
                        this.renderAll();
                        return;
                    }

                    this.state.ui.editMode = false;
                    this._clearValidation();
                    this.renderAll();
                    Notification.toast("Table saved successfully", "success");
                }

                /* ---------- Private: setup & guards ---------- */

                _ensureStateShape() {
                    const defaults = {
                        meta: {
                            title: "JSON Table",
                            theme: "dark",
                            editEnabled: true,
                            bulkUpload: { enabled: true, requiredColumnsMustExist: true },
                            sorting: { enabled: true, multiColumn: false },
                            search: { enabled: true, placeholder: "Search..." }
                        },
                        columns: [],
                        data: { rows: [] },
                        ui: {
                            editMode: false,
                            sort: { columnId: null, direction: "asc" },
                            filter: { searchQuery: "" }
                        }
                    };

                    this.state.meta = { ...defaults.meta, ...(this.state.meta || {}) };
                    this.state.columns = (this.state.columns || []).map(col => ({
                        required: false,
                        options: [],
                        sortable: true,
                        searchable: true,
                        editable: true,
                        unique: false,
                        ...col
                    }));
                    this.state.data = { ...defaults.data, ...(this.state.data || {}) };
                    this.state.data.rows = (this.state.data.rows || []).map(row => {
                        const copy = Array.isArray(row) ? [...row] : [];
                        while (copy.length < this.state.columns.length) copy.push(null);
                        if (copy.length > this.state.columns.length) copy.length = this.state.columns.length;
                        return copy;
                    });
                    this.state.ui = { ...defaults.ui, ...(this.state.ui || {}) };
                    this.state.ui.sort = { ...defaults.ui.sort, ...(this.state.ui.sort || {}) };
                    this.state.ui.filter = { ...defaults.ui.filter, ...(this.state.ui.filter || {}) };

                    if (!this.state.ui.sort.columnId && Array.isArray(this.state.meta.sorting?.defaultSort) && this.state.meta.sorting.defaultSort.length) {
                        const first = this.state.meta.sorting.defaultSort[0];
                        this.state.ui.sort = { columnId: first.columnId, direction: first.direction || "asc" };
                    }
                }

                _applyTheme() {
                    const themeName = this.state.meta.theme;
                    if (!themeName) return;
                    document.documentElement.setAttribute("data-theme", themeName);
                    document.documentElement.setAttribute("data-bs-theme", themeName);
                }

                /* ---------- Private: DOM skeleton (Bootstrap Structure) ---------- */

                _buildSkeleton() {
                    const shell = document.createElement("div");
                    shell.className = "card js-table-shell";

                    const header = document.createElement("div");
                    header.className = "card-header d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 py-3";

                    const titleWrap = document.createElement("div");
                    titleWrap.className = "d-flex align-items-center";

                    const titleSpan = document.createElement("h5");
                    titleSpan.className = "mb-0 fw-bold";
                    titleSpan.style.color = "#4285F4";

                    const badgeSpan = document.createElement("span");
                    badgeSpan.className = "badge bg-secondary ms-2";

                    titleWrap.appendChild(titleSpan);
                    titleWrap.appendChild(badgeSpan);

                    const actions = document.createElement("div");
                    actions.className = "d-flex flex-column flex-md-row align-items-end align-items-md-center justify-content-end gap-2 ms-md-auto";

                    const searchGroup = document.createElement("div");
                    searchGroup.className = "input-group input-group-sm flex-grow-0 ms-auto";
                    searchGroup.style.minWidth = "260px";
                    searchGroup.style.maxWidth = "360px";
                    searchGroup.style.width = "100%";
                    const searchIconSpan = document.createElement("span");
                    searchIconSpan.className = "input-group-text";
                    searchIconSpan.innerHTML = '<i class="fas fa-search"></i>';

                    const searchInput = document.createElement("input");
                    searchInput.type = "search";
                    searchInput.className = "form-control";
                    searchInput.placeholder = "Search...";

                    searchGroup.appendChild(searchIconSpan);
                    searchGroup.appendChild(searchInput);

                    const actionButtons = document.createElement("div");
                    actionButtons.className = "d-flex align-items-center justify-content-end gap-2 td-action-buttons";

                    const editBtn = document.createElement("button");
                    editBtn.type = "button";
                    editBtn.className = "icon-btn icon-btn-primary d-flex align-items-center gap-2";
                    editBtn.innerHTML = '<i class="fas fa-pen-to-square" data-icon="edit"></i> <span class="d-none d-sm-inline" data-label>Edit</span>';

                    const csvBtn = document.createElement("button");
                    csvBtn.type = "button";
                    csvBtn.className = "icon-btn icon-btn-primary d-flex align-items-center gap-2";
                    csvBtn.innerHTML = '<i class="fas fa-file-csv"></i> <span class="d-none d-sm-inline">Import</span>';
                    csvBtn.title = "Import CSV";

                    const csvInput = document.createElement("input");
                    csvInput.type = "file";
                    csvInput.accept = ".csv";
                    csvInput.className = "d-none";
                    csvInput.id = `${this.instanceId}-csv`;

                    const addRowBtn = document.createElement("button");
                    addRowBtn.type = "button";
                    addRowBtn.className = "icon-btn icon-btn-success d-flex align-items-center gap-2";
                    addRowBtn.innerHTML = '<i class="fas fa-plus"></i> <span class="d-none d-sm-inline">Row</span>';

                    const addColBtn = document.createElement("button");
                    addColBtn.type = "button";
                    addColBtn.className = "icon-btn icon-btn-primary d-flex align-items-center gap-2";
                    addColBtn.innerHTML = '<i class="fas fa-table-columns"></i> <span class="d-none d-sm-inline">Col</span>';

                    actionButtons.appendChild(csvBtn);
                    actionButtons.appendChild(editBtn);
                    actionButtons.appendChild(addRowBtn);
                    actionButtons.appendChild(addColBtn);
                    actionButtons.appendChild(csvInput);

                    actions.appendChild(searchGroup);
                    actions.appendChild(actionButtons);

                    header.appendChild(titleWrap);
                    header.appendChild(actions);

                    const wrapper = document.createElement("div");
                    wrapper.className = "table-responsive";

                    const table = document.createElement("table");
                    table.className = "table table-hover align-middle";

                    const thead = document.createElement("thead");
                    const tbody = document.createElement("tbody");

                    table.appendChild(thead);
                    table.appendChild(tbody);
                    wrapper.appendChild(table);

                    const footer = document.createElement("div");
                    footer.className = "card-footer d-flex justify-content-between align-items-center py-2";

                    const left = document.createElement("div");
                    left.className = "d-flex align-items-center gap-2 small text-muted";

                    const dot = document.createElement("div");
                    dot.className = "js-footer-dot";

                    const rowCount = document.createElement("span");
                    const requiredBadge = document.createElement("span");
                    requiredBadge.className = "badge bg-secondary fw-normal";

                    left.appendChild(dot);
                    left.appendChild(rowCount);
                    left.appendChild(requiredBadge);

                    footer.appendChild(left);

                    shell.appendChild(header);
                    shell.appendChild(wrapper);
                    shell.appendChild(footer);

                    const modalBackdrop = document.createElement("div");
                    modalBackdrop.className = "modal-backdrop fade js-table-modal-backdrop";
                    modalBackdrop.style.display = "none";

                    const modalWrapper = document.createElement("div");
                    modalWrapper.className = "modal fade js-table-modal";
                    modalWrapper.setAttribute("tabindex", "-1");
                    modalWrapper.setAttribute("role", "dialog");
                    modalWrapper.style.display = "none";

                    const modalDialog = document.createElement("div");
                    modalDialog.className = "modal-dialog modal-dialog-centered";

                    const modalContent = document.createElement("div");
                    modalContent.className = "modal-content";

                    modalContent.innerHTML = `
                    <div class="modal-header">
                        <h5 class="modal-title fs-6 fw-bold" style="color:var(--td-text-primary)"><i class="fas fa-plus-circle me-2"></i>Add New Column</h5>
                        <button type="button" class="btn-close btn-close-white" data-action="cancel"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label small text-muted text-uppercase fw-bold">Column Label</label>
                            <input type="text" class="form-control" data-field="name" placeholder="e.g. Status">
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-muted text-uppercase fw-bold">ID (Internal)</label>
                            <input type="text" class="form-control" data-field="id" placeholder="Optional">
                        </div>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label small text-muted text-uppercase fw-bold">Data Type</label>
                                <select class="form-select" data-field="type">
                                    <option value="text">Text</option>
                                    <option value="number">Number</option>
                                    <option value="dropdown">Dropdown</option>
                                </select>
                            </div>
                            <div class="col-md-6 d-flex align-items-end">
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="checkbox" id="${this.instanceId}-req" data-field="required">
                                    <label class="form-check-label" style="color:var(--td-text-secondary)" for="${this.instanceId}-req">Required Field</label>
                                </div>
                                <div class="form-check mb-2 ms-3">
                                    <input class="form-check-input" type="checkbox" id="${this.instanceId}-uniq" data-field="unique">
                                    <label class="form-check-label" style="color:var(--td-text-secondary)" for="${this.instanceId}-uniq">Unique Field</label>
                                </div>
                            </div>
                        </div>
                        <div class="mt-3" data-options-block style="display:none;">
                            <label class="form-label small text-muted text-uppercase fw-bold">Dropdown Options</label>
                            <textarea class="form-control" rows="3" data-field="options" placeholder="Comma separated values...&#10;e.g. Open, In Progress, Closed"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-sm btn-outline-secondary" data-action="cancel">Cancel</button>
                        <button type="button" class="btn btn-sm btn-primary" data-action="save">Save Column</button>
                    </div>
                `;

                    modalDialog.appendChild(modalContent);
                    modalWrapper.appendChild(modalDialog);

                    document.body.appendChild(modalBackdrop);
                    document.body.appendChild(modalWrapper);
                    this.container.appendChild(shell);

                    this._elements = {
                        shell,
                        header,
                        title: titleSpan,
                        modeBadge: badgeSpan,
                        searchInput,
                        searchWrapper: searchGroup,
                        editToggle: editBtn,
                        csvBtn,
                        csvInput,
                        table,
                        headEl: thead,
                        bodyEl: tbody,
                        rowCountLabel: rowCount,
                        requiredCountLabel: requiredBadge,
                        addRowBtn,
                        addColBtn,
                        modalBackdrop,
                        modalWrapper,
                        modalNameInput: modalContent.querySelector('[data-field="name"]'),
                        modalIdInput: modalContent.querySelector('[data-field="id"]'),
                        modalTypeSelect: modalContent.querySelector('[data-field="type"]'),
                        modalRequiredCheckbox: modalContent.querySelector('[data-field="required"]'),
                        modalUniqueCheckbox: modalContent.querySelector('[data-field="unique"]'),
                        modalOptionsBlock: modalContent.querySelector('[data-options-block]'),
                        modalOptionsTextarea: modalContent.querySelector('[data-field="options"]'),
                        modalSaveBtn: modalContent.querySelector('[data-action="save"]'),
                        modalCancelBtn: modalContent.querySelectorAll('[data-action="cancel"]')
                    };
                }

                /* ---------- Private: rendering ---------- */

                _renderControls() {
                    const { meta, ui } = this.state;
                    const els = this._elements;

                    els.title.textContent = meta.title || "JSON Table";
                    if (ui.editMode) {
                        els.modeBadge.textContent = "EDITING";
                        els.modeBadge.className = "badge bg-warning ms-2";
                        els.modeBadge.classList.remove("d-none");
                    } else {
                        els.modeBadge.textContent = "";
                        els.modeBadge.className = "badge bg-secondary ms-2 d-none";
                    }

                    const searchRendered = this.config.controls.search.render !== false;
                    const searchEnabled = meta.search?.enabled !== false;
                    const showSearch = searchRendered && searchEnabled;
                    els.searchWrapper.classList.toggle("d-none", !showSearch);
                    if (showSearch) {
                        els.searchInput.placeholder = meta.search?.placeholder || "Search...";
                        els.searchInput.title = "Search table";
                    }

                    const editRendered = this.config.controls.editToggle.render !== false;
                    const editEnabled = meta.editEnabled !== false;
                    const showEditToggle = editRendered && editEnabled;
                    els.editToggle.classList.toggle("d-none", !showEditToggle);
                    els.editToggle.disabled = !showEditToggle;
                    const editIcon = els.editToggle.querySelector("[data-icon]");
                    const editLabel = els.editToggle.querySelector("[data-label]");
                    if (ui.editMode) {
                        editIcon.className = "fas fa-floppy-disk";
                        editLabel.textContent = "Save";
                        els.editToggle.classList.add("active");
                    } else {
                        editIcon.className = "fas fa-pen-to-square";
                        editLabel.textContent = "Edit";
                        els.editToggle.classList.remove("active");
                    }
                    els.editToggle.title = editEnabled ? "Toggle edit mode" : "Editing disabled";

                    const importRendered = this.config.controls.import.render !== false;
                    const csvEnabled = !!meta.bulkUpload?.enabled;
                    const showImport = importRendered && csvEnabled;
                    els.csvBtn.classList.toggle("d-none", !showImport);
                    els.csvBtn.disabled = !showImport;
                    els.csvBtn.title = csvEnabled ? "Import CSV" : "CSV import disabled";

                    const addRowRendered = this.config.controls.addRow.render !== false;
                    const addColRendered = this.config.controls.addCol.render !== false;
                    const allowEntry = ui.editMode && editEnabled;
                    const showAddRow = addRowRendered && allowEntry;
                    const showAddCol = addColRendered && allowEntry;
                    els.addRowBtn.classList.toggle("d-none", !showAddRow);
                    els.addColBtn.classList.toggle("d-none", !showAddCol);
                    els.addRowBtn.disabled = !allowEntry;
                    els.addColBtn.disabled = !allowEntry;
                    const addTooltip = editEnabled ? "Switch to edit to modify columns/rows" : "Editing disabled";
                    els.addRowBtn.title = allowEntry ? "Add Row" : addTooltip;
                    els.addColBtn.title = allowEntry ? "Add Column" : addTooltip;
                }

                _renderHeader() {
                    const headEl = this._elements.headEl;
                    headEl.innerHTML = "";
                    const tr = document.createElement("tr");
                    const cols = this.state.columns;
                    const showRowActions = this._canEditRows();

                    cols.forEach(col => {
                        const th = document.createElement("th");
                        th.className = "text-nowrap";
                        if (col.align === "end") {
                            th.classList.add("text-end");
                        } else if (col.align === "center") {
                            th.classList.add("text-center");
                        } else {
                            th.classList.add("text-start");
                        }
                        th.style.cursor = "pointer";
                        th.style.userSelect = "none";

                        const container = document.createElement("div");
                        container.className = "d-flex align-items-center gap-2";

                        const nameSpan = document.createElement("span");
                        nameSpan.className = "fw-semibold";
                        nameSpan.style.color = "var(--td-text-primary)";
                        nameSpan.textContent = col.name;
                        container.appendChild(nameSpan);

                    if (col.required) {
                        const dot = document.createElement("span");
                        dot.className = "js-req-dot";
                        dot.title = "Required";
                        dot.textContent = "*";
                        container.appendChild(dot);
                    }

                        if (col.unique) {
                            const uniqueBadge = document.createElement("span");
                            uniqueBadge.className = "badge bg-secondary text-uppercase";
                            uniqueBadge.textContent = "Unique";
                            uniqueBadge.style.fontSize = "0.65rem";
                            container.appendChild(uniqueBadge);
                        }

                        if (this.state.meta.sorting?.enabled && col.sortable !== false) {
                            const icon = document.createElement("i");
                            const active = this.state.ui.sort.columnId === col.id;
                            const dir = this.state.ui.sort.direction;

                            icon.className = "fas fa-sort small ms-auto";
                            icon.style.color = "var(--td-text-muted)";
                            if (active) {
                                icon.className = `fas fa-sort-${dir === "asc" ? "up" : "down"} ms-auto`;
                                icon.style.color = "var(--td-primary)";
                            }

                            container.appendChild(icon);
                            th.addEventListener("click", () => this._toggleSort(col.id));
                        }

                        th.appendChild(container);
                        tr.appendChild(th);
                    });

                    if (showRowActions) {
                        const th = document.createElement("th");
                        th.className = "text-center";
                        th.style.width = "48px";
                        tr.appendChild(th);
                    }

                    headEl.appendChild(tr);
                }

                _getFilteredAndSortedRows() {
                    const { searchQuery } = this.state.ui.filter;
                    const cols = this.state.columns;
                    let rows = this.state.data.rows.map((row, idx) => ({ row, idx }));

                    if (searchQuery && this.state.meta.search?.enabled) {
                        const q = searchQuery.toLowerCase();
                        rows = rows.filter(({ row }) =>
                            row.some((val, cIdx) => {
                                const col = cols[cIdx];
                                if (!col || col.searchable === false) return false;
                                return String(val ?? "").toLowerCase().includes(q);
                            })
                        );
                    }

                    const sortColId = this.state.ui.sort.columnId;
                    const direction = this.state.ui.sort.direction;
                    const sortIndex = cols.findIndex(c => c.id === sortColId);

                    if (sortIndex >= 0 && this.state.meta.sorting?.enabled) {
                        rows.sort((aObj, bObj) => {
                            const a = aObj.row[sortIndex];
                            const b = bObj.row[sortIndex];
                            if (a == null && b == null) return 0;
                            if (a == null) return 1;
                            if (b == null) return -1;
                            const isNum = cols[sortIndex].type === "number";
                            if (isNum) {
                                return (Number(a) - Number(b)) * (direction === "asc" ? 1 : -1);
                            }
                            return String(a).localeCompare(String(b)) * (direction === "asc" ? 1 : -1);
                        });
                    }

                    return rows;
                }

                _rowArrayToObject(row) {
                    const obj = {};
                    this.state.columns.forEach((col, idx) => {
                        obj[col.id] = row[idx];
                    });
                    return obj;
                }

                _renderBody() {
                    const bodyEl = this._elements.bodyEl;
                    bodyEl.innerHTML = "";
                    const rows = this._getFilteredAndSortedRows();

                    const showRowActions = this._canEditRows();

                    rows.forEach(({ row, idx: rIdx }) => {
                        const tr = document.createElement("tr");
                        tr.dataset.rowIndex = rIdx;
                        const rowObject = this._rowArrayToObject(row);

                        this.state.columns.forEach((col, cIdx) => {
                            const td = document.createElement("td");
                            if (col.align === "end") {
                                td.classList.add("text-end");
                            } else if (col.align === "center") {
                                td.classList.add("text-center");
                            } else {
                                td.classList.add("text-start");
                            }
                            const val = row[cIdx];
                            const key = this._cellKey(rIdx, col.id);
                            const isInvalid = this.state.ui.editMode && this._validationState.invalidCells.has(key);

                            if (this.state.ui.editMode && col.editable !== false) {
                                if (col.type === "dropdown") {
                                    const sel = document.createElement("select");
                                    sel.className = "form-select form-select-sm";

                                    const blankOpt = document.createElement("option");
                                    blankOpt.value = "";
                                    blankOpt.textContent = "Select...";
                                    sel.appendChild(blankOpt);

                                    (col.options || []).forEach(o => {
                                        const opt = document.createElement("option");
                                        opt.value = o;
                                        opt.textContent = o;
                                        sel.appendChild(opt);
                                    });
                                    sel.value = val ?? "";
                                    sel.addEventListener("change", () => {
                                        this._updateCell(rIdx, cIdx, sel.value);
                                    });
                                    if (isInvalid) sel.classList.add("is-invalid");
                                    td.appendChild(sel);
                                } else {
                                    const input = document.createElement("input");
                                    input.className = "form-control form-control-sm";
                                    input.type = col.type === "number" ? "number" : "text";
                                    input.value = val ?? "";
                                    input.addEventListener("change", () => {
                                        const v = JSTable.normalizeValue(input.value, col.type);
                                        this._updateCell(rIdx, cIdx, v);
                                    });
                                    if (isInvalid) input.classList.add("is-invalid");
                                    td.appendChild(input);
                                }
                            } else {
                                const formatted = typeof col.format === "function" ? col.format(val, rowObject) : val;
                                if (formatted == null || formatted === "") {
                                    const span = document.createElement("span");
                                    span.className = "small fst-italic";
                                    span.style.color = "var(--td-text-muted)";
                                    span.textContent = "-";
                                    td.appendChild(span);
                                } else if (col.allowHtml) {
                                    td.innerHTML = formatted;
                                } else {
                                    td.textContent = formatted;
                                }
                            }

                            tr.appendChild(td);
                        });

                        if (showRowActions) {
                            const actionTd = document.createElement("td");
                            actionTd.className = "text-center";
                            const btn = document.createElement("button");
                            btn.type = "button";
                            btn.className = "icon-btn icon-btn-danger";
                            btn.innerHTML = '<i class="fas fa-trash"></i>';
                            btn.title = "Delete row";
                            btn.addEventListener("click", () => this._deleteRow(rIdx));
                            actionTd.appendChild(btn);
                            tr.appendChild(actionTd);
                        }

                        bodyEl.appendChild(tr);
                    });
                }

                _updateFooter() {
                    const rows = this._getFilteredAndSortedRows();
                    this._elements.rowCountLabel.textContent = `${rows.length} row${rows.length === 1 ? "" : "s"}`;
                    const requiredCount = this.state.columns.filter(c => c.required).length;
                    this._elements.requiredCountLabel.textContent = `${requiredCount} required`;
                }

                /* ---------- Private: state helpers ---------- */

                _toggleSort(columnId) {
                    if (!this.state.meta.sorting?.enabled) return;
                    const current = this.state.ui.sort;
                    if (current.columnId === columnId) {
                        current.direction = current.direction === "asc" ? "desc" : "asc";
                    } else {
                        current.columnId = columnId;
                        current.direction = "asc";
                    }
                    this.renderAll();
                }

                _updateCell(rowIndex, colIndex, value) {
                    const col = this.state.columns[colIndex];
                    this.state.data.rows[rowIndex][colIndex] = JSTable.normalizeValue(value, col?.type);
                    if (this.state.ui.editMode) {
                        this._validationState = this._validateData();
                        this._applyValidationStyles();
                    }
                    this._notifyChange("updateCell");
                }

                _deleteRow(rowIndex) {
                    if (!this._canEditRows()) return;
                    if (rowIndex < 0 || rowIndex >= this.state.data.rows.length) return;
                    this.state.data.rows.splice(rowIndex, 1);
                    this._validationState = this._validateData();
                    this.renderAll();
                    Notification.toast("Row removed", "success");
                    this._notifyChange("deleteRow");
                }

                _parseCsv(text) {
                    const lines = text.split(/\r?\n/).filter(l => l.trim() !== "");
                    if (!lines.length) return { header: [], rows: [] };
                    const header = lines[0].split(",").map(h => h.trim());
                    const rows = lines.slice(1).map(line => line.split(",").map(v => v.trim()));
                    return { header, rows };
                }

                _bulkUploadCsvText(text) {
                    const { header, rows } = this._parseCsv(text);
                    if (!header.length) {
                        Notification.toast("CSV has no header row", "error");
                        return;
                    }
                    const colMap = {};
                    header.forEach((h, idx) => {
                        const col = this.state.columns.find(c => c.name === h || c.id === h);
                        if (col) colMap[col.id] = idx;
                    });
                    if (this.state.meta.bulkUpload?.requiredColumnsMustExist) {
                        const missing = this.state.columns.filter(c => c.required && colMap[c.id] == null);
                        if (missing.length) {
                            Notification.toast("CSV missing required columns: " + missing.map(m => m.name).join(", "), "error");
                            return;
                        }
                    }
                    const uniqueCols = this.state.columns
                        .map((c, idx) => ({ col: c, idx }))
                        .filter(({ col }) => col.unique);
                    const uniqueSets = new Map();
                    uniqueCols.forEach(({ col, idx }) => {
                            const set = new Map();
                            this.state.data.rows.forEach((row, rIdx) => {
                                const key = JSTable.isEmpty(row[idx]) ? null : String(row[idx]).trim().toLowerCase();
                                if (key) set.set(key, rIdx);
                            });
                        uniqueSets.set(col.id, set);
                    });

                    let imported = 0;
                    let skipped = 0;
                    rows.forEach(r => {
                        const newRow = this.state.columns.map(col => {
                            const idx = colMap[col.id];
                            if (idx == null) return null;
                            const raw = r[idx];
                            return JSTable.normalizeValue(raw, col.type);
                        });

                        let uniqueViolation = false;
                        uniqueCols.forEach(({ col, idx }) => {
                            const key = JSTable.isEmpty(newRow[idx]) ? null : String(newRow[idx]).trim().toLowerCase();
                            if (!key) return;
                            const tracker = uniqueSets.get(col.id);
                            if (tracker.has(key)) {
                                uniqueViolation = true;
                            } else {
                                tracker.set(key, this.state.data.rows.length + imported);
                            }
                        });

                        if (uniqueViolation) {
                            skipped++;
                            return;
                        }
                        this.state.data.rows.push(newRow);
                        imported++;
                    });
                    this.renderAll();
                    const msg = skipped
                        ? `Imported ${imported} rows; skipped ${skipped} due to unique constraints.`
                        : `Imported ${imported} rows successfully`;
                    Notification.toast(msg, skipped ? "warning" : "success");
                    if (imported) this._notifyChange("bulkUpload");
                }

                /* ---------- Private: modal helpers ---------- */

                _openColumnModal() {
                    const els = this._elements;
                    els.modalNameInput.value = "";
                    els.modalIdInput.value = "";
                    els.modalTypeSelect.value = "text";
                    els.modalRequiredCheckbox.checked = false;
                    els.modalUniqueCheckbox.checked = false;
                    els.modalOptionsTextarea.value = "";
                    els.modalOptionsBlock.style.display = "none";

                    els.modalBackdrop.classList.add("show");
                    els.modalBackdrop.style.display = "block";

                    els.modalWrapper.classList.add("show");
                    els.modalWrapper.style.display = "block";

                    els.modalNameInput.focus();
                }

                _closeColumnModal() {
                    const els = this._elements;
                    els.modalBackdrop.classList.remove("show");
                    els.modalWrapper.classList.remove("show");

                    setTimeout(() => {
                        els.modalBackdrop.style.display = "none";
                        els.modalWrapper.style.display = "none";
                    }, 150);
                }

                _handleColumnModalSave() {
                    const name = this._elements.modalNameInput.value.trim();
                    if (!name) {
                        Notification.toast("Please enter a column label", "warning");
                        return;
                    }
                    const id = this._elements.modalIdInput.value.trim();
                    const type = this._elements.modalTypeSelect.value;
                    const required = this._elements.modalRequiredCheckbox.checked;
                    const unique = this._elements.modalUniqueCheckbox.checked;
                    let options = [];
                    if (type === "dropdown") {
                        const raw = this._elements.modalOptionsTextarea.value.trim();
                        if (raw) {
                            options = raw.split(",").map(s => s.trim()).filter(Boolean);
                        }
                    }
                    this.addColumn({ name, id, type, required, unique, options });
                    this._closeColumnModal();
                    Notification.toast(`Column "${name}" added`, "success");
                }

                /* ---------- Private: validation ---------- */

                _validateData() {
                    const invalidCells = new Set();
                    const requiredInvalid = new Set();
                    const messages = [];
                    const rows = this.state.data.rows;

                    const requiredCols = this.state.columns
                        .map((col, idx) => ({ col, idx }))
                        .filter(({ col }) => col.required);

                    requiredCols.forEach(({ col, idx }) => {
                        rows.forEach((row, rIdx) => {
                            if (JSTable.isEmpty(row[idx])) {
                                const key = this._cellKey(rIdx, col.id);
                                invalidCells.add(key);
                                requiredInvalid.add(key);
                            }
                        });
                    });
                    if (requiredCols.length && requiredInvalid.size) {
                        messages.push("Fill all required fields");
                    }

                    const uniqueCols = this.state.columns
                        .map((col, idx) => ({ col, idx }))
                        .filter(({ col }) => col.unique);

                    let uniqueViolation = false;
                    uniqueCols.forEach(({ col, idx }) => {
                        const tracker = new Map();
                        rows.forEach((row, rIdx) => {
                            const key = JSTable.isEmpty(row[idx]) ? null : String(row[idx]).trim().toLowerCase();
                            if (!key) return;
                            if (tracker.has(key)) {
                                uniqueViolation = true;
                                invalidCells.add(this._cellKey(rIdx, col.id));
                                invalidCells.add(this._cellKey(tracker.get(key), col.id));
                            } else {
                                tracker.set(key, rIdx);
                            }
                        });
                    });
                    if (uniqueCols.length && uniqueViolation) {
                        const uniqueColsList = uniqueCols.map(({ col }) => col.name).join(", ");
                        messages.push(`Unique constraint: ${uniqueColsList}`);
                    }

                    return { ok: invalidCells.size === 0, invalidCells, messages };
                }

                _clearValidation() {
                    this._validationState = { invalidCells: new Set(), messages: [] };
                }

                _cellKey(rowIndex, colId) {
                    return `${rowIndex}-${colId}`;
                }

                _canEditRows() {
                    return this.state.meta.editEnabled !== false && this.state.ui.editMode;
                }

                _applyValidationStyles() {
                    if (!this.state.ui.editMode) return;
                    const body = this._elements.bodyEl;
                    body.querySelectorAll("tr").forEach(tr => {
                        const rowIndex = Number(tr.dataset.rowIndex);
                        tr.querySelectorAll("input, select").forEach((control, colIndex) => {
                            const colId = this.state.columns[colIndex]?.id;
                            if (!colId) return;
                            const key = this._cellKey(rowIndex, colId);
                            const invalid = this._validationState.invalidCells.has(key);
                            control.classList.toggle("is-invalid", invalid);
                        });
                    });
                }

                /* ---------- Private: events ---------- */

                _wireEvents() {
                    const els = this._elements;

                    els.searchInput.addEventListener("input", () => {
                        this.state.ui.filter.searchQuery = els.searchInput.value;
                        this.renderAll();
                    });

                    els.editToggle.addEventListener("click", () => this.toggleEditMode());

                    els.csvBtn.addEventListener("click", () => {
                        if (els.csvBtn.disabled) return;
                        els.csvInput.click();
                    });
                    els.csvInput.addEventListener("change", () => {
                        const file = els.csvInput.files[0];
                        this.bulkUploadFile(file);
                        els.csvInput.value = "";
                    });

                    els.addRowBtn.addEventListener("click", () => {
                        if (els.addRowBtn.disabled) return;
                        this.addRow();
                    });
                    els.addColBtn.addEventListener("click", () => {
                        if (els.addColBtn.disabled) return;
                        this._openColumnModal();
                    });

                    els.modalTypeSelect.addEventListener("change", () => {
                        const show = els.modalTypeSelect.value === "dropdown";
                        els.modalOptionsBlock.style.display = show ? "block" : "none";
                    });

                    els.modalCancelBtn.forEach(btn => {
                        btn.addEventListener("click", () => this._closeColumnModal());
                    });

                    els.modalSaveBtn.addEventListener("click", () => this._handleColumnModalSave());

                    els.modalWrapper.addEventListener("click", (e) => {
                        if (e.target === els.modalWrapper) this._closeColumnModal();
                    });
                }

                async _notifyChange(reason) {
                    if (typeof this.config.onChange !== "function") return;
                    const payload = {
                        reason,
                        sheetName: this.state.meta.sheetName || this.state.meta.id || this.state.meta.title || "sheet",
                        columns: this.state.columns.map(c => ({ ...c })),
                        rows: this.state.data.rows.map(r => [...r])
                    };
                    try {
                        await this.config.onChange(payload);
                    } catch (err) {
                        console.error("JSTable onChange error:", err);
                        Notification.toast("Sync callback failed. Check console for details.", "warning");
                    }
                }
            }
