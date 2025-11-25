import { useEffect, useState } from "react";
import { getCategoryAll } from "../AdminService";
import { useAuth } from "../AuthContex";

export default function useCategories() {

    const [categories, setCategories] = useState([]);
    const {accessToken} = useAuth();
    useEffect(() => {
         const fetchProducts = async () => {
                    try {
                        const { data } = await getCategoryAll(accessToken);
                        if (data.status === "success") {
                            setCategories(data.categories);
                        }
                    } catch (error) {
                        console.log(error);
                        setCategories([]);
                    }
                };
                fetchProducts();
    }, []);

    return {categories, setCategories};
}
