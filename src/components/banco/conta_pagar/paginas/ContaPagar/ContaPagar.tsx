import React, { useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2, Hash, FileText, Circle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Calendar, DollarSign, User, Tag } from "lucide-react";
import t from "onda-types";
//CONTROLLERS
import { controller } from "@/controllers";
//COMPONENTES
import { BancoFormularioContaPagar } from "../../formularios/ContaPagar";

export const BancoPaginaContaPagar: React.FC = () => {
    const store = new controller({ entidade: "conta_pagar" });
    const pagina_estados = store.get_jsx.pagina;

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const itensPorPagina = pagina_estados.paginacao?.itens_por_pagina || 10;
    const totalItens = pagina_estados.paginacao?.total_itens || 0;
    const totalPaginas = Math.ceil(totalItens / itensPorPagina);

    async function buscarDados(pagina: number, termoBusca: string) {
        await store.api.buscar_pelo_filtro({
            filtros: {
                conta_pagar: {
                    pagina: pagina,
                    fornecedor: termoBusca,
                },
            },
        });
    }

    useEffect(() => {
        buscarDados(1, "");
    }, []);

    function handleEdit(item: t.Banco.Controllers.ContaPagar.ContaPagarBase) {
        store.set_state((store) => {
            store.states.formulario.open = true;
            store.states.formulario.item = item;
        });
    }

    async function handleDelete(id: string) {
        if (window.confirm("Tem certeza que deseja deletar esta conta a pagar?")) {
            await store.api.deletar_pelo_id({ _id: id });
        }
    }

    async function handleCreate() {
        store.set_state((store) => {
            store.states.formulario.open = true;
            store.states.formulario.item = undefined;
        });
    }

    function handleBuscar() {
        setPaginaAtual(1);
        buscarDados(1, searchTerm);
    }

    function irParaPagina(pagina: number) {
        if (pagina >= 1 && pagina <= totalPaginas) {
            setPaginaAtual(pagina);
            buscarDados(pagina, searchTerm);
        }
    }

    const gerarBotoesPaginacao = () => {
        const botoes = [];
        const maxBotoes = 5;

        let inicio = Math.max(1, paginaAtual - Math.floor(maxBotoes / 2));
        let fim = Math.min(totalPaginas, inicio + maxBotoes - 1);

        if (fim - inicio + 1 < maxBotoes) {
            inicio = Math.max(1, fim - maxBotoes + 1);
        }

        for (let i = inicio; i <= fim; i++) {
            botoes.push(
                <button color={paginaAtual === i ? "primary" : "standard"} key={i} onClick={() => irParaPagina(i)}>
                    {i}
                </button>
            );
        }

        return botoes;
    };

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(valor);
    };

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString("pt-BR");
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pago":
                return "text-green-600 bg-green-100";
            case "pendente":
                return "text-yellow-600 bg-yellow-100";
            case "cancelado":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    const getFormaPagamentoIcon = (forma: string) => {
        switch (forma) {
            case "boleto":
                return <FileText className="w-4 h-4" />;
            case "transferencia":
                return <DollarSign className="w-4 h-4" />;
            case "dinheiro":
                return <Circle className="w-4 h-4" />;
            case "cartao":
                return <Hash className="w-4 h-4" />;
            default:
                return <DollarSign className="w-4 h-4" />;
        }
    };

    if (pagina_estados.loading && !pagina_estados.itens) {
        return (
            <div className="h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Carregando contas a pagar...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen min-w-full bg-gray-50 p-6 flex flex-col">
            <BancoFormularioContaPagar />
            <div className="min-w-full mx-auto flex-1 flex flex-col min-h-0">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col flex-1 min-h-0">
                    <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Contas a Pagar</h1>
                            <p className="text-sm text-gray-500">Gerencie e filtre as contas a pagar do sistema.</p>
                        </div>

                        <div className="flex items-center gap-x-3">
                            <div className="relative w-2xs">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    color="primary"
                                    type="search"
                                    placeholder="Buscar fornecedor..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
                                />
                            </div>

                            <button
                                color="primary"
                                onClick={handleCreate}
                                className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
                                title="Nova Conta"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="hidden sm:inline sm:ml-2">Nova</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 relative">
                        {pagina_estados.loading && (
                            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <span className="text-gray-600">Atualizando...</span>
                                </div>
                            </div>
                        )}
                        <div className="space-y-3">
                            {pagina_estados.itens?.map((item: any) => (
                                <div key={item._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 flex-1">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-3 mb-1">
                                                    <h3 className="font-semibold text-gray-900 text-lg">{item.descricao}</h3>
                                                    <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                                        <User className="w-3 h-3 mr-1" />
                                                        {item.fornecedor}
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-4 mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                                        <span className="text-lg font-bold text-green-600">{formatarMoeda(item.valor)}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">Venc: {formatarData(item.data_vencimento)}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Tag className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">{item.categoria}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-6 ml-4">
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {getFormaPagamentoIcon(item.forma_pagamento)}
                                                <span className="text-sm text-gray-600 capitalize">{item.forma_pagamento}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Circle className={`w-3 h-3 ${item.ativo ? "text-green-500 fill-current" : "text-gray-400"}`} />
                                                <span className={`text-sm font-medium ${item.ativo ? "text-green-600" : "text-gray-500"}`}>{item.ativo ? "Ativo" : "Inativo"}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1 ml-4">
                                            <button
                                                color="primary"
                                                onClick={() => handleEdit(item)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                color="primary"
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {!pagina_estados.loading && (!pagina_estados.itens || pagina_estados.itens.length === 0) && (
                                <div className="text-center py-12 text-gray-500">
                                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p>Nenhuma conta a pagar encontrada para os filtros aplicados.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Mostrando {totalItens > 0 ? (paginaAtual - 1) * itensPorPagina + 1 : 0} até {Math.min(paginaAtual * itensPorPagina, totalItens) || 0} de{" "}
                                {totalItens} resultados, total de {pagina_estados.paginacao?.total_itens_pagina_atual || 0} itens
                            </div>
                            {totalPaginas > 1 && (
                                <div className="flex items-center space-x-2">
                                    <button color="default" onClick={() => irParaPagina(1)} disabled={paginaAtual === 1 || pagina_estados.loading} title="Primeira página">
                                        <ChevronsLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        color="default"
                                        onClick={() => irParaPagina(paginaAtual - 1)}
                                        disabled={paginaAtual === 1 || pagina_estados.loading}
                                        title="Página anterior"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <div className="flex items-center space-x-1">{gerarBotoesPaginacao()}</div>
                                    <button
                                        color="default"
                                        onClick={() => irParaPagina(paginaAtual + 1)}
                                        disabled={paginaAtual === totalPaginas || pagina_estados.loading}
                                        title="Próxima página"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <button
                                        color="default"
                                        onClick={() => irParaPagina(totalPaginas)}
                                        disabled={paginaAtual === totalPaginas || pagina_estados.loading}
                                        title="Última página"
                                    >
                                        <ChevronsRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
