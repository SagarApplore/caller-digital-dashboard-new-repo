const availableColors = [
  "bg-green-200 text-green-700",
  "bg-yellow-200 text-yellow-700",
  "bg-red-200 text-red-700",
  "bg-blue-200 text-blue-700",
  "bg-purple-200 text-purple-700",
  "bg-pink-200 text-pink-700",
];

const colors = {
  getStatusColor: (status: string | boolean) => {
    if (typeof status === "boolean") {
      return status ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100";
    } else {
      switch (status) {
        case "Active":
        case "processed":
          return "text-green-700 bg-green-100";
        case "At Risk":
        case "Pending":
        case "processing":
          return "text-orange-700 bg-orange-100";
        default:
          return "text-red-700 bg-red-100";
      }
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

  getStatusColorByNumber: (number: number) => {
    if (number >= 90) {
      return "bg-green-500";
    } else if (number >= 70) {
      return "bg-yellow-500";
    } else {
      return "bg-red-500";
    }
  },

  getRandomColor: () => {
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  },
};

export default colors;
