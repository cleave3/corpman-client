import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useForgotPassword } from "../../hooks/useApiHooks";
import { ROUTES } from "../../utils";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState<string>("");
    const { mutate, isPending } = useForgotPassword();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({ email });
    };

    return (
        <div className="w-full">
            <div className="mb-6">
                <Link
                    to={ROUTES.SIGNIN}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-4"
                >
                    <ArrowLeftIcon className="size-3.5" />
                    Back to Sign In
                </Link>

                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Reset your password
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Enter the email associated with your account, and we'll send you recovery instructions.
                </p>
            </div>

            <form onSubmit={handleSubmit} autoComplete="on" className="space-y-5">
                <div>
                    <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        placeholder="e.g. name@company.com"
                        value={email}
                        type="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        autoCapitalize="none"
                        autoCorrect="off"
                    />
                </div>

                <div className="pt-2">
                    <Button
                        disabled={isPending}
                        className="w-full h-12 text-sm font-semibold tracking-wide rounded-xl active:scale-[0.99] transition-transform shadow-sm"
                        size="md"
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
                                Sending link...
                            </span>
                        ) : (
                            "Send Reset Instructions"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
