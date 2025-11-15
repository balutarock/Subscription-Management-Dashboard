// Define the subscription type based on the provided data
export type Subscription = {
  id: string;
  userId: string;
  planId: string;
  status: "active" | "canceled" | "past_due" | "unpaid";
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  plan: {
    id: string;
    name: string;
    price: number;
    features: string[];
    duration: number;
  };
  user: {
    id: string;
    email: string;
    name: string;
  };
};
