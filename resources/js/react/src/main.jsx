import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/bootstrap.min.css';
import './assets/css/font-awesome.min.css';
import './assets/css/fontawesome-stars.css';
import './assets/css/ionicons.min.css';
import './assets/css/animate.min.css';
import './assets/css/jquery-ui.min.css';
import './assets/css/timecircles.min.css';
import './assets/css/style.css';
//import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
// import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";


createRoot(document.getElementById('root')).render(

        <BrowserRouter>
            <App />
        </BrowserRouter>

)
