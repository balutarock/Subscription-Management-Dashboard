/* src/hooks/useApiMutation.ts
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import axiosInstance from "../axios";

// A reusable hook to perform API mutations (POST, PUT, DELETE, etc.)
const useApiMutation = <T>(url: string, options?: UseMutationOptions<T, Error, any>) => {
  return useMutation(async (data: any) => {
    // You can customize the HTTP method (POST, PUT, DELETE, etc.) here
    const response = await axiosInstance.post<T>(url, data);
    return response.data;
  }, options);
};

export default useApiMutation;
*/
