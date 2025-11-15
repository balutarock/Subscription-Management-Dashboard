import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuthStore } from "../authStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api";
import { AxiosError } from "axios";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: (params: { email: string; password: string }) => {
      const registrationData = {
        ...params,
      };
      return loginUser(registrationData);
    },
    onSuccess: (data) => {
      const { token, user } = data.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      // TODO: RefreshToken 
      login(user, token, "dfdf");
      toast.success("Successfully logged in", { id: "login-user" });
      if (user.roles.includes("admin")) {
        navigate("/admin/subscriptions");
      } else {
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      console.error("Login Error:", error);
      let errorMsg = "Error while logging in";
      if (error instanceof AxiosError) {
        errorMsg = error?.response?.data?.message;
      }
      toast.error(errorMsg, { id: "login-user" });
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      // In a real app, you would call your authentication API here
      // For now, we'll simulate a successful login
      await mutateAsync({
        ...data,
      });
    } catch (error) {
      console.error("Login failed:", error);
      // Handle error (e.g., show toast)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col items-center">
      <div className="flex gap-2 2xl:gap-4 flex-col bg-[#FFFFFF] rounded-[8px] text-left p-4 2xl:p-8 min-w-[400px]">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => onSubmit(data))} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link
            to="/sign-up"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </div>
        <div className="text-center text-sm">
          see plans{" "}
          <Link
            to="/plans"
            className="font-medium text-primary hover:underline"
          >
            Plans
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default SignInPage;
