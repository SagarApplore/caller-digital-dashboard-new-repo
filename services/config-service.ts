const configs = {
  getConfiguration: async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/configuration`
    );
    const data = await response.json();
    return data;
  },
};

export default configs;
