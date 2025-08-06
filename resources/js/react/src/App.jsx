import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./services/AuthContex";
import { ToastContainer } from 'react-toastify';
// import $ from "jquery";
// window.$ = $;
// window.jQuery = $;
import "./App.css";

function App() {
    return (
        <>
            <AuthProvider>
                <AppRoutes />
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </AuthProvider>
        </>
    );
}

export default App;
