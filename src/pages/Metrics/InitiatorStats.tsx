import { PerformanceMetrics } from "../../api/types";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "../../components/ui/table";
import { formatCurrency, formatNumber } from "../../utils";

const InitiatorStats = ({ initiators = [] }: { initiators: PerformanceMetrics["collectors_stats"] }) => {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                        Collector Leaderboard
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Performance breakdown by transaction counts and totals
                    </p>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-y border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                        <TableRow>
                            <TableCell isHeader className="w-12">#</TableCell>
                            <TableCell isHeader>Collector</TableCell>
                            <TableCell isHeader>Transactions</TableCell>
                            <TableCell isHeader>Total Volume</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {initiators && initiators.length > 0 ? (
                            initiators.map((initiator, i) => (
                                <TableRow key={initiator?.initiator_id || i}>
                                    <TableCell className="font-bold text-xs text-gray-400">
                                        #{i + 1}
                                    </TableCell>
                                    <TableCell className="font-semibold text-gray-900 dark:text-white text-xs">
                                        {initiator?.name}
                                    </TableCell>
                                    <TableCell className="text-xs text-gray-600 dark:text-gray-300">
                                        {formatNumber(initiator?.count)}
                                    </TableCell>
                                    <TableCell className="font-semibold tabular-nums text-xs text-brand-600 dark:text-brand-400">
                                        {formatCurrency(initiator?.collection_volume)}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell className="py-8 text-center text-xs text-gray-400" isHeader={false}>
                                    No collection records for this period
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Stacked Rank Cards */}
            <div className="block sm:hidden divide-y divide-gray-100 dark:divide-gray-800">
                {initiators && initiators.length > 0 ? (
                    initiators.map((initiator, i) => (
                        <div key={initiator?.initiator_id || i} className="py-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="flex size-7 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300 flex-shrink-0">
                                    {i + 1}
                                </span>
                                <div className="min-w-0">
                                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                                        {initiator?.name}
                                    </h4>
                                    <span className="text-[11px] text-gray-400">
                                        {formatNumber(initiator?.count)} transaction{initiator?.count === 1 ? "" : "s"}
                                    </span>
                                </div>
                            </div>
                            <span className="text-sm font-bold tabular-nums text-brand-600 dark:text-brand-400 flex-shrink-0">
                                {formatCurrency(initiator?.collection_volume)}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="py-8 text-center text-xs text-gray-400">
                        No collection records for this period
                    </div>
                )}
            </div>
        </div>
    );
};

export default InitiatorStats;
