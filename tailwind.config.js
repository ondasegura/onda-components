/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}", "./dist/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#eff6ff",
                    500: "#3b82f6",
                    600: "#2563eb",
                    700: "#1d4ed8",
                },
            },
        },
    },
    plugins: [],

    // Configuração importante para bibliotecas - preserva todas as classes usadas
    safelist: [
        // Classes base do componente Pagina
        "min-h-screen",
        "w-full",
        "p-6",
        "mb-8",
        "border-b",
        "border-gray-200",
        "pb-4",
        "text-3xl",
        "font-bold",
        "text-gray-900",
        "container",
        "mx-auto",
        "max-w-7xl",

        // Variantes de background
        "bg-gray-50",
        "bg-white",
        "bg-gradient-to-br",
        "from-blue-50",
        "to-indigo-100",

        // Variantes de texto
        "text-gray-800",
        "text-gray-900",

        // Padrões dinâmicos
        {
            pattern: /bg-(gray|blue|indigo)-(50|100|200|800|900)/,
        },
        {
            pattern: /text-(gray|blue)-(800|900)/,
        },
    ],
};
