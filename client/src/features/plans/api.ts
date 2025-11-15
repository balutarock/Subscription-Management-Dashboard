import axiosInstance from "@/api/axios";
import { AxiosError } from "axios";

export interface Subscription {
  id: string;
  planId: string;
  status: "active" | "canceled" | "past_due" | "unpaid";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

const endpoint = "/api/subscriptions";
const plansEndpoint = "/api/plans";

export const subscribeToPlan = async (planId: string) => {
  try {
    await axiosInstance.post<Subscription>(`${endpoint}/${planId}`);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Subscription failed:", error);
      const errorMessage =
        error?.response?.data?.error || "Subscription failed";
      throw new Error(errorMessage);
    }
  }
};

export const getCurrentSubscription = async () => {
  try {
    const response = await axiosInstance.get(`${endpoint}/my-subscription`);
    return response.data;
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

export interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary" | "ghost" | "link";
}

export interface PlansResponse {
  data: Plan[];
}

export const getPlans = async (): Promise<PlansResponse> => {
  try {
    const response = await axiosInstance.get<PlansResponse>(plansEndpoint);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Failed to fetch plans:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to fetch plans";
      throw new Error(errorMessage);
    }
    throw error;
  }
};
