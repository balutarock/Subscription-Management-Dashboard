import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axios";

interface Data {
  id: number;
  name: string;
}

const fetchData = async (): Promise<Data[]> => {
  const { data } = await axiosInstance.get("/data"); // Replace with your endpoint
  return data;
};

export const useFetchData = () => {
  return useQuery<Data[], Error>({
    queryKey: ["fetchData"],
    queryFn: fetchData,
    // Optional: customize the cache time, retry, and other query options
    retry: 2, // Retries the request 2 times before failing
    staleTime: 5000, // Data is considered fresh for 5 seconds
  });
};
