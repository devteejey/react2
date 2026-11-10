
import {
  ArrowUpDown,
  Edit,
  Trash2,
//   Check,
//   Minus,
} from "lucide-react";

export default function DataTable({
  users,
  selectedUsers,
  onSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onSort,
//   sortConfig,
}) {
  const allSelected =
    users.length > 0 &&
    users.every((user) => selectedUsers.includes(user._id));

  return (
    <div className="table-wrapper">
      <table className="users-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
              />
            </th>

            {["name", "email", "role", "status"].map((field) => (
              <th key={field}>
                <button
                  className="sort-button"
                  onClick={() => onSort(field)}
                >
                  {field.toUpperCase()}
                  <ArrowUpDown size={14} />
                </button>
              </th>
            ))}

            <th>JOINED</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => onSelect(user._id)}
                />
              </td>

              <td>
                <div className="user-name">
                  <div className="avatar">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  {user.name}
                </div>
              </td>

              <td>{user.email}</td>

              <td>
                <span className="role-badge">
                  {user.role || "User"}
                </span>
              </td>

              <td>
                <span
                  className={`status-badge ${
                    user.status === "Inactive"
                      ? "inactive"
                      : "active-status"
                  }`}
                >
                  {user.status || "Active"}
                </span>
              </td>

              <td>
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "—"}
              </td>

              <td>
                <div className="action-buttons">
                  <button
                    className="edit-button"
                    onClick={() => onEdit(user)}
                    title="Edit user"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => onDelete(user._id)}
                    title="Delete user"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan="7" className="empty-table">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
