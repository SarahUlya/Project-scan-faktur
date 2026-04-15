import { DUMMY_DASHBOARD } from "../data/index";
import useLocalStorage from "./useLocalStorage";

export default function useDashboardData() {
  const [dashboard, setDashboard] = useLocalStorage("dashboard-data", DUMMY_DASHBOARD);
  return [dashboard, setDashboard];
}
