import AppRouter from "./routes/AppRouter";
import { ensureDefaultAdminSession } from "./auth/auth";

ensureDefaultAdminSession();

function App() {
  return <AppRouter />;
}

export default App;