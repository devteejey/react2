const STORAGE_KEY = "admin-dashboard-users";

const starterUsers = [
  {
    _id: "user-1",
    name: "Olivia Rhye",
    email: "olivia@example.com",
    role: "Administrator",
    status: "Active",
    joinedAt: "2026-06-04",
  },
  {
    _id: "user-2",
    name: "Phoenix Baker",
    email: "phoenix@example.com",
    role: "Editor",
    status: "Active",
    joinedAt: "2026-06-12",
  },
  {
    _id: "user-3",
    name: "Lana Steiner",
    email: "lana@example.com",
    role: "Viewer",
    status: "Pending",
    joinedAt: "2026-06-18",
  },
  {
    _id: "user-4",
    name: "Demi Wilkinson",
    email: "demi@example.com",
    role: "Editor",
    status: "Active",
    joinedAt: "2026-07-02",
  },
  {
    _id: "user-5",
    name: "Candice Wu",
    email: "candice@example.com",
    role: "Viewer",
    status: "Inactive",
    joinedAt: "2026-07-11",
  },
];

function readUsers() {
  const storedUsers = localStorage.getItem(STORAGE_KEY);
  if (storedUsers === null) {
    saveUsers(starterUsers);
    return starterUsers.map((user) => ({ ...user }));
  }

  try {
    const users = JSON.parse(storedUsers);
    if (!Array.isArray(users)) throw new Error("Saved user data is not a list.");
    return users;
  } catch (error) {
    console.error("Unable to read saved users:", error);
    throw new Error("Saved user data is damaged. Clear the dashboard data and try again.", { cause: error });
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `user-${Date.now()}`;
}

export function getUsers() {
  return readUsers();
}

export function resetDemoUsers() {
  const users = starterUsers.map((user) => ({ ...user }));
  saveUsers(users);
  return users;
}

export function createUser(data) {
  const users = readUsers();
  const email = data.email.trim().toLowerCase();
  if (users.some((user) => user.email.toLowerCase() === email)) {
    throw new Error("A user with this email address already exists.");
  }

  const user = {
    _id: createId(),
    name: data.name.trim(),
    email,
    role: data.role,
    status: data.status,
    joinedAt: new Date().toISOString().slice(0, 10),
  };
  saveUsers([user, ...users]);
  return user;
}

export function updateUser(id, data) {
  const users = readUsers();
  const email = data.email.trim().toLowerCase();
  if (users.some((user) => user._id !== id && user.email.toLowerCase() === email)) {
    throw new Error("A user with this email address already exists.");
  }

  let updatedUser;
  const nextUsers = users.map((user) => {
    if (user._id !== id) return user;
    updatedUser = {
      ...user,
      name: data.name.trim(),
      email,
      role: data.role,
      status: data.status,
    };
    return updatedUser;
  });

  if (!updatedUser) throw new Error("This user could not be found. Refresh the page and try again.");
  saveUsers(nextUsers);
  return updatedUser;
}

export function deleteUser(id) {
  const users = readUsers();
  if (!users.some((user) => user._id === id)) {
    throw new Error("This user could not be found. Refresh the page and try again.");
  }
  saveUsers(users.filter((user) => user._id !== id));
}
