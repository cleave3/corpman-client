import { useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { LoginUserRequest } from "../../api/types";
import { useLoginUser } from "../../hooks/useApiHooks";
import { ROUTES } from "../../utils";

export default function SignInForm() {
    const [data, setData] = useState<LoginUserRequest>({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const { mutate, isPending } = useLoginUser();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate(data);
    };

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Sign in to your account
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Enter your email/phone and password to continue.
                </p>
            </div>

            <form onSubmit={handleSubmit} autoComplete="on" className="space-y-5">
                <div>
                    <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Email or Phone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        placeholder="e.g. name@company.com or 08012345678"
                        value={data.email}
                        name="email"
                        onChange={handleChange}
                        required
                        autoComplete="username"
                        autoCapitalize="none"
                        autoCorrect="off"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <Label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                            Password <span className="text-red-500">*</span>
                        </Label>
                        <Link
                            to={ROUTES.FORGOT_PASSWORD}
                            className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            placeholder="Enter your password"
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                            className="pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-1 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeIcon className="size-5 fill-current" />
                            ) : (
                                <EyeCloseIcon className="size-5 fill-current" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        disabled={isPending}
                        className="w-full h-12 text-sm font-semibold tracking-wide rounded-xl active:scale-[0.99] transition-transform shadow-sm"
                        size="md"
                        type="submit"
                    >
                        {isPending ? (
                            <span className="flex items-center gap-2">
                                <svg
                                    className="animate-spin size-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
