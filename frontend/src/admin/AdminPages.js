import React, { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  dashboardActivities,
  dashboardAnalytics,
  dashboardAppointments,
  dashboardChartSeries,
  dashboardQuickActions,
  dashboardStats,
  moduleRegistry,
} from "./adminPortalData";
import { useAdminPortal } from "./AdminLayout";

const PAGE_SIZE = 5;

const statusToneClass = (value = "") => {
  const normalized = String(value).toLowerCase();
  if (["success", "verified", "active", "approved", "published", "resolved", "sent", "normal"].some((item) => normalized.includes(item))) {
    return "is-success";
  }
  if (["warning", "pending", "scheduled", "review", "draft", "under review"].some((item) => normalized.includes(item))) {
    return "is-warning";
  }
  if (["blocked", "suspended", "cancelled", "critical", "flagged", "inactive", "closed"].some((item) => normalized.includes(item))) {
    return "is-danger";
  }
  return "is-neutral";
};

const titleCase = (value) =>
  String(value)
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getSearchableBlob = (record) =>
  Object.values(record)
    .join(" ")
    .toLowerCase();

const buildFormState = (fields, record) => {
  const nextState = {};
  fields.forEach((field) => {
    nextState[field.key] = record?.[field.key] ?? (field.type === "number" ? "" : "");
  });
  return nextState;
};

const buildRecordId = (title) => {
  const prefix = title
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 3)
    .toUpperCase();
  return `${prefix}-${Date.now().toString().slice(-6)}`;
};

const getRowActions = (title) => {
  switch (title) {
    case "Doctors":
      return ["View Profile", "Edit", "Verify Medical License", "Suspend", "Delete"];
    case "Patients":
      return ["View Medical History", "Appointment History", "Edit", "Block", "Unblock"];
    case "Staff":
      return ["Edit", "Delete"];
    case "Hospital Management":
      return ["Edit", "Delete", "Activate", "Deactivate"];
    case "Appointment Management":
      return ["Approve", "Cancel", "Reschedule", "Assign Doctor", "Edit"];
    case "Health Notices":
      return ["Publish", "Archive", "Schedule", "Edit", "Delete"];
    case "Emergency Alerts":
      return ["Publish", "Schedule", "Edit", "Delete"];
    case "Notification Center":
      return ["Send", "Schedule", "Edit", "Delete"];
    case "Feedback & Complaints":
      return ["Assign Complaint", "Resolve", "Close", "Edit"];
    case "Audit Logs":
      return ["View Details"];
    case "Role & Permissions":
      return ["Edit Role", "Delete Role", "Assign Permissions"];
    case "Security Center":
      return ["Review", "Block User", "Reset Password"];
    default:
      return ["View", "Edit", "Delete"];
  }
};

const TableBadge = ({ value }) => <span className={`admin-badge-pill ${statusToneClass(value)}`}>{value}</span>;

const Breadcrumbs = ({ items }) => (
  <nav className="admin-breadcrumbs" aria-label="Breadcrumb">
    {items.map((item, index) => (
      <React.Fragment key={`${item}-${index}`}>
        <span className="admin-breadcrumbs__item">{item}</span>
        {index < items.length - 1 ? <span className="admin-breadcrumbs__separator">/</span> : null}
      </React.Fragment>
    ))}
  </nav>
);

const SummaryGrid = ({ cards }) => (
  <section className="admin-summary-grid" aria-label="Summary metrics">
    {cards.map((card) => (
      <article key={card.label} className="admin-summary-card">
        <span className="admin-summary-card__label">{card.label}</span>
        <strong className="admin-summary-card__value">{card.value}</strong>
        {card.delta ? <span className="admin-summary-card__delta">{card.delta}</span> : null}
      </article>
    ))}
  </section>
);

const TableSkeleton = () => (
  <div className="admin-skeleton-panel" aria-hidden="true">
    <div className="admin-skeleton admin-skeleton--title" />
    <div className="admin-skeleton admin-skeleton--bar" />
    <div className="admin-skeleton admin-skeleton--table" />
    <div className="admin-skeleton admin-skeleton--table" />
    <div className="admin-skeleton admin-skeleton--table" />
  </div>
);

