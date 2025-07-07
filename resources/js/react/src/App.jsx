import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./services/AuthContex";
import $ from "jquery";
window.$ = $;
window.jQuery = $;
import "./App.css";

function App() {
    return (
        <>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </>
    );
}

export default App;
