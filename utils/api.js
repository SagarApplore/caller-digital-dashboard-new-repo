import axios from "axios";

export const apiRequest = async (
  endPoint,
  method,
  data = {},
  params = {},
  headers = {}
) => {
  try {
    const tokenObj = localStorage.getItem("auth_token");
    const token = tokenObj ? JSON.parse(tokenObj).accessToken : null;
    const baseUrl =
      process.env.NEXT_PUBLIC_REACT_APP_BASE_URL || "http://localhost:8000/api/v1";
    if (!baseUrl) {
      throw new Error("Base URL is not defined in environment variables.");
    }

    const isMultipart = data instanceof FormData;
    const url = `${baseUrl}${endPoint}`;
    const response = await axios({
      url,
      method: method.toUpperCase(),
      data: method !== "GET" ? data : undefined,
      params: params,
      headers: {
        ...(isMultipart ? {} : { "Content-Type": "application/json" }),
        Authorization: `Bearer ${token}`,

        ...headers,
      },
    });

    return response;
  } catch (error) {
    console.error("API Request Error:", error.stack);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};

export default apiRequest;
