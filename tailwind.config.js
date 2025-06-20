/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            // Suas customizações do tema aqui
        },
    },
    plugins: [],
    // Importante: prefixar classes para evitar conflitos
    prefix: "", // ou use um prefix como 'mylib-' se quiser
};
