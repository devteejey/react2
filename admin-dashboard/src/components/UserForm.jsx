import { useState } from "react";

export default function UserForm({
  selectedUser,
  onSave,
  onCancel,
}) {
  const [name, setName] = useState(selectedUser?.name ?? "");
  const [email, setEmail] = useState(selectedUser?.email ?? "");
  const [role, setRole] = useState(selectedUser?.role ?? "Viewer");
  const [status, setStatus] = useState(selectedUser?.status ?? "Active");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await onSave({ name: name.trim(), email: email.trim(), role, status });
      if (!selectedUser) {
        setName("");
        setEmail("");
        setRole("Viewer");
        setStatus("Active");
      }
    } catch (saveError) {
      setError(saveError.message || "The user could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <label>
        Full name
        <input
          name="name"
          type="text"
          placeholder="e.g. Alex Morgan"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={80}
        />
      </label>
      <label>
        Email address
        <input
          name="email"
          type="email"
          placeholder="alex@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={254}
        />
      </label>
      <div className="form-two-columns">
        <label>
          Role
          <select name="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Administrator</option>
            <option>Editor</option>
            <option>Viewer</option>
          </select>
        </label>
        <label>
          Status
          <select name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Active</option>
            <option>Pending</option>
            <option>Inactive</option>
          </select>
        </label>
      </div>
      <div className="form-actions">
        <button className="button button-primary" type="submit" disabled={saving}>
          {saving ? "Saving..." : selectedUser ? "Save changes" : "Add user"}
        </button>
        {selectedUser && (
          <button className="button button-secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}