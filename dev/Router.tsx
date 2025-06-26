import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./HomePage";

// PAGINAS DO WAVE
// PAGINAS DO PORTAL
// PAGINAS DO BANCO
import { BancoPaginaContaPagar } from "../src/components/banco/pagina/ContaPagar/ContaPagar";
// PAGINAS DO ANALISANDO
// PAGINAS DO FINANCEIRO
import { PaginaFinanceiroRecebedor } from "../src/components/financeiro/pagina/Recebedor";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "banco/conta-pagar",
                element: <BancoPaginaContaPagar />,
            },
            {
                path: "banco-s8/paginas",
                element: <></>,
            },
            {
                path: "banco-s8/modais",
                element: <></>,
            },
            {
                path: "wave/formularios",
                element: <></>,
            },
            {
                path: "wave/paginas",
                element: <></>,
            },
            {
                path: "wave/modais",
                element: <></>,
            },
            {
                path: "portal/formularios",
                element: <></>,
            },
            {
                path: "portal/paginas",
                element: <></>,
            },
            {
                path: "portal/modais",
                element: <></>,
            },
            {
                path: "analisando/formularios",
                element: <></>,
            },
            {
                path: "analisando/paginas",
                element: <></>,
            },
            {
                path: "analisando/modais",
                element: <></>,
            },
            {
                path: "financeiro/recebedor",
                element: <PaginaFinanceiroRecebedor />,
            },
        ],
    },
]);
