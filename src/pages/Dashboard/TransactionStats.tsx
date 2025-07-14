import AccessWrapper from "../../components/AccessController";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
import { useOverviewStats } from "../../hooks/useApiHooks";
import { formatCurrencyShort, PERMISSION_VALUES } from "../../utils";

export default function TransactionStats() {
    const { data, isLoading } = useOverviewStats();

    const stats = data?.data;

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="flex justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Transaction Stats</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">All time transaction statistics</p>
                </div>
            </div>

            <AccessWrapper componentPermissions={[PERMISSION_VALUES.dashboard.dashboard_collections]}>
                <div className="my-8 text-center">
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Total Collections</p>
                    {isLoading ? (
                        <div className="mx-auto h-12 w-48 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
                    ) : (
                        <p className="text-5xl font-bold text-gray-900 dark:text-white">{formatCurrencyShort(stats?.total_customer_deposits)}</p>
                    )}
                </div>
            </AccessWrapper>

            <div className="mt-6 flex items-center justify-around gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                <AccessWrapper componentPermissions={[PERMISSION_VALUES.dashboard.dashboard_payouts]}>
                    <div className="text-center">
                        <p className="flex items-center justify-center gap-1 text-sm font-medium text-red-600 dark:text-red-500">
                            <ArrowDownIcon className="size-4" />
                            Payouts
                        </p>
                        {isLoading ? (
                            <div className="mt-1 h-6 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
                        ) : (
                            <p className="mt-1 text-lg font-semibold text-gray-800 dark:text-white/90">
                                {formatCurrencyShort(stats?.total_payouts)}
                            </p>
                        )}
                    </div>
                </AccessWrapper>

                <div className="h-10 w-px bg-gray-200 dark:bg-gray-700"></div>

                <AccessWrapper componentPermissions={[PERMISSION_VALUES.dashboard.dashboard_revenue]}>
                    <div className="text-center">
                        <p className="flex items-center justify-center gap-1 text-sm font-medium text-green-600 dark:text-green-500">
                            <ArrowUpIcon className="size-4" />
                            Income
                        </p>
                        {isLoading ? (
                            <div className="mt-1 h-6 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
                        ) : (
                            <p className="mt-1 text-lg font-semibold text-gray-800 dark:text-white/90">
                                {formatCurrencyShort(stats?.total_income)}
                            </p>
                        )}
                    </div>
                </AccessWrapper>
            </div>
        </div>
    );
}
