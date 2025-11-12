import { RequiredLabel, getRequiredFields } from "@/components/common/required-label";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { type TRegister, ZRegister, ZRegisterConfirmPassword } from "../types";

interface ISignUpForm {
    onSubmit: (data: TRegister) => void;
    isLoading: boolean;
}

export const SignUpForm = ({
    onSubmit,
    isLoading,
}: ISignUpForm) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const registerSchema = ZRegister.merge(ZRegisterConfirmPassword).refine(
        (data) => data.password === data.confirmPassword,
        {
            message: "Passwords must match",
            path: ["confirmPassword"],
        }
    );
    const requiredFields = useMemo(() => getRequiredFields(registerSchema), []);

    const form = useForm<TRegister & { confirmPassword: string }>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            name: "",
            password: "",
        },
    });

    const confirmPassword = form.watch("confirmPassword");
    const currentPassword = form.watch("password");

    useEffect(() => {
        if (currentPassword !== confirmPassword) {
            form.setError("confirmPassword", { message: "Password must match" });
        }
    }, [confirmPassword]);





    return (
        <>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit((data) => onSubmit(data))}>
                    <div className="flex gap-2 2xl:gap-4 flex-col">
                        <div className="flex gap-2 flex-col">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel label="Email" field="email" requiredFields={requiredFields} />
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Email"
                                                className="w-full"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex gap-2 flex-row">
                            <div className="flex gap-2 flex-col w-full">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <RequiredLabel label="Name" field="name" requiredFields={requiredFields} />
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Name" {...field} className="w-full" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 flex-col">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel label="Password" field="password" requiredFields={requiredFields} />
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Password"
                                                    {...field}
                                                    className="w-full"
                                                    type={showPassword ? "text" : "password"}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                                                    onClick={() => setShowPassword(!showPassword)}>
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex gap-2 flex-col">
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel
                                                label="Confirm Password"
                                                field="confirmPassword"
                                                requiredFields={requiredFields}
                                            />
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Confirm Password"
                                                    {...field}
                                                    className="w-full"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    <span className="sr-only">
                                                        {showConfirmPassword ? "Hide password" : "Show password"}
                                                    </span>
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-2 flex-col">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="animate-spin" />}
                                Sign Up
                            </Button>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </>
    );
};
