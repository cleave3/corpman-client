import { useAuthStore } from "../../hooks/useAuthStore";
import Badge from "../../components/ui/badge/Badge";
import { ArrowRightOnRectangleIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useModal } from "../../hooks/useModal";
import { useState } from "react";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { Modal } from "../../components/ui/modal";
import { useChangePassword } from "../../hooks/useApiHooks";
import { toast } from "react-toastify";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import useWidth from "../../hooks/useWidth";
import ConfirmationModal from "../../components/confirm";
import { useNavigate } from "react-router";
import { ROUTES } from "../../utils";

export default function UserMetaCard() {
    const [showPassword, setShowPassword] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [form, setForm] = useState({ current_password: "", new_password: "" });

    const { openModal, closeModal, isOpen } = useModal();
    const { notDesktop } = useWidth();
    const { logout, user } = useAuthStore((state) => state);
    const { isPending, mutate } = useChangePassword();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogout = () => {
        setShowLogoutConfirm(false);
        logout();
        navigate(ROUTES.SIGNIN);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        mutate(form, {
            onSuccess: () => {
                toast.success("Password changed successfully");
                closeModal();
                setForm({ current_password: "", new_password: "" });
            },
            onError: (error) => {
                toast.error(error.message);
            }
        });
    };

    if (!user) {
        return (
            <div className="p-4 sm:p-6 border border-gray-200/80 rounded-2xl bg-white dark:border-gray-800 dark:bg-gray-900 shadow-xs animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="size-16 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                    <div className="space-y-2 flex-1">
                        <div className="h-5 w-36 bg-gray-200 dark:bg-gray-800 rounded" />
                        <div className="h-4 w-24 bg-gray-100 dark:bg-gray-800/60 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    const initials = `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase() || "CM";

    return (
        <>
            <div className="p-4 sm:p-6 border border-gray-200/80 rounded-2xl bg-white dark:border-gray-800 dark:bg-gray-900 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="size-16 sm:size-20 overflow-hidden border border-gray-200 rounded-2xl dark:border-gray-800 flex items-center justify-center bg-brand-50 text-brand-600 font-bold text-xl dark:bg-brand-500/20 dark:text-brand-400 flex-shrink-0">
                            {user?.image_url ? (
                                <img src={user.image_url} alt="Profile" className="size-full object-cover" />
                            ) : (
                                <span>{initials}</span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                {user?.first_name} {user?.last_name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge
                                    variant="light"
                                    color={user?.status === "active" ? "success" : "error"}
                                >
                                    {user?.status}
                                </Badge>
                                <span className="text-xs text-gray-400 capitalize">
                                    {user?.user_type || "Staff Member"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={openModal}
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition"
                        >
                            <LockClosedIcon className="size-4 text-gray-500" />
                            <span>Password</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowLogoutConfirm(true)}
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-red-200 bg-red-50/50 text-xs font-semibold text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 transition"
                        >
                            <ArrowRightOnRectangleIcon className="size-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                isFullscreen={notDesktop}
                className="max-w-[500px] m-0 sm:m-2"
            >
                <div className="flex flex-col min-h-full">
                    <div className="pb-4 border-b border-gray-100 dark:border-gray-800">
                        <h4 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                            Change Password
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Update your account security credentials
                        </p>
                    </div>

                    <form className="flex flex-col flex-1 mt-4" onSubmit={handleSubmit}>
                        <div className="space-y-4 flex-1">
                            <div>
                                <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    Current Password <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        name="current_password"
                                        value={form.current_password}
                                        placeholder="Enter current password"
                                        onChange={handleChange}
                                        required
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

                            <div>
                                <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    New Password <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        name="new_password"
                                        value={form.new_password}
                                        placeholder="Enter new password"
                                        onChange={handleChange}
                                        required
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
                        </div>

                        <div className="sticky bottom-0 pt-4 mt-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
                            <Button
                                size="sm"
                                disabled={isPending}
                                variant="outline"
                                onClick={closeModal}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button size="sm" disabled={isPending} type="submit">
                                {isPending ? "Updating..." : "Update Password"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

            <ConfirmationModal
                title="Are you sure you want to sign out?"
                isOpen={showLogoutConfirm}
                onCancel={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
            />
        </>
    );
}
