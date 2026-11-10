import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import UserTable from "../../components/UserTable";
import UserForm from "../../components/UserForm";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/userService";
import { downloadCsv } from "../../services/downloadService";

const getErrorMessage = (error) =>
  error.response?.data?.message ?? error.message ?? "The request could not be completed.";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    Promise.resolve()
      .then(() => getUsers())
      .then(setUsers)
      .catch((loadError) => setError(getErrorMessage(loadError)))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (userData) => {
    try {
      if (selectedUser) {
        const updatedUser = await updateUser(selectedUser._id ?? selectedUser.id, userData);
        setUsers((currentUsers) => currentUsers.map((user) =>
          (user._id ?? user.id) === (updatedUser._id ?? updatedUser.id) ? updatedUser : user
        ));
        setSelectedUser(null);
        setNotice("User details updated.");
      } else {
        const createdUser = await createUser(userData);
        setUsers((currentUsers) => [createdUser, ...currentUsers]);
        setNotice("User added successfully.");
      }
      setError("");
    } catch (saveError) {
      setError(getErrorMessage(saveError));
      throw saveError;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This action cannot be undone.")) return;
    try {
      await deleteUser(id);
      setUsers((currentUsers) => currentUsers.filter((user) => (user._id ?? user.id) !== id));
      setNotice("User deleted.");
      setError("");
      if ((selectedUser?._id ?? selectedUser?.id) === id) setSelectedUser(null);
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(normalizedSearch) &&
    (roleFilter === "All roles" || (user.role ?? "Viewer") === roleFilter) &&
    (statusFilter === "All statuses" || (user.status ?? "Active") === statusFilter)
  );
  const activeUsers = users.filter((user) => (user.status ?? "Active") === "Active").length;
  const pendingUsers = users.filter((user) => (user.status ?? "Active") === "Pending").length;
  const roleCounts = [...users.reduce((counts, user) => {
    const role = user.role ?? "Viewer";
    counts.set(role, (counts.get(role) ?? 0) + 1);
    return counts;
  }, new Map())]
    .map(([role, count]) => ({ role, count }))
    .sort((first, second) => first.role.localeCompare(second.role));
  const statusCounts = ["Active", "Pending", "Inactive"].map((status) => ({
    status,
    count: users.filter((user) => (user.status ?? "Active") === status).length,
  }));

  const exportUsers = () => {
    const rows = [
      ["Name", "Email", "Role", "Status", "Date added"],
      ...filteredUsers.map((user) => [
        user.name,
        user.email,
        user.role ?? "Viewer",
        user.status ?? "Active",
        user.createdAt ?? user.joinedAt ?? "",
      ]),
    ];
    downloadCsv("adminpro-users.csv", rows);
  };

  return (
    <>
      <Navbar />
      <section className="page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Workspace</p>
            <h2>User dashboard</h2>
            <p className="page-description">Understand your team and manage workspace access.</p>
          </div>
          <div className="heading-actions">
            <button className="button button-secondary" type="button" onClick={exportUsers}>Export CSV</button>
          </div>
        </div>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        {notice && <div className="alert alert-success" role="status">{notice}</div>}
        {!loading && !error && (
          <>
            <div className="stats user-dashboard-stats">
              <article className="card stat-card">
                <div className="stat-card-top">
                  <p>Total users</p>
                  <span className="stat-icon" aria-hidden="true">♙</span>
                </div>
                <strong className="stat-value">{users.length}</strong>
                <small>Across all workspace roles</small>
              </article>
              <article className="card stat-card">
                <div className="stat-card-top">
                  <p>Active users</p>
                  <span className="stat-icon user-stat-icon-active" aria-hidden="true">✓</span>
                </div>
                <strong className="stat-value">{activeUsers}</strong>
                <small>With current workspace access</small>
              </article>
              <article className="card stat-card">
                <div className="stat-card-top">
                  <p>Pending invitations</p>
                  <span className="stat-icon user-stat-icon-pending" aria-hidden="true">…</span>
                </div>
                <strong className="stat-value">{pendingUsers}</strong>
                <small>Awaiting account activation</small>
              </article>
              <article className="card stat-card">
                <div className="stat-card-top">
                  <p>Roles in use</p>
                  <span className="stat-icon" aria-hidden="true">◇</span>
                </div>
                <strong className="stat-value">{roleCounts.length}</strong>
                <small>Different access levels</small>
              </article>
            </div>
            <div className="user-insights">
              <section className="card user-insight" aria-labelledby="role-breakdown-heading">
                <div className="user-insight-heading">
                  <div>
                    <h3 id="role-breakdown-heading">Role distribution</h3>
                    <p>How access is assigned across your team.</p>
                  </div>
                  <span className="count-badge">{users.length} users</span>
                </div>
                {roleCounts.length === 0 ? (
                  <p className="user-insight-empty">Add users to see your role distribution.</p>
                ) : (
                  <div className="user-breakdown-list">
                    {roleCounts.map(({ role, count }) => (
                      <div className="user-breakdown-row" key={role}>
                        <span className="user-breakdown-label">{role}</span>
                        <div
                          className="user-breakdown-track"
                          role="img"
                          aria-label={`${role}: ${count} of ${users.length} users`}
                        >
                          <span style={{ width: `${(count / users.length) * 100}%` }} />
                        </div>
                        <strong>{count}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </section>
              <section className="card user-insight" aria-labelledby="status-breakdown-heading">
                <div className="user-insight-heading">
                  <div>
                    <h3 id="status-breakdown-heading">Account status</h3>
                    <p>Current access and invitation state.</p>
                  </div>
                </div>
                <div className="user-breakdown-list">
                  {statusCounts.map(({ status, count }) => (
                    <div className="user-breakdown-row" key={status}>
                      <span className="user-breakdown-label">{status}</span>
                      <div
                        className={`user-breakdown-track user-breakdown-track-${status.toLowerCase()}`}
                        role="img"
                        aria-label={`${status}: ${count} of ${users.length} users`}
                      >
                        <span style={{ width: users.length ? `${(count / users.length) * 100}%` : "0%" }} />
                      </div>
                      <strong>{count}</strong>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}
        <div className="users-layout">
          <section className="panel users-panel">
            <div className="panel-heading">
              <div className="users-toolbar">
                <div>
                  <h3>All users <span className="count-badge">{filteredUsers.length} / {users.length}</span></h3>
                  <p>Search and filter people in your workspace.</p>
                </div>
                <div className="user-filters">
                  <label className="search-field">
                    <span className="visually-hidden">Search by name or email</span>
                    <input
                      name="userSearch"
                      type="search"
                      placeholder="Search users..."
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </label>
                  <label>
                    <span className="visually-hidden">Filter by role</span>
                    <select name="roleFilter" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
                      <option>All roles</option>
                      <option>Administrator</option>
                      <option>Editor</option>
                      <option>Viewer</option>
                    </select>
                  </label>
                  <label>
                    <span className="visually-hidden">Filter by status</span>
                    <select name="statusFilter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                      <option>All statuses</option>
                      <option>Active</option>
                      <option>Pending</option>
                      <option>Inactive</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
            {loading ? <div className="empty-state">Loading users...</div> : (
              <UserTable
                users={filteredUsers}
                onEdit={setSelectedUser}
                onDelete={handleDelete}
              />
            )}
          </section>
          <section className="panel form-panel">
            <div className="panel-heading">
              <div>
                <h3>{selectedUser ? "Edit user" : "Add a user"}</h3>
                <p>{selectedUser ? "Update this user’s contact details." : "Invite someone to your workspace."}</p>
              </div>
            </div>
            <UserForm
              key={selectedUser?._id ?? selectedUser?.id ?? "new"}
              selectedUser={selectedUser}
              onSave={handleSave}
              onCancel={() => setSelectedUser(null)}
            />
          </section>
        </div>
      </section>
    </>
  );
}
