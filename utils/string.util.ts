const string = {
  formatNumber: (number: number) => number.toLocaleString(),
  formatPercentage: (number: number) => `${number.toFixed(2)}%`,
};

export default string;
