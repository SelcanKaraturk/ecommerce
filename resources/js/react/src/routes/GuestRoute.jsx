import { useEffect } from "react";
import { useAuth } from "../services/AuthContex";
import { Navigate } from "react-router-dom";


const GuestRoute = ({ children }) => {
      const { user, fetchUser, loading } = useAuth();

      useEffect(() => {

        if(!user){
            async function fetchData() {
                 await fetchUser();
             }
             fetchData();
        }


      }, [user])

//console.log(user);
  //if (!user && loading) return <div>Yükleniyor...</div>;

  // Kullanıcı varsa login/register sayfasına gitmesin
  if (user) return <Navigate to="/me" replace />;

  // Giriş yapmamışsa children'ı göster (login/register sayfası)
  return children;

};
export default GuestRoute
