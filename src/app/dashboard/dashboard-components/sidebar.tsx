"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface MenuItem {
    name: string;
    link: string; 
}

const Sidebar = ()=> {
    const router = useRouter()
    const [menuList, setMenuList] = useState<MenuItem[]>([]);
    const [userRole, setUserRole] = useState("")
    const [loading, setLoading] = useState<boolean>(true); // New loading state

    const studentMenuList = [
        {name: "Videos", link: "/dashboard/videos"}, {name: "Materials", link: "/dashboard/materials"}, 
        {name: "Watch Later", link: "/dashboard/watch-later"}, {name: "History", link: "/dashboard/history"},
        {name: "Settings", link: "/dashboard/settings"}

    ]
    const uploaderMenuList = [
        ...studentMenuList, {name: "Upload Video", link: "/dashboard/upload-video"},
        {name: "Upload Material", link: "/dashboard/upload-material"}

    ]

    const admin2MenuList = [
        ...uploaderMenuList, {name: "Add Department", link: "/dashboard/add-department"}
    ]

    const admin1MenuList = [
        ...admin2MenuList, {name: "Add School", link: "/dashboard/add-school"}
    ]

    useEffect(() => {
        const storedUserData = localStorage.getItem("userData");

        if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            if (userData?.role) {
                if(userData.role == "student") setMenuList(studentMenuList);   
                else if(userData.role == "uploader") setMenuList(uploaderMenuList);
                else if(userData.role == "admin2") setMenuList(admin2MenuList); 
                else if(userData.role == "admin1") setMenuList(admin1MenuList);
                else router.push("/auth")
                setLoading(false);
            }
            else{
                router.push("/auth")
            }
        }
    }, []);
    
    
    if(loading){
        return (
            <div>
                LOADING...
            </div>
        )
    }
    return (
        <div className="w-1/5 min-h-full bg-blue-600 text-white p-4 overflow-y-auto">
            <ul>
                {menuList.map((item) => (
                    <li key={item.link}>
                        <Link href={item.link} className="block py-2 px-4 rounded hover:bg-blue-700">
                            {item.name}
                        </Link>
                    </li>
                ))}

            </ul>
        </div>
    );
}

export default Sidebar;
