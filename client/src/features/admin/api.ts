import axiosInstance from "@/api/axios";
import { AxiosError } from "axios";

const endpoint = "/api/admin/subscriptions";

export const getAllSubscriptions = async () => {
  try {
    const response = await axiosInstance.get(`${endpoint}`);
    return response.data.data;
  } catch (error: unknown) {
    // If it's a 404, return null subscription instead of error
    if (error instanceof AxiosError && error?.response?.status === 404) {
      console.error("Failed to fetch subscription:", error);
      const errorMessage =
        error?.response?.data?.error || "Failed to fetch subscription";
      throw new Error(errorMessage);
    }
  }
};
