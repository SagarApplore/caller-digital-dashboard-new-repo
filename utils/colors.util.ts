const colors = {
  getStatusColor: (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-700 bg-green-100";
      case "At Risk":
      case "Pending":
        return "text-orange-700 bg-orange-100";
      default:
        return "text-red-700 bg-red-100";
    }
  },

  getRoleColor: (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "text-red-700 bg-red-100";
      case "developer":
        return "text-blue-700 bg-blue-100";
      case "analyst":
        return "text-purple-700 bg-purple-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  },
};

export default colors;
