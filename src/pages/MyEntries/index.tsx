import { useState } from "react";
// import useWidth from "../../hooks/useWidth";
import { formatCurrency } from "../../utils";
import { useMyEntries } from "../../hooks/useApiHooks";
import Badge from "../../components/ui/badge/Badge";
import { TableLoader, Table, TableHeader, TableRow, TableCell, TableBody } from "../../components/ui/table";
import { formatDate } from "../../utils/date";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const MyEntries = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);

    // const { isMobile } = useWidth();

    const { isLoading, data } = useMyEntries(month, year);

    const pageData = data?.data ?? [];

    // if (isLoading) return <TableLoader length={6} />;

    return (
        <>
            <div
                className="sticky top-16 py-10 z-20 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-white/[0.05]"
                style={{ paddingTop: "1rem", paddingBottom: "1rem" }}
            >
                <h2
                    className="text-2xl font-semibold text-center
                        text-gray-900 dark:text-white"
                >
                    Your have {pageData.length} Entries for {months[month - 1]} {year}
                </h2>
                <div className="flex items-center justify-end gap-2 mt-4">
                    <select
                        className="h-11 w-50 appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ml-4"
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                    >
                        {months.map((monthName, idx) => {
                            // Only show months up to the current month if the selected year is the current year
                            const isCurrentYear = year === new Date().getFullYear();
                            const maxMonth = isCurrentYear ? new Date().getMonth() + 1 : 12;
                            if (idx + 1 > maxMonth) return null;
                            return (
                                <option key={idx + 1} value={idx + 1}>
                                    {monthName}
                                </option>
                            );
                        })}
                    </select>
                    <select
                        className="h-11 w-50 appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                    >
                        {Array.from({ length: new Date().getFullYear() - 2024 }, (_, i) => (
                            <option key={i} value={new Date().getFullYear() - i}>
                                {new Date().getFullYear() - i}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {isLoading ? (
                <TableLoader length={4} />
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="hidden lg:block max-w-full overflow-x-auto">
                        <div className="min-w-[1102px]">
                            {pageData.length === 0 ? (
                                <div className="text-center text-gray-400 dark:text-gray-500 py-8">No Entries found.</div>
                            ) : (
                                <Table>
                                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                        <TableRow>
                                            <TableCell isHeader className="">
                                                ID
                                            </TableCell>
                                            <TableCell isHeader className="">
                                                Amount
                                            </TableCell>
                                            <TableCell isHeader className="">
                                                Type
                                            </TableCell>
                                            <TableCell isHeader className="">
                                                Status
                                            </TableCell>
                                            <TableCell isHeader className="">
                                                Description
                                            </TableCell>
                                            {/* <TableCell isHeader className="">
                                                Initiator
                                            </TableCell> */}
                                            <TableCell isHeader className="">
                                                Created At
                                            </TableCell>
                                        </TableRow>
                                    </TableHeader>

                                    {/* Table Body */}
                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                        {pageData.map((transaction) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell className="">{transaction?.id}</TableCell>
                                                <TableCell className="">{formatCurrency(transaction?.amount)}</TableCell>
                                                <TableCell>
                                                    {transaction?.transaction_type}
                                                    {transaction?.meta_data?.customer ? ` (${transaction?.meta_data?.customer})` : ""}
                                                </TableCell>
                                                <TableCell className="">
                                                    <Badge
                                                        variant="light"
                                                        children={transaction?.status}
                                                        color={
                                                            transaction?.status === "completed"
                                                                ? "success"
                                                                : transaction?.status === "pending"
                                                                ? "warning"
                                                                : "error"
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell className="">{transaction?.description}</TableCell>
                                                {/* <TableCell className="">{transaction?.initiator?.name}</TableCell> */}
                                                <TableCell className="">{formatDate(transaction?.created_at, "llll")}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </div>

                    {/* Mobile Cards */}
                    <div className="block lg:hidden px-2 py-4">
                        {pageData.length === 0 ? (
                            <div className="text-center text-gray-400 dark:text-gray-500 py-8">No Entries found.</div>
                        ) : (
                            pageData.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="mb-4 rounded-xl border border-gray-200 dark:border-white/[0.07] p-4 shadow transition hover:shadow-md cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-1/2">
                                            {/* <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Amount</div> */}
                                            <div className="text-sm font-bold text-gray-900 dark:text-success-600">
                                                {formatCurrency(transaction?.amount)}
                                            </div>
                                        </div>
                                        <Badge
                                            variant="light"
                                            children={transaction?.status}
                                            color={
                                                transaction?.status === "completed"
                                                    ? "success"
                                                    : transaction?.status === "pending"
                                                    ? "warning"
                                                    : "error"
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-y-2 mb-2">
                                        <div className="w-1/2">
                                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Type</div>
                                            <div className="text-sm text-gray-700 dark:text-gray-200">
                                                {transaction?.transaction_type}{" "}
                                                {transaction?.meta_data?.customer ? ` (${transaction?.meta_data?.customer})` : ""}
                                            </div>
                                        </div>
                                        <div className="w-1/2 mt-2">
                                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Created</div>
                                            <div className="text-sm text-gray-700 dark:text-gray-200">
                                                {formatDate(transaction?.created_at, "lll")}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-y-2 mb-2">
                                        <div className="w-full">
                                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Description</div>
                                            <div className="text-sm text-gray-700 dark:text-gray-200">{transaction?.description}</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-y-2 mb-2">
                                        <div className="w-1/2">
                                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Approved By</div>
                                            <div className="text-sm text-gray-700 dark:text-gray-200">
                                                {transaction.approvers?.[0]?.approver?.name ?? "--"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default MyEntries;
