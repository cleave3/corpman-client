import { AppCustomRouteProps } from "../../api/types";
import { useAuthStore } from "../../hooks/useAuthStore";
import { hasPermissions } from "../../utils";

const AccessWrapper = ({ componentPermissions = [], children }: AppCustomRouteProps) => {
    const user = useAuthStore((state) => state.user);

    if (componentPermissions.length === 0) return children;

    return hasPermissions(user?.permissions, componentPermissions) ? children : null;
};

export default AccessWrapper;
