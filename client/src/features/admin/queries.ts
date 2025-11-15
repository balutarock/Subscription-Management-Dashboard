import { getAllSubscriptions } from "./api";
import { useQuery } from "@tanstack/react-query";

export const useGetAllSubscriptions = () => {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => getAllSubscriptions(),
  });
};
