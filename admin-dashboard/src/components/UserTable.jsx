import { Link } from "react-router-dom";

export default function UserTable({
  users,
  onEdit,
  onDelete,
}) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
            <th scope="col">Status</th>
            <th scope="col">Date added</th>
            <th scope="col" className="actions-heading">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td className="table-empty" colSpan={5}>No users match your search.</td>
            </tr>
          ) : users.map((user) => (
            <tr key={user._id ?? user.id}>
              <td>
                <div className="user-cell">
                  <span className="avatar" aria-hidden="true">
                    {user.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}
                  </span>
                  <span>
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </span>
                </div>
              </td>
              <td>{user.role ?? "Viewer"}</td>
              <td><span className={`status status-${(user.status ?? "Active").toLowerCase()}`}>{user.status ?? "Active"}</span></td>
              <td>{user.createdAt || user.joinedAt ? new Date(user.createdAt ?? `${user.joinedAt}T00:00:00`).toLocaleDateString() : "—"}</td>
              <td className="row-actions">
                <Link className="button button-quiet" to={`/users/${user._id ?? user.id}`}>View</Link>
                <button className="button button-quiet" type="button" onClick={() => onEdit(user)}>Edit</button>
                <button className="button button-quiet button-danger" type="button" onClick={() => onDelete(user._id ?? user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}