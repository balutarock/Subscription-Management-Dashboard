import axios from "axios";
import type { TRegister } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL!;

export const registerUser = ({ email, name, password }: TRegister) => {
  const url = new URL(`${BASE_URL}/api/auth/register`);
  return axios.post(url.toString(), {
    email,
    name,
    password,
  });
};

export const loginUser = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const url = new URL(`${BASE_URL}/api/auth/login`);
  return axios.post(url.toString(), {
    email,
    password,
  });
};
