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
};

export default string;
