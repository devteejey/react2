import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getUsers } from "../../services/userService";

export default function UserDetails() {
  const { userId } = useParams();
  const { user, error } = useMemo(() => {
    try {
      const users = getUsers();
      const foundUser = users.find((item) => (item._id ?? item.id) === userId);
      return { user: foundUser ?? null, error: "" };
    } catch (loadError) {
      console.error("Unable to load user details:", loadError);
      return { user: null, error: loadError.message || "User details could not be loaded." };
    }
  }, [userId]);

  return (
    <>
      <Navbar />
      <section className="page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Workspace / Users</p>
            <h2>User details</h2>
            <p className="page-description">View this user's workspace access and account information.</p>
          </div>
          <Link className="button button-secondary" to="/users">Back to users</Link>
        </div>

        {error ? (
          <div className="alert alert-error" role="alert">{error}</div>
        ) : !user ? (
          <div className="panel user-detail-empty">
            <h3>User not found</h3>
            <p>This user may have been removed from the workspace.</p>
            <Link className="button button-primary" to="/users">Return to users</Link>
          </div>
        ) : (
          <section className="panel user-detail-card" aria-labelledby="user-detail-name">
            <div className="user-detail-identity">
              <span className="avatar user-detail-avatar" aria-hidden="true">
                {user.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}
              </span>
              <div>
                <h3 id="user-detail-name">{user.name}</h3>
                <p>{user.email}</p>
              </div>
              <span className={`status status-${(user.status ?? "Active").toLowerCase()}`}>
                {user.status ?? "Active"}
              </span>
            </div>
            <dl className="user-detail-fields">
              <div>
                <dt>Role</dt>
                <dd>{user.role ?? "Viewer"}</dd>
              </div>
              <div>
                <dt>Account status</dt>
                <dd>{user.status ?? "Active"}</dd>
              </div>
              <div>
                <dt>Date added</dt>
                <dd>
                  {user.createdAt || user.joinedAt
                    ? new Date(user.createdAt ?? `${user.joinedAt}T00:00:00`).toLocaleDateString()
                    : "Not available"}
                </dd>
              </div>
              <div>
                <dt>Email address</dt>
                <dd>{user.email}</dd>
              </div>
            </dl>
          </section>
        )}
      </section>
    </>
  );
}
