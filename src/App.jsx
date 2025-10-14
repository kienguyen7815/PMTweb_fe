import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";

function App() {
	return (
		<AuthProvider>
			<AppRouter />
		</AuthProvider>
	);
}

export default App;
