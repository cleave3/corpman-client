import { Table, TableHeader, TableRow, TableCell, TableBody, TableLoader } from "../../components/ui/table";
import { useGetUsers } from "../../hooks/useApiHooks";
import { formatDate } from "../../utils/date";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Badge from "../../components/ui/badge/Badge";
import { useAuthStore } from "../../hooks/useAuthStore";
import NewUser from "./NewUser";
import { useUserStore } from "../../hooks/useUserStore";
import { useModal } from "../../hooks/useModal";
import { UserPlusIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from "@heroicons/react/24/outline";
import AccessWrapper from "../../components/AccessController";
import { PERMISSION_VALUES } from "../../utils";

const Users = () => {
    const { data, isLoading } = useGetUsers();
    const auth = useAuthStore((state) => state.user);
    const { openModal, closeModal, isOpen } = useModal();
    const { selectUser, selectedUser } = useUserStore((state) => state);

    if (isLoading) return <TableLoader />;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <PageBreadcrumb pageTitle="Team" />

                <AccessWrapper componentPermissions={[PERMISSION_VALUES.users.create_user]}>
                    <button
                        type="button"
                        onClick={() => {
                            selectUser(null);
                            openModal();
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 text-white font-medium text-sm hover:bg-brand-600 active:scale-[0.98] transition shadow-xs self-start sm:self-auto"
                    >
                        <UserPlusIcon className="size-4" />
                        <span>Add Member</span>
                    </button>
                </AccessWrapper>
            </div>

            <NewUser
                user={selectedUser}
                isOpen={isOpen}
                openModal={openModal}
                closeModal={() => {
                    closeModal();
                    selectUser(null);
                }}
            />

            <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900/60 shadow-xs">
                {/* Desktop View Table */}
                <div className="hidden lg:block max-w-full overflow-x-auto min-h-[400px]">
                    <div className="min-w-[1000px]">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                                <TableRow>
                                    <TableCell isHeader>Member</TableCell>
                                    <TableCell isHeader>Email</TableCell>
                                    <TableCell isHeader>Telephone</TableCell>
                                    <TableCell isHeader>Role / Type</TableCell>
                                    <TableCell isHeader>Status</TableCell>
                                    <TableCell isHeader>Last Login</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {data?.data?.map((user) => (
                                    <TableRow
                                        key={user.uid}
                                        className={`cursor-pointer transition-colors ${
                                            user?.uid === auth?.uid
                                                ? "bg-brand-50/40 dark:bg-brand-500/10 font-medium"
                                                : "hover:bg-gray-50/60 dark:hover:bg-gray-800/40"
                                        }`}
                                        onClick={() => {
                                            selectUser(user);
                                            openModal();
                                        }}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-sm dark:bg-brand-500/20 dark:text-brand-400">
                                                    {`${user.name?.[0] ?? ""}${user.name?.[1] ?? ""}`.toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                                        {user?.name}
                                                    </span>
                                                    {user?.uid === auth?.uid && (
                                                        <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                                                            (You)
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-gray-600 dark:text-gray-300">
                                            {user?.email}
                                        </TableCell>
                                        <TableCell className="text-xs text-gray-600 dark:text-gray-300">
                                            {user?.phone || "—"}
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                                {user?.user_type || "Staff"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="light"
                                                color={user?.status === "active" ? "success" : "error"}
                                            >
                                                {user?.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-gray-500">
                                            {formatDate(user?.last_login, "lll")}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Mobile View: High-Density Team Member Cards */}
                <div className="block lg:hidden divide-y divide-gray-100 dark:divide-gray-800">
                    {data?.data?.map((user) => {
                        const isCurrentUser = user?.uid === auth?.uid;
                        const initials = `${user.name?.[0] ?? ""}${user.name?.[1] ?? ""}`.toUpperCase() || "U";

                        return (
                            <div
                                key={user.uid}
                                className={`p-4 space-y-2.5 transition-colors active:bg-gray-50/60 dark:active:bg-gray-800/40 cursor-pointer ${
                                    isCurrentUser ? "bg-brand-50/30 dark:bg-brand-500/5" : ""
                                }`}
                                onClick={() => {
                                    selectUser(user);
                                    openModal();
                                }}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-sm dark:bg-brand-500/20 dark:text-brand-400">
                                            {initials}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                                    {user?.name}
                                                </h3>
                                                {isCurrentUser && (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-100 dark:bg-brand-500/20 px-1.5 py-0.2 rounded">
                                                        You
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-400 capitalize">
                                                {user?.user_type || "Staff member"}
                                            </span>
                                        </div>
                                    </div>

                                    <Badge
                                        variant="light"
                                        color={user?.status === "active" ? "success" : "error"}
                                    >
                                        {user?.status}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-600 dark:text-gray-400 pt-1">
                                    <div className="flex items-center gap-2 truncate">
                                        <EnvelopeIcon className="size-3.5 text-gray-400 flex-shrink-0" />
                                        <span className="truncate">{user?.email}</span>
                                    </div>
                                    {user?.phone && (
                                        <div className="flex items-center gap-2 truncate">
                                            <PhoneIcon className="size-3.5 text-gray-400 flex-shrink-0" />
                                            <span>{user?.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-0.5">
                                        <ClockIcon className="size-3.5 text-gray-400 flex-shrink-0" />
                                        <span>Last active: {formatDate(user?.last_login, "lll")}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Users;
