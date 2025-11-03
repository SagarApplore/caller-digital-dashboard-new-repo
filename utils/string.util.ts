import moment from "moment";

const string = {
  formatNumber: (number: number) => number.toLocaleString(),
  formatPercentage: (number: number) => `${number.toFixed(2)}%`,
  formatCurrency: (number: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(number),
  joinStrings: (strings: string[]) => {
    if (strings.length === 1) {
      return strings[0];
    }
    return strings.join(", ");
  },
  formatNumberAccToType: (
    number: number,
    type: "number" | "percentage" | "ratio"
  ) => {
    switch (type) {
      case "number":
        return number.toLocaleString();
      case "percentage":
        return `${number.toFixed(2)}%`;
      case "ratio":
        return number;
      default:
        return number;
    }
  },
  formatTime: (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  },
  getInitials: (name: string) => {
    if (!name || typeof name !== 'string') {
      return '';
    }
    const nameParts = name.split(" ");
    return nameParts.map((part) => part[0]).join("");
  },

  formatDuration: (duration: number) => {
    

// const minutes = Math.floor(duration/60);
// const seconds = Math.round((duration - minutes) * 60);
const durationMinutes = Math.floor(duration / 60);
      const durationSeconds = duration % 60;

return (`${durationMinutes}m ${durationSeconds}s`);

   
  },
  formatDateTime: (date: string) => {
    // Assumes moment is installed and imported elsewhere in the project
    // If not, add: import moment from "moment";
    return moment(date).format("MMMM D, YYYY h:mm a");
  },
  formatDate: (date: string) => {
    return moment(date).format("MMM D, YYYY");
  },
  capitalizeFirstLetter: (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
};

export default string;
