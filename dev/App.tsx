import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export default function App() {
    const navigate = useNavigate();

    const handleItemClick = (path: string): void => {
        navigate(path);
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
            <Sidebar onItemClick={handleItemClick} />
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
