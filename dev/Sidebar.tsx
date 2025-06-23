import React, { useState } from "react";
import package_json from "../package.json";
import { ChevronDown, ChevronRight, Menu, X, FileText, Layout, Square, Package, LucideIcon } from "lucide-react";

interface NavigationItem {
    label: string;
    icon?: LucideIcon;
    path?: string;
    children?: NavigationItem[];
}

interface SidebarProps {
    onItemClick?: (path: string) => void;
}

const navigationItems: NavigationItem[] = [
    {
        label: "Banco s8",
        icon: Package,
        children: [
            {
                label: "Contas pagar",
                icon: FileText,
                path: "/banco/conta-pagar",
            },
        ],
    },
    {
        label: "Wave",
        icon: Package,
        children: [
            {
                label: "Conta pagar",
                icon: FileText,
                path: "/banco/conta-pagar",
            },
        ],
    },
    {
        label: "Portal",
        icon: Package,
        children: [
            {
                label: "Conta pagar",
                icon: FileText,
                path: "/banco/conta-pagar",
            },
        ],
    },
    {
        label: "Analisando",
        icon: Package,
        children: [
            {
                label: "Conta pagar",
                icon: FileText,
                path: "/banco/conta-pagar",
            },
        ],
    },
];

export const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["Banco s8"]));
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

    const toggleExpanded = (label: string): void => {
        setExpandedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(label)) {
                newSet.delete(label);
            } else {
                newSet.add(label);
            }
            return newSet;
        });
    };

    const renderNavItem = (item: NavigationItem, level: number = 0): React.ReactElement => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.has(item.label);
        const Icon = item.icon;

        return (
            <div key={item.label} className="w-full">
                <button
                    onClick={() => {
                        if (hasChildren) {
                            toggleExpanded(item.label);
                        } else if (item.path && onItemClick) {
                            onItemClick(item.path);
                        }
                    }}
                    className={`
                        cursor-pointer
                        w-full flex items-center gap-2 px-3 py-2 text-sm font-medium
                        rounded-lg transition-all duration-200
                        hover:bg-gray-100 dark:hover:bg-gray-800
                        ${level === 0 ? "text-gray-900 dark:text-gray-100" : ""}
                        ${level === 1 ? "text-gray-700 dark:text-gray-300" : ""}
                        ${level === 2 ? "text-gray-600 dark:text-gray-400" : ""}
                        ${!hasChildren ? "hover:text-blue-600 dark:hover:text-blue-400" : ""}
                    `}
                    style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
                >
                    {hasChildren ? (
                        isExpanded ? (
                            <ChevronDown className="w-4 h-4 flex-shrink-0" />
                        ) : (
                            <ChevronRight className="w-4 h-4 flex-shrink-0" />
                        )
                    ) : (
                        <span className="w-4 h-4 flex-shrink-0" />
                    )}

                    {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}

                    <span className="flex-1 text-left truncate">{item.label}</span>
                </button>

                {hasChildren && isExpanded && <div className="mt-1">{item.children!.map((child) => renderNavItem(child, level + 1))}</div>}
            </div>
        );
    };

    return (
        <>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg lg:hidden">
                {isSidebarOpen ? <X className="w-5 h-5 text-gray-700 dark:text-gray-300" /> : <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
            </button>

            {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

            <aside
                className={`
                    fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 
                    border-r border-gray-200 dark:border-gray-800
                    transform transition-transform duration-300 ease-in-out
                    z-40 overflow-hidden flex flex-col
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0 lg:static lg:z-0
                `}
            >
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Documentação</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Componentes por app/entidade</p>
                </div>

                <nav className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-1">{navigationItems.map((item) => renderNavItem(item))}</div>
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-500 text-center">v{package_json.version} • Última atualização</p>
                </div>
            </aside>
        </>
    );
};
