import { AuthUser, StaticFunc } from "../../api/types";
import { Drawer } from "../../components/Drawer/Drawer";
import Button from "../../components/button/Button";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { useRegisterMember, useUpdateUserPermissions, useUpdateUserStatus } from "../../hooks/useApiHooks";
import { useUserStore } from "../../hooks/useUserStore";
import Checkbox from "../../components/form/input/Checkbox";
import ConfirmationModal from "../../components/confirm";
import { toast } from "react-toastify";
import { useAuthStore } from "../../hooks/useAuthStore";
import Badge from "../../components/ui/badge/Badge";
import AccessWrapper from "../../components/AccessController";
import { PERMISSION_VALUES } from "../../utils";

interface NewUserProps {
    user: AuthUser;
    isOpen: boolean;
    openModal: StaticFunc;
    closeModal: StaticFunc;
}

const NewUser = ({ user, isOpen, closeModal }: NewUserProps) => {
    const [openConfirm, setOpenConfirm] = useState<{ action?: "create" | "edit" | "status"; open: boolean }>({
        action: undefined,
        open: false
    });
    const [userData, setUserData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        password: "",
        permissions: [] as string[]
    });

    const auth = useAuthStore((state) => state.user);
    const { permissions, getUserPermissions } = useUserStore((state) => state);

    useEffect(() => {
        getUserPermissions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (user) {
            setUserData({
                email: user?.email || "",
                first_name: user?.first_name || "",
                last_name: user?.last_name || "",
                phone: user?.phone || "",
                password: "",
                permissions: user?.permissions || []
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const queryClient = useQueryClient();
    const { mutate: cm, isPending: cP } = useRegisterMember();
    const { mutate: um, isPending: uP } = useUpdateUserPermissions();
    const { mutate: sm, isPending: sP } = useUpdateUserStatus();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            setOpenConfirm({ open: true, action: "edit" });
        } else {
            setOpenConfirm({ open: true, action: "create" });
        }
    };

    const isPending = uP || cP || sP;

    const close = () => {
        closeModal();
        setUserData({
            email: "",
            first_name: "",
            last_name: "",
            phone: "",
            password: "",
            permissions: []
        });
    };

    const handlePermissions = (permission: string) => {
        let current = [...userData.permissions];
        if (current.includes(permission)) {
            current = current.filter((p) => p !== permission);
        } else {
            current = [...current, permission];
        }
        setUserData((prev) => ({ ...prev, permissions: current }));
    };

    const resetForm = () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        closeModal();
        setUserData({
            email: "",
            first_name: "",
            last_name: "",
            phone: "",
            password: "",
            permissions: []
        });
    };

    const confirmAction = () => {
        setOpenConfirm((prev) => ({ ...prev, open: false }));

        if (openConfirm.action === "create") {
            cm(userData, {
                onSuccess() {
                    toast.success("Member created successfully. They will receive their login credentials.");
                    resetForm();
                },
                onError: (error) => {
                    toast.error(error.message);
                }
            });
            return;
        }

        if (openConfirm.action === "edit") {
            um(
                { userId: user?.uid, data: { permissions: userData.permissions } },
                {
                    onSuccess() {
                        toast.success("Member permissions updated successfully");
                        queryClient.invalidateQueries({ queryKey: ["users"] });
                    },
                    onError: (error) => {
                        toast.error(error.message);
                    }
                }
            );
            return;
        }

        if (openConfirm.action === "status") {
            sm(
                { userId: user?.uid, data: { status: user?.status === "active" ? "blocked" : "active" } },
                {
                    onSuccess() {
                        toast.success(`Member ${user?.status === "active" ? "blocked" : "activated"} successfully`);
                        queryClient.invalidateQueries({ queryKey: ["users"] });
                        close();
                    },
                    onError: (error) => {
                        toast.error(error.message);
                    }
                }
            );
        }
    };

    const allPermissions = Object.values(permissions).flatMap((items) => items.map((perm) => perm.action));
    const allSelected = allPermissions.length > 0 && allPermissions.every((perm) => userData.permissions.includes(perm));

    const handleSelectAll = () => {
        if (allSelected) {
            setUserData((prev) => ({ ...prev, permissions: [] }));
        } else {
            setUserData((prev) => ({ ...prev, permissions: allPermissions }));
        }
    };

    return (
        <>
            <Drawer
                title={
                    <div className="flex items-center justify-between w-full pr-6">
                        <div>
                            <h2 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                                {user ? "Member Permissions" : "Add Team Member"}
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {user ? `${userData.first_name} ${userData.last_name}` : "Invite a new member to the organization"}
                            </p>
                        </div>

                        {user && user?.uid !== auth?.uid && (
                            <AccessWrapper componentPermissions={[PERMISSION_VALUES.users.update_user]}>
                                <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => setOpenConfirm({ action: "status", open: true })}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                        user?.status === "active"
                                            ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400"
                                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400"
                                    }`}
                                >
                                    {user?.status === "active" ? "Block Member" : "Activate"}
                                </button>
                            </AccessWrapper>
                        )}
                    </div>
                }
                isOpen={isOpen}
                onClose={close}
                position="right"
                width="w-full sm:w-[500px] lg:w-[620px]"
            >
                <form className="flex flex-col h-full" onSubmit={handleSubmit}>
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-1 py-4 space-y-6 pb-24">
                        {!user ? (
                            /* New Member Form Fields */
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        First Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        name="first_name"
                                        value={userData.first_name}
                                        onChange={handleChange}
                                        required
                                        placeholder="John"
                                    />
                                </div>

                                <div className="col-span-1">
                                    <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Last Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        name="last_name"
                                        value={userData.last_name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Doe"
                                    />
                                </div>

                                <div className="col-span-1 sm:col-span-2">
                                    <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Email Address <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="member@company.com"
                                    />
                                </div>

                                <div className="col-span-1 sm:col-span-2">
                                    <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Phone Number <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="tel"
                                        name="phone"
                                        value={userData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="08012345678"
                                    />
                                </div>
                            </div>
                        ) : (
                            /* Member Info Summary Card */
                            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/30 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-sm text-gray-900 dark:text-white">
                                        {userData.first_name} {userData.last_name}
                                    </span>
                                    <Badge
                                        variant="light"
                                        color={user?.status === "active" ? "success" : "error"}
                                    >
                                        {user?.status}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <div>Email: <span className="text-gray-700 dark:text-gray-300 font-medium">{userData.email}</span></div>
                                    <div>Phone: <span className="text-gray-700 dark:text-gray-300 font-medium">{userData.phone || "—"}</span></div>
                                </div>
                            </div>
                        )}

                        {/* Permissions Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                                    Module Permissions
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        onChange={handleSelectAll}
                                        checked={allSelected}
                                        disabled={user?.uid === auth?.uid}
                                        label="Select All"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {Object.entries(permissions).map(([section, items]) => (
                                    <div
                                        key={section}
                                        className="p-3.5 rounded-xl border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-900/40 shadow-xs"
                                    >
                                        <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
                                            {section}
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {items.map((perm) => (
                                                <Checkbox
                                                    key={perm.action}
                                                    disabled={user?.uid === auth?.uid}
                                                    onChange={() => handlePermissions(perm.action)}
                                                    checked={userData.permissions.includes(perm.action)}
                                                    label={perm.name}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sticky Action Footer */}
                    {user?.uid !== auth?.uid && (
                        <div className="sticky bottom-2 p-4 bg-white dark:bg-gray-900 border-t border-gray-200/80 dark:border-gray-800 flex items-center justify-end gap-3">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={close}
                                disabled={isPending}
                                className="w-1/3 sm:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isPending}
                                className="flex-1 sm:flex-initial sm:min-w-[160px]"
                            >
                                {isPending ? "Saving..." : user ? "Save Permissions" : "Create Member"}
                            </Button>
                        </div>
                    )}
                </form>
            </Drawer>

            <ConfirmationModal
                title="Please confirm this action"
                isOpen={openConfirm.open}
                onCancel={() => setOpenConfirm({ open: false, action: undefined })}
                onConfirm={confirmAction}
            />
        </>
    );
};

export default NewUser;
