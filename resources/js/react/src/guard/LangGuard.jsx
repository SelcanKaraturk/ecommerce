import { useParams, Navigate, Outlet } from "react-router-dom";

const allowedLangs = ['tr', 'en', 'fr'];

export default function LangGuard() {
  const { lang } = useParams();

  if (!allowedLangs.includes(lang)) {
    return <Navigate to="/tr" replace />;
  }

  return <Outlet />;
}
