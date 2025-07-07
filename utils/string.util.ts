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
};

export default string;
