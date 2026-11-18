import Chart from "react-apexcharts";
import { useTransactionsByInitiator } from "../../hooks/useApiHooks";
import InitiatorStats from "./InitiatorStats";
import MetricsLoader from "./MetricsLoader";
import { useState } from "react";
import { formatCurrency } from "../../utils";
import useWidth from "../../hooks/useWidth";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const Metrics = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);

    const { isMobile } = useWidth();
    const { data, isLoading } = useTransactionsByInitiator(year, month);

    const initiators = data?.data?.collectors_stats;
    const total_customer_deposits = data?.data?.total_customer_deposits;
    const total_income = data?.data?.total_income;
    const total_payouts = data?.data?.total_payouts;

    const isCurrentYear = year === new Date().getFullYear();
    const maxMonth = isCurrentYear ? new Date().getMonth() + 1 : 12;

    return (
        <div className="space-y-4">
            <PageBreadcrumb pageTitle="Performance Metrics" />

            {/* Filter Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-xs">
                <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">
                        Financial Performance: {months[month - 1]} {year}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Overview of deposit volumes, company revenue, and team collections
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:flex items-center gap-2">
                    <select
                        className="h-11 appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                    >
                        {months.map((monthName, idx) => {
                            if (idx + 1 > maxMonth) return null;
                            return (
                                <option key={idx + 1} value={idx + 1}>
                                    {monthName}
                                </option>
                            );
                        })}
                    </select>

                    <select
                        className="h-11 appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                    >
                        {Array.from({ length: new Date().getFullYear() - 2023 }, (_, i) => (
                            <option key={i} value={new Date().getFullYear() - i}>
                                {new Date().getFullYear() - i}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <MetricsLoader />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Charts Column */}
                    <div className="space-y-4">
                        {/* Flow Breakdown Card */}
                        <div className="p-4 sm:p-5 rounded-2xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-xs">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                                Financial Flow Breakdown
                            </h3>
                            {total_customer_deposits || total_income || total_payouts ? (
                                <Chart
                                    type="pie"
                                    height={isMobile ? 320 : 360}
                                    series={[total_customer_deposits || 0, total_income || 0, total_payouts || 0]}
                                    options={{
                                        labels: ["Customer Deposits", "Company Income", "Payouts Issued"],
                                        colors: ["#3B82F6", "#10B981", "#EF4444"],
                                        legend: {
                                            position: isMobile ? "bottom" : "bottom",
                                            formatter: (seriesName: string, opts) => {
                                                const value = opts.w.globals.series[opts.seriesIndex];
                                                return `${seriesName}: ${formatCurrency(value)}`;
                                            }
                                        },
                                        tooltip: {
                                            y: {
                                                formatter: (val: number) => formatCurrency(val)
                                            }
                                        }
                                    }}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-xs">
                                    No financial transaction data recorded for this month.
                                </div>
                            )}
                        </div>

                        {/* Collections Stats Bar Chart */}
                        <div className="p-4 sm:p-5 rounded-2xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-xs">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                                Collection Volume by Staff
                            </h3>
                            {initiators && initiators.length > 0 ? (
                                <Chart
                                    type="bar"
                                    height={isMobile ? 300 : 360}
                                    series={[
                                        {
                                            name: "Volume",
                                            data: initiators.map((i) => i.collection_volume)
                                        }
                                    ]}
                                    options={{
                                        chart: { id: "initiator-collection-volume", toolbar: { show: false } },
                                        colors: ["#3B82F6"],
                                        xaxis: {
                                            categories: initiators.map((i) => i.name),
                                            labels: {
                                                style: { fontSize: "11px" }
                                            }
                                        },
                                        yaxis: {
                                            labels: {
                                                formatter: (val: number) => formatCurrency(val)
                                            }
                                        },
                                        tooltip: {
                                            y: {
                                                formatter: (val: number) => formatCurrency(val)
                                            }
                                        }
                                    }}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-xs">
                                    No staff collection activity found for this month.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Rankings Column */}
                    <div>
                        <InitiatorStats initiators={initiators} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Metrics;
