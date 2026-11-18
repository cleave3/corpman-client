import { useAuthStore } from "../../hooks/useAuthStore";
import { formatDate } from "../../utils/date";

export default function UserInfoCard() {
    const user = useAuthStore((state) => state.user);

    if (!user) {
        return (
            <div className="p-4 sm:p-6 border border-gray-200/80 rounded-2xl bg-white dark:border-gray-800 dark:bg-gray-900 shadow-xs animate-pulse">
                <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
                <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-1.5">
                            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
                            <div className="h-4 w-28 bg-gray-100 dark:bg-gray-800/60 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 border border-gray-200/80 rounded-2xl bg-white dark:border-gray-800 dark:bg-gray-900 shadow-xs">
            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                Personal Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                    <p className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                        First Name
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {user?.first_name || "—"}
                    </p>
                </div>

                <div>
                    <p className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                        Last Name
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {user?.last_name || "—"}
                    </p>
                </div>

                <div>
                    <p className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                        Email Address
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                        {user?.email || "—"}
                    </p>
                </div>

                <div>
                    <p className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                        Telephone
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {user?.phone || "—"}
                    </p>
                </div>

                <div className="sm:col-span-2">
                    <p className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                        Last Login Session
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                        {formatDate(user?.last_login, "llll")}
                    </p>
                </div>
            </div>
        </div>
    );
}
