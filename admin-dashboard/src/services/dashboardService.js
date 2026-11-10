import { getUsers } from "./userService";

export function getDashboardStats() {
  const users = getUsers();
  const recentUsers = [...users]
    .sort((first, second) =>
      (second.joinedAt ?? second.createdAt ?? "").localeCompare(first.joinedAt ?? first.createdAt ?? "")
    )
    .slice(0, 4);

  return {
    stats: {
      totalUsers: users.length,
      activeUsers: users.filter((user) => (user.status ?? "Active") === "Active").length,
      pendingUsers: users.filter((user) => user.status === "Pending").length,
      inactiveUsers: users.filter((user) => user.status === "Inactive").length,
      newUsers: users.filter((user) => {
        const joinedAt = user.joinedAt ?? user.createdAt;
        if (!joinedAt) return false;
        const ageInDays = (Date.now() - new Date(joinedAt).getTime()) / (1000 * 60 * 60 * 24);
        return ageInDays >= 0 && ageInDays <= 30;
      }).length,
    },
    recentUsers,
  };
}

const dashboardService = {
  getDashboardData: getDashboardStats,
  getDashboardStats,
};

export default dashboardService;
