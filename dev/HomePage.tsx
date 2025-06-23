import { FileText, Layout, Square } from "lucide-react";

export default function HomePage() {
    return (
        <div className="p-8 lg:pl-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Bem-vindo à Documentação</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Selecione um componente na barra lateral para visualizar sua documentação.</p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
                    <FileText className="w-8 h-8 text-blue-500 mb-3" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Formulários</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Componentes de entrada de dados e validação</p>
                </div>

                <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
                    <Layout className="w-8 h-8 text-green-500 mb-3" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Páginas</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Layouts completos e templates de páginas</p>
                </div>

                <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
                    <Square className="w-8 h-8 text-purple-500 mb-3" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Modais</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Diálogos e popups interativos</p>
                </div>
            </div>
        </div>
    );
}
