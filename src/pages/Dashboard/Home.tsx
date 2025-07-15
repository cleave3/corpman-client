import OverviewStats from "./OverviewStats";
import YearlyStats from "./YearlyStats";
import TransactionStats from "./TransactionStats";
import AccessWrapper from "../../components/AccessController";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { PERMISSION_VALUES } from "../../utils";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useMemo } from "react";

export default function Home() {
    const { user } = useAuthStore((state) => state);

    const timeOfDay = useMemo(() => {
        const currentHour = new Date().getHours();
        let timeOfDay = "";
        if (currentHour >= 5 && currentHour < 12) {
            timeOfDay = "morning";
        } else if (currentHour >= 12 && currentHour < 18) {
            timeOfDay = "afternoon";
        } else {
            timeOfDay = "evening";
        }
        return timeOfDay;
    }, []);

    return (
        <>
            <PageBreadcrumb
                pageTitle={
                    <span className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                        Good {timeOfDay}, <span className="text-blue-500">{user?.first_name}</span>
                    </span>
                }
                showNavigation={false}
            />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-6 xl:col-span-8">
                    <OverviewStats />
                </div>
                <div className="col-span-12 xl:col-span-4">
                    <TransactionStats />
                </div>
                <AccessWrapper componentPermissions={[PERMISSION_VALUES.dashboard.dashboard_chart]}>
                    <div className="col-span-12">
                        <YearlyStats />
                    </div>
                </AccessWrapper>
            </div>
        </>
    );
}