const EmptyState = ({ title, message, onCreate }) => (
  <div className="admin-empty-state">
    <div className="admin-empty-state__icon">
      <i className="fas fa-folder-open" aria-hidden="true" />
    </div>
    <h3>{title}</h3>
    <p>{message}</p>
    {onCreate ? (
      <button type="button" className="admin-button admin-button--primary" onClick={onCreate}>
        Create New
      </button>
    ) : null}
  </div>
);

const ConfirmDialog = ({ open, title, message, confirmLabel = "Confirm", tone = "danger", onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="admin-modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="admin-confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="admin-confirm-dialog__icon">
          <i className="fas fa-exclamation-triangle" aria-hidden="true" />
        </div>
        <h3 id="confirm-title">{title}</h3>
        <p id="confirm-message">{message}</p>
        <div className="admin-confirm-dialog__actions">
          <button type="button" className="admin-button admin-button--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={`admin-button ${tone === "danger" ? "admin-button--danger" : "admin-button--primary"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const RecordModal = ({ open, title, fields, initialValue, onClose, onSave }) => {
  const [formState, setFormState] = useState(() => buildFormState(fields, initialValue));

  useEffect(() => {
    if (open) {
      setFormState(buildFormState(fields, initialValue));
    }
  }, [open, fields, initialValue]);

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(formState);
  };

  return (
    <div className="admin-modal-backdrop" role="presentation" onClick={onClose}>
      <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="record-modal-title" onClick={(event) => event.stopPropagation()}>
        <div className="admin-modal__header">
          <div>
            <p className="admin-modal__eyebrow">{titleCase(title)}</p>
            <h3 id="record-modal-title">{title}</h3>
          </div>
          <button type="button" className="admin-icon-button" onClick={onClose} aria-label="Close modal">
            <i className="fas fa-times" aria-hidden="true" />
          </button>
        </div>
        <form className="admin-modal__form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            {fields.map((field) => (
              <label key={field.key} className="admin-form-field">
                <span>{field.label}</span>
                {field.type === "select" ? (
                  <select
                    value={formState[field.key]}
                    onChange={(event) => setFormState((prev) => ({ ...prev, [field.key]: event.target.value }))}
                    aria-label={field.label}
                  >
                    <option value="">Select</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formState[field.key]}
                    onChange={(event) => setFormState((prev) => ({ ...prev, [field.key]: event.target.value }))}
                    placeholder={field.label}
                    aria-label={field.label}
                  />
                )}
              </label>
            ))}
          </div>
          <div className="admin-modal__actions">
            <button type="button" className="admin-button admin-button--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="admin-button admin-button--primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DataTable = ({ config, rows, onAction }) => {
  if (!rows.length) {
    return (
      <EmptyState
        title={`No ${config.title.toLowerCase()} found`}
        message="Use the create action to add a new record or adjust filters and search terms."
        onCreate={() => onAction("add")}
      />
    );
  }

  return (
    <div className="admin-table-card">
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              {config.columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {config.columns.map((column) => {
                  const value = row[column.key];
                  if (column.key === "status" || column.key === "license" || column.key === "severity") {
                    return (
                      <td key={column.key}>
                        <TableBadge value={value} />
                      </td>
                    );
                  }

                  return <td key={column.key}>{value}</td>;
                })}
                <td>
                  <div className="admin-row-actions">
                    {getRowActions(config.title).map((action) => (
                      <button
                        key={action}
                        type="button"
                        className="admin-row-actions__button"
                        onClick={() => onAction(action.toLowerCase(), row)}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Toolbar = ({ search, setSearch, filters, activeFilter, setActiveFilter, sortLabel, setSortLabel, onCreate }) => (
  <div className="admin-toolbar">
    <label className="admin-toolbar__search" aria-label="Search records">
      <i className="fas fa-search" aria-hidden="true" />
      <input type="search" placeholder="Search records" value={search} onChange={(event) => setSearch(event.target.value)} />
    </label>
    <div className="admin-toolbar__controls">
      {filters?.length ? (
        <select value={activeFilter} onChange={(event) => setActiveFilter(event.target.value)} aria-label="Filter records">
          {filters.map((filter) => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      ) : null}
      <select value={sortLabel} onChange={(event) => setSortLabel(event.target.value)} aria-label="Sort records">
        <option value="recent">Recent first</option>
        <option value="oldest">Oldest first</option>
        <option value="name">Name A-Z</option>
      </select>
      <button type="button" className="admin-button admin-button--primary" onClick={onCreate}>
        <i className="fas fa-plus" aria-hidden="true" />
        Create
      </button>
    </div>
  </div>
);

const paginate = (rows, page) => rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

export const AdminDashboardPage = () => {
  const { showToast } = useAdminPortal();
  const [activeWindow, setActiveWindow] = useState("weekly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  const chartData = useMemo(() => {
    if (activeWindow === "monthly") {
      return dashboardChartSeries.appointments.map((entry, index) => ({ ...entry, online: entry.online + index * 2, offline: entry.offline + index }));
    }
    if (activeWindow === "yearly") {
      return dashboardChartSeries.appointments.map((entry, index) => ({ ...entry, online: entry.online + index * 8, offline: entry.offline + index * 5 }));
    }
    return dashboardChartSeries.appointments;
  }, [activeWindow]);

  if (loading) {
    return (
      <section className="admin-page">
        <div className="admin-page__header">
          <Breadcrumbs items={["Dashboard", "Overview"]} />
          <h1>Dashboard</h1>
        </div>
        <TableSkeleton />
      </section>
    );
  }

  return (
    <section className="admin-page admin-page--dashboard">
      <div className="admin-page__header">
        <Breadcrumbs items={["Dashboard", "Overview"]} />
        <div className="admin-page__title-row">
          <div>
            <h1>Dashboard</h1>
            <p>Operational overview for doctors, patients, hospitals, staff, notices, and emergency operations.</p>
          </div>
          <div className="admin-page__actions">
            <button type="button" className="admin-button admin-button--ghost" onClick={() => showToast("Analytics refreshed")}>Refresh</button>
            <button type="button" className="admin-button admin-button--primary" onClick={() => showToast("Export report queued")}>Export Report</button>
          </div>
        </div>
      </div>

      <SummaryGrid cards={dashboardStats} />

      <div className="admin-dashboard__grid">
        <article className="admin-panel admin-panel--wide">
          <div className="admin-panel__header">
            <div>
              <h2>Appointment Analytics</h2>
              <p>Online and offline booking patterns across the week.</p>
            </div>
            <div className="admin-segmented-control" role="tablist" aria-label="Chart timeframe">
              {[
                { label: "Weekly", value: "weekly" },
                { label: "Monthly", value: "monthly" },
                { label: "Yearly", value: "yearly" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`admin-segmented-control__button ${activeWindow === item.value ? "is-active" : ""}`}
                  onClick={() => setActiveWindow(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="admin-chart-shell">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="online" fill="#0D9488" radius={[8, 8, 0, 0]} />
                <Bar dataKey="offline" fill="#14B8A6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <h2>Users Snapshot</h2>
              <p>Distribution of doctors, patients, and staff.</p>
            </div>
          </div>
          <div className="admin-chart-shell">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={dashboardChartSeries.users} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={4}>
                  {dashboardChartSeries.users.map((entry, index) => (
                    <Cell key={entry.name} fill={index === 0 ? "#0D9488" : index === 1 ? "#14B8A6" : "#0F766E"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <div className="admin-dashboard__grid admin-dashboard__grid--three">
        <article className="admin-panel">
          <div className="admin-panel__header"><h2>Recent Activities</h2></div>
          <div className="admin-activity-list">
            {dashboardActivities.map((item) => (
              <div key={item.title} className="admin-activity-item">
                <span className="admin-activity-item__dot" />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel__header"><h2>Upcoming Appointments</h2></div>
          <div className="admin-mini-table">
            {dashboardAppointments.map((appointment) => (
              <div key={appointment.id} className="admin-mini-table__row">
                <div>
                  <strong>{appointment.patient}</strong>
                  <span>{appointment.doctor}</span>
                </div>
                <div>
                  <strong>{appointment.time}</strong>
                  <span>{appointment.mode}</span>
                </div>
                <TableBadge value={appointment.status} />
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel__header"><h2>Quick Actions</h2></div>
          <div className="admin-quick-actions">
            {dashboardQuickActions.map((action) => (
              <button key={action.label} type="button" className="admin-quick-actions__button" onClick={() => showToast(`${action.label} started`)}>
                <i className={action.icon} aria-hidden="true" />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
          <div className="admin-analytics-cards">
            {dashboardAnalytics.map((metric) => (
              <div key={metric.label} className="admin-analytics-card">
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <p>{metric.helper}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
};

export const AdminModulePage = ({ moduleKey }) => {
  const config = moduleRegistry[moduleKey];
  const { showToast } = useAdminPortal();
  const [rows, setRows] = useState(config.rows);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState(config.filters?.[0]?.value || "all");
  const [sortLabel, setSortLabel] = useState("recent");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({ open: false, mode: "add", record: null });
  const [confirmState, setConfirmState] = useState({ open: false, action: null, record: null, message: "" });

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, [moduleKey]);

  useEffect(() => {
    setPage(1);
  }, [search, activeFilter, sortLabel]);

  const filteredRows = useMemo(() => {
    let nextRows = [...rows];

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      nextRows = nextRows.filter((row) => getSearchableBlob(row).includes(query));
    }

    if (activeFilter !== "all") {
      nextRows = nextRows.filter((row) =>
        Object.values(row).some((value) => String(value).toLowerCase().includes(activeFilter))
      );
    }

    if (sortLabel === "name") {
      nextRows.sort((a, b) => String(a.name || a.title || a.report || "").localeCompare(String(b.name || b.title || b.report || "")));
    } else if (sortLabel === "oldest") {
      nextRows.sort((a, b) => String(a.id).localeCompare(String(b.id)));
    } else {
      nextRows.sort((a, b) => String(b.id).localeCompare(String(a.id)));
    }

    return nextRows;
  }, [rows, search, activeFilter, sortLabel]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const visibleRows = paginate(filteredRows, page);

  const notify = (message) => showToast(message);

  const handleEdit = (record) => {
    setModalState({ open: true, mode: "edit", record });
  };

  const handleAdd = () => {
    setModalState({ open: true, mode: "add", record: null });
  };

  const handleAction = (action, record = null) => {
    if (action === "add") {
      handleAdd();
      return;
    }

    if (action === "edit") {
      handleEdit(record);
      return;
    }

    if (action === "delete" || action === "delete role") {
      setConfirmState({
        open: true,
        action,
        record,
        message: `Delete ${record?.name || record?.title || record?.report || record?.role || record?.subject || "this record"}?`,
      });
      return;
    }

    if (action === "suspend") {
      setRows((prev) => prev.map((row) => (row.id === record.id ? { ...row, status: "Suspended" } : row)));
      notify(`${record.name || record.title} suspended`);
      return;
    }

    if (action === "block") {
      setRows((prev) => prev.map((row) => (row.id === record.id ? { ...row, status: "Blocked" } : row)));
      notify(`${record.name || record.title} blocked`);
      return;
    }

    if (action === "unblock") {
      setRows((prev) => prev.map((row) => (row.id === record.id ? { ...row, status: "Unblocked" } : row)));
      notify(`${record.name || record.title} unblocked`);
      return;
    }

    if (action === "verify medical license") {
      setRows((prev) => prev.map((row) => (row.id === record.id ? { ...row, license: "Verified" } : row)));
      notify(`${record.name} license verified`);
      return;
    }

    if (action === "approve") {
      setRows((prev) => prev.map((row) => (row.id === record.id ? { ...row, status: "Approved" } : row)));
      notify("Appointment approved");
      return;
    }

    if (action === "cancel") {
      setRows((prev) => prev.map((row) => (row.id === record.id ? { ...row, status: "Cancelled" } : row)));
      notify("Appointment cancelled");
      return;
    }

    if (action === "reschedule") {
      setRows((prev) => prev.map((row) => (row.id === record.id ? { ...row, status: "Rescheduled" } : row)));
      notify("Appointment rescheduled");
      return;
    }

    if (action === "publish") {
      setRows((prev) => prev.map((row) => (row.id === record.id ? { ...row, status: "Published" } : row)));
      notify(`${record.title || record.type} published`);
      return;
    }

    if (action === "archive") {
      setRows((prev) => prev.map((row) => (row.id === record.id ? { ...row, status: "Archived" } : row)));
      notify("Item archived");
      return;
    }

    if (action === "schedule") {
      setRows((prev) => prev.map((row) => (row.id === record.id ? { ...row, status: "Scheduled" } : row)));
      notify("Item scheduled");
      return;
    }

    if (action === "resolve") {
      setRows((prev) => prev.map((row) => (row.id === record.id ? { ...row, status: "Resolved" } : row)));
      notify("Complaint resolved");
      return;
    }

    if (action === "close") {
      setRows((prev) => prev.map((row) => (row.id === record.id ? { ...row, status: "Closed" } : row)));
      notify("Ticket closed");
      return;
    }

    if (action === "assign complaint" || action === "assign doctor" || action === "review" || action === "view profile" || action === "view medical history" || action === "appointment history" || action === "view details") {
      notify(`${titleCase(action)} opened`);
      return;
    }

    if (action === "activate") {
      setRows((prev) => prev.map((row) => (row.id === record.id ? { ...row, status: "Active" } : row)));
      notify("Hospital activated");
      return;
    }

    if (action === "deactivate") {
      setRows((prev) => prev.map((row) => (row.id === record.id ? { ...row, status: "Inactive" } : row)));
      notify("Hospital deactivated");
      return;
    }

    if (action === "send") {
      setRows((prev) => prev.map((row) => (row.id === record.id ? { ...row, status: "Sent" } : row)));
      notify("Notification sent");
      return;
    }

    if (action === "reset password") {
      notify("Password reset request queued");
      return;
    }

    if (action === "assign permissions") {
      notify("Permission matrix opened");
      return;
    }

    if (action === "edit role") {
      handleEdit(record);
      return;
    }

    notify(`${titleCase(action)} action completed`);
  };

  const handleModalSave = (formState) => {
    if (modalState.mode === "edit" && modalState.record) {
      setRows((prev) =>
        prev.map((row) => (row.id === modalState.record.id ? { ...row, ...formState } : row))
      );
      notify(`${config.title} updated`);
    } else {
      const nextRecord = {
        id: buildRecordId(config.title),
        ...formState,
      };
      setRows((prev) => [nextRecord, ...prev]);
      notify(`${config.title} created`);
    }

    setModalState({ open: false, mode: "add", record: null });
  };

  const handleConfirm = () => {
    if (!confirmState.record) return;
    setRows((prev) => prev.filter((row) => row.id !== confirmState.record.id));
    notify(`${config.title} record deleted`);
    setConfirmState({ open: false, action: null, record: null, message: "" });
  };

  if (loading) {
    return (
      <section className="admin-page">
        <div className="admin-page__header">
          <Breadcrumbs items={config.breadcrumb} />
          <h1>{config.title}</h1>
        </div>
        <TableSkeleton />
      </section>
    );
  }

  if (config.variant === "analytics") {
    return <AnalyticsPage config={config} rows={rows} onCreate={handleAdd} />;
  }

  if (config.variant === "settings") {
    return <SettingsPage config={config} />;
  }

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <Breadcrumbs items={config.breadcrumb} />
        <div className="admin-page__title-row">
          <div>
            <h1>{config.title}</h1>
            <p>{config.subtitle}</p>
          </div>
          <div className="admin-page__actions">
            <button type="button" className="admin-button admin-button--ghost" onClick={() => notify(`${config.title} refreshed`)}>
              Refresh
            </button>
            <button type="button" className="admin-button admin-button--primary" onClick={handleAdd}>
              <i className="fas fa-plus" aria-hidden="true" />
              Add {config.title.replace("Hospital Management", "Hospital").replace("Health Notices", "Notice")}
            </button>
          </div>
        </div>
      </div>

      <SummaryGrid cards={config.summaryCards} />

      <Toolbar
        search={search}
        setSearch={setSearch}
        filters={config.filters}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        sortLabel={sortLabel}
        setSortLabel={setSortLabel}
        onCreate={handleAdd}
      />

      <DataTable config={config} rows={visibleRows} onAction={handleAction} />

      <div className="admin-pagination" aria-label="Pagination">
        <span className="admin-pagination__summary">
          Showing {filteredRows.length ? (page - 1) * PAGE_SIZE + 1 : 0}-{Math.min(page * PAGE_SIZE, filteredRows.length)} of {filteredRows.length}
        </span>
        <div className="admin-pagination__buttons">
          <button type="button" className="admin-button admin-button--ghost" disabled={page === 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
            Previous
          </button>
          <span className="admin-pagination__page">Page {page} of {totalPages}</span>
          <button type="button" className="admin-button admin-button--ghost" disabled={page === totalPages} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}>
            Next
          </button>
        </div>
      </div>

      <RecordModal
        open={modalState.open}
        title={modalState.mode === "edit" ? `Edit ${config.title.replace("Management", "").trim()}` : `Add ${config.title.replace("Management", "").trim()}`}
        fields={config.formFields || []}
        initialValue={modalState.record}
        onClose={() => setModalState({ open: false, mode: "add", record: null })}
        onSave={handleModalSave}
      />

      <ConfirmDialog
        open={confirmState.open}
        title={`Delete ${config.title.replace("Management", "").trim()} Record`}
        message={confirmState.message}
        confirmLabel="Delete"
        tone="danger"
        onCancel={() => setConfirmState({ open: false, action: null, record: null, message: "" })}
        onConfirm={handleConfirm}
      />
    </section>
  );
};

const AnalyticsPage = ({ config, rows, onCreate }) => {
  const { showToast } = useAdminPortal();
  const diseaseTrend = [
    { name: "Mon", cases: 24, predictions: 18 },
    { name: "Tue", cases: 34, predictions: 28 },
    { name: "Wed", cases: 29, predictions: 22 },
    { name: "Thu", cases: 41, predictions: 33 },
    { name: "Fri", cases: 46, predictions: 37 },
    { name: "Sat", cases: 38, predictions: 31 },
    { name: "Sun", cases: 52, predictions: 43 },
  ];

  const weatherTrend = [
    { name: "6 AM", temp: 26, aqi: 132 },
    { name: "9 AM", temp: 29, aqi: 149 },
    { name: "12 PM", temp: 34, aqi: 176 },
    { name: "3 PM", temp: 36, aqi: 182 },
    { name: "6 PM", temp: 33, aqi: 168 },
    { name: "9 PM", temp: 30, aqi: 155 },
  ];

  const reportCards = [
    { label: "PDF exports", value: "8" },
    { label: "Excel exports", value: "6" },
    { label: "CSV exports", value: "4" },
    { label: "Scheduled jobs", value: "3" },
  ];

  const isDisease = config.title === "Disease Analytics";
  const isWeather = config.title === "Weather Monitoring";

  return (
    <section className="admin-page admin-page--analytics">
      <div className="admin-page__header">
        <Breadcrumbs items={config.breadcrumb} />
        <div className="admin-page__title-row">
          <div>
            <h1>{config.title}</h1>
            <p>{config.subtitle}</p>
          </div>
          <div className="admin-page__actions">
            <button type="button" className="admin-button admin-button--ghost" onClick={() => showToast(`${config.title} refreshed`)}>Refresh</button>
            <button type="button" className="admin-button admin-button--primary" onClick={onCreate}>Create</button>
          </div>
        </div>
      </div>

      <SummaryGrid cards={config.summaryCards} />

      {isDisease ? (
        <div className="admin-dashboard__grid">
          <article className="admin-panel admin-panel--wide">
            <div className="admin-panel__header"><h2>Disease Trend Charts</h2></div>
            <div className="admin-chart-shell">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={diseaseTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cases" stroke="#0D9488" strokeWidth={3} />
                  <Line type="monotone" dataKey="predictions" stroke="#14B8A6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>
          <article className="admin-panel">
            <div className="admin-panel__header"><h2>High Risk Locations</h2></div>
            <div className="admin-rank-list">
              {rows.map((row) => (
                <div key={row.id} className="admin-rank-list__item">
                  <div>
                    <strong>{row.location}</strong>
                    <span>{row.disease}</span>
                  </div>
                  <TableBadge value={row.risk} />
                </div>
              ))}
            </div>
          </article>
        </div>
      ) : null}

      {isWeather ? (
        <div className="admin-dashboard__grid">
          <article className="admin-panel admin-panel--wide">
            <div className="admin-panel__header"><h2>Weather Forecast</h2></div>
            <div className="admin-chart-shell">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={weatherTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temp" stroke="#0D9488" strokeWidth={3} />
                  <Line type="monotone" dataKey="aqi" stroke="#F59E0B" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>
          <article className="admin-panel">
            <div className="admin-panel__header"><h2>Weather Alerts</h2></div>
            <div className="admin-rank-list">
              {rows.map((row) => (
                <div key={row.id} className="admin-rank-list__item">
                  <div>
                    <strong>{row.metric}</strong>
                    <span>{row.state}</span>
                  </div>
                  <TableBadge value={row.status} />
                </div>
              ))}
            </div>
          </article>
        </div>
      ) : null}

      {config.title === "Reports" ? (
        <div className="admin-dashboard__grid">
          <article className="admin-panel admin-panel--wide">
            <div className="admin-panel__header"><h2>Export Options</h2></div>
            <div className="admin-quick-actions admin-quick-actions--grid">
              {["PDF", "Excel", "CSV"].map((format) => (
                <button key={format} type="button" className="admin-quick-actions__button" onClick={() => showToast(`${format} export generated`)}>
                  <i className="fas fa-file-export" aria-hidden="true" />
                  <span>Export {format}</span>
                </button>
              ))}
            </div>
          </article>
          <article className="admin-panel">
            <div className="admin-panel__header"><h2>Report Library</h2></div>
            <div className="admin-rank-list">
              {rows.map((row) => (
                <div key={row.id} className="admin-rank-list__item">
                  <div>
                    <strong>{row.report}</strong>
                    <span>{row.updated}</span>
                  </div>
                  <TableBadge value={row.status} />
                </div>
              ))}
            </div>
          </article>
        </div>
      ) : null}

      <div className="admin-dashboard__grid admin-dashboard__grid--three">
        <article className="admin-panel">
          <div className="admin-panel__header"><h2>Weekly Analytics</h2></div>
          <div className="admin-analytics-cards">
            {dashboardAnalytics.map((metric) => (
              <div key={metric.label} className="admin-analytics-card">
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <p>{metric.helper}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel__header"><h2>Monthly Analytics</h2></div>
          <div className="admin-analytics-cards">
            {reportCards.map((metric) => (
              <div key={metric.label} className="admin-analytics-card">
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <p>Generated in the last 30 days</p>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel__header"><h2>Yearly Analytics</h2></div>
          <div className="admin-analytics-cards">
            {config.summaryCards.map((metric) => (
              <div key={metric.label} className="admin-analytics-card">
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <p>Yearly view of {config.title.toLowerCase()}</p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <DataTable config={{ ...config, columns: config.rows?.[0] ? Object.keys(config.rows[0]).filter((key) => key !== "id").map((key) => ({ key, label: titleCase(key) })) : config.columns || [] }} rows={rows.slice(0, 4)} onAction={() => {}} />
    </section>
  );
};

const SettingsPage = ({ config }) => {
  const { showToast } = useAdminPortal();

  return (
    <section className="admin-page admin-page--settings">
      <div className="admin-page__header">
        <Breadcrumbs items={config.breadcrumb} />
        <div className="admin-page__title-row">
          <div>
            <h1>{config.title}</h1>
            <p>{config.subtitle}</p>
          </div>
          <div className="admin-page__actions">
            <button type="button" className="admin-button admin-button--ghost" onClick={() => showToast("Settings editor opened") }>
              Add Setting
            </button>
            <button type="button" className="admin-button admin-button--primary" onClick={() => showToast("Settings saved") }>
              Save Settings
            </button>
          </div>
        </div>
      </div>

      <SummaryGrid cards={config.summaryCards} />

      <div className="admin-dashboard__grid">
        <article className="admin-panel admin-panel--wide">
          <div className="admin-panel__header"><h2>Configuration Areas</h2></div>
          <div className="admin-settings-grid">
            {config.sections.map((section) => (
              <section key={section.title} className="admin-settings-card">
                <div className="admin-settings-card__header">
                  <div>
                    <h3>{section.title}</h3>
                    <p>{section.description}</p>
                  </div>
                  <button type="button" className="admin-button admin-button--ghost">Edit</button>
                </div>
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel__header"><h2>Current Settings</h2></div>
          <div className="admin-rank-list">
            {config.rows.map((row) => (
              <div key={row.id} className="admin-rank-list__item">
                <div>
                  <strong>{row.setting}</strong>
                  <span>{row.value}</span>
                </div>
                <TableBadge value={row.status} />
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
};
