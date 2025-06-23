import React, { useState } from "react";
import { ChevronDown, ChevronRight, FileText, Layout, Square, Package, Menu, X } from "lucide-react";

export default function Sidebar() {
    const [expandedItems, setExpandedItems] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Estrutura de navegação
    const navigationItems = [
        {
            id: "app1",
            label: "Aplicativo 1",
            icon: Package,
            children: [
                {
                    id: "app1-forms",
                    label: "Formulários",
                    icon: FileText,
                    children: [
                        { id: "form1", label: "Formulário de Cadastro" },
                        { id: "form2", label: "Formulário de Login" },
                        { id: "form3", label: "Formulário de Contato" },
                    ],
                },
                {
                    id: "app1-pages",
                    label: "Páginas",
                    icon: Layout,
                    children: [
                        { id: "page1", label: "Dashboard" },
                        { id: "page2", label: "Listagem de Usuários" },
                        { id: "page3", label: "Perfil" },
                    ],
                },
                {
                    id: "app1-modals",
                    label: "Modais",
                    icon: Square,
                    children: [
                        { id: "modal1", label: "Modal de Confirmação" },
                        { id: "modal2", label: "Modal de Edição" },
                        { id: "modal3", label: "Modal de Detalhes" },
                    ],
                },
            ],
        },
        {
            id: "app2",
            label: "Aplicativo 2",
            icon: Package,
            children: [
                {
                    id: "app2-forms",
                    label: "Formulários",
                    icon: FileText,
                    children: [
                        { id: "form4", label: "Formulário de Pedido" },
                        { id: "form5", label: "Formulário de Pagamento" },
                    ],
                },
                {
                    id: "app2-pages",
                    label: "Páginas",
                    icon: Layout,
                    children: [
                        { id: "page4", label: "Catálogo" },
                        { id: "page5", label: "Carrinho" },
                    ],
                },
                {
                    id: "app2-modals",
                    label: "Modais",
                    icon: Square,
                    children: [
                        { id: "modal4", label: "Modal de Produto" },
                        { id: "modal5", label: "Modal de Checkout" },
                    ],
                },
            ],
        },
    ];

    const toggleExpanded = (itemId) => {
        setExpandedItems((prev) => ({
            ...prev,
            [itemId]: !prev[itemId],
        }));
    };

    const renderNavItem = (item, level = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems[item.id];
        const Icon = item.icon;

        return (
            <div key={item.id} className="w-full">
                <button
                    onClick={() => hasChildren && toggleExpanded(item.id)}
                    className={`
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

                {hasChildren && isExpanded && <div className="mt-1">{item.children.map((child) => renderNavItem(child, level + 1))}</div>}
            </div>
        );
    };

    return (
        <>
            {/* Botão Mobile */}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg lg:hidden">
                {isSidebarOpen ? <X className="w-5 h-5 text-gray-700 dark:text-gray-300" /> : <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
            </button>

            {/* Overlay Mobile */}
            {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

            {/* Sidebar */}
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
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Documentação</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Componentes do Sistema</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-1">{navigationItems.map((item) => renderNavItem(item))}</div>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-500 text-center">v1.0.0 • Última atualização: Hoje</p>
                </div>
            </aside>
        </>
    );
}
