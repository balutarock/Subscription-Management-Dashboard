import { Link } from "react-router-dom";
import { SignUpForm } from "../components/sign-up-form";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import type { TRegister } from "../types";
import { registerUser } from "../api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export const SignUpPage = () => {

    const navigate = useNavigate();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (params: TRegister) => {
            const registrationData = {
                ...params,
            };
            return registerUser(registrationData);
        },
        onSuccess: () => {
            toast.success("Successfully Created account", { id: "register-user" });
            navigate("/sign-in");
        },
        onError: (error) => {
            console.error("Register User Error:", error);
            let errorMsg = "Error while registering the user";
            if (error instanceof AxiosError) {
                errorMsg = error?.response?.data?.message;
            }
            toast.error(errorMsg, { id: "register-user" });
        },
    });


    const handleRegisterUser = async (data: TRegister) => {
        await mutateAsync(data);
    };

    return (
        <Card>
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
                <div className="flex gap-2 2xl:gap-4 flex-col bg-[#FFFFFF] rounded-[8px] text-left p-4 2xl:p-8 my-4 min-w-[400px]">
                    <SignUpForm
                        onSubmit={handleRegisterUser}
                        isLoading={isPending}
                    />
                    <SignUpFooter returnTo={null} />
                </div>
            </div>
        </Card>
    );
};

const SignUpFooter = ({ returnTo }: { returnTo: string | null }) => {
    const signInUrl = returnTo ? `/sign-in?returnTo=${encodeURIComponent(returnTo)}` : "/sign-in";

    return (
        <>
            <div className="text-muted-foreground text-sm">
                Already have an account?{" "}
                <Link to={signInUrl}>
                    Sign In
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
        </>
    );
};
