/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        // Importante: incluir os caminhos onde a biblioteca será usada
        "./dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // Suas customizações do tema aqui
            colors: {
                // Exemplo de cores customizadas para a biblioteca
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
    // Para bibliotecas, é recomendado usar um prefix para evitar conflitos
    // Descomente a linha abaixo se quiser usar um prefix
    // prefix: 'mylib-',

    // Configuração importante para bibliotecas - preserva todas as classes usadas
    safelist: [
        // Classes que sempre devem ser incluídas no CSS final
        {
            pattern: /bg-(gray|blue|indigo)-(50|100|200|800|900)/,
        },
        {
            pattern: /text-(gray|blue)-(800|900)/,
        },
        {
            pattern: /(min-h-screen|w-full|p-6|mb-8|pb-4|container|mx-auto|max-w-7xl)/,
        },
    ],
};
