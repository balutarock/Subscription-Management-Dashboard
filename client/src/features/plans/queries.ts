import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { subscribeToPlan } from "./api";
import { AxiosError } from "axios";

export const useCreateSubscription = (id: string) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => subscribeToPlan(id),
    onSuccess: () => {
      toast.success("Subscription created successfully");
      navigate("/dashboard");
    },
    onError: (error: unknown) => {
      let errMsg = "Failed to create subscription";
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data;
        errMsg = errorData.error || errMsg;
      }
      toast.error(errMsg);
    },
  });
};
