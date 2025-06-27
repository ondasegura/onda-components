import {useEffect, useState} from "react";
import {Search, Plus, Edit, Trash2, User, Building2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Mail, Phone, MapPin, CreditCard, Calendar} from "lucide-react";
import utils from "onda-utils";

//CONTROLLER
import financeiro_controller_recebedor from "@/controllers/financeiro/financeiro_controller_recebedor";
//COMPONENTES
import {FinanceiroFormularioRecebedor} from "../../formulario/Recebedor/Recebedor";

export const FinanceiroPaginaRecebedor = () => {
    const get_pagina_recebedor = financeiro_controller_recebedor.contexto.jsx.get_pagina();

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [tipoFiltro, setTipoFiltro] = useState<"individual" | "empresa" | null>(null);
    const itensPorPagina = get_pagina_recebedor.recebedor.data.paginacao.itens_por_pagina;

    async function buscarDados(pagina: number, termoBusca: string) {
        await financeiro_controller_recebedor.api.buscar_pelo_filtro({
            filtros: {
                recebedor: {
                    pagina: pagina,
                    nome: termoBusca,
                    nome_fantasia: termoBusca,
                    razao_social: termoBusca,
                },
            },
        });
    }

    useEffect(() => {
        buscarDados(1, "");
    }, []);

    function handleEdit(item: any) {
        financeiro_controller_recebedor.contexto.state.set_open_formulario(item._id);
    }

    async function handleDelete(id: string) {
        if (window.confirm("Tem certeza que deseja deletar este recebedor?")) {
            await financeiro_controller_recebedor.api.deletar_pelo_id({_id: id});
            if (get_pagina_recebedor?.recebedor?.data?.recebedores?.length === 1 && paginaAtual > 1) {
                irParaPagina(paginaAtual - 1);
            } else {
                irParaPagina(paginaAtual);
            }
        }
    }

    function handleCreate() {
        financeiro_controller_recebedor.contexto.state.set_open_formulario();
        console.log("chamou handleCreate");
    }

    function handleBuscar() {
        setPaginaAtual(1);
        buscarDados(1, searchTerm);
    }

    const totalItens = get_pagina_recebedor?.recebedor?.data?.paginacao.total_itens;
    const totalPaginas = Math.ceil(totalItens / itensPorPagina);

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
                <button
                    key={i}
                    onClick={() => irParaPagina(i)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${paginaAtual === i ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                >
                    {i}
                </button>
            );
        }

        return botoes;
    };

    const formatarDocumento = (documento: string, tipo: string) => {
        if (tipo === "individual") {
            return utils.form.formatar_cpf_cnpj(documento);
        } else {
            return utils.form.formatar_cpf_cnpj(documento);
        }
    };

    const formatarTelefone = (telefones: any[]) => {
        if (telefones && telefones.length > 0) {
            const telefone = telefones[0];
            return `(${telefone.ddd}) ${telefone.numero}`;
        }
        return "Não informado";
    };

    const getTipoIcon = (tipo: string) => {
        return tipo === "individual" ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />;
    };

    const getTipoColor = (tipo: string) => {
        return tipo === "individual" ? "text-blue-600 bg-blue-100" : "text-green-600 bg-green-100";
    };

    if (get_pagina_recebedor.loading && !get_pagina_recebedor) {
        return (
            <div className="h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Carregando recebedores...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen min-w-full bg-gray-50 p-6 flex flex-col">
            <div className="min-w-full mx-auto flex-1 flex flex-col min-h-0">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col flex-1 min-h-0">
                    <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Recebedores</h1>
                            <p className="text-sm text-gray-500">Gerencie e filtre os recebedores do sistema.</p>
                        </div>

                        <div className="flex items-center gap-x-3">
                            <select
                                value={tipoFiltro || ""}
                                onChange={(e) => setTipoFiltro((e.target.value as "individual" | "empresa" | null) || null)}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                                <option value="">Todos os tipos</option>
                                <option value="individual">Individual</option>
                                <option value="empresa">Empresa</option>
                            </select>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Buscar recebedores..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
                                    className="w-48 sm:w-60 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 focus:w-full sm:focus:w-72"
                                />
                            </div>

                            <button
                                onClick={handleCreate}
                                className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
                                title="Novo Recebedor"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="hidden sm:inline sm:ml-2">Novo</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {get_pagina_recebedor.loading && (
                            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <span className="text-gray-600">Atualizando...</span>
                                </div>
                            </div>
                        )}
                        <div className="space-y-3">
                            {get_pagina_recebedor?.recebedor?.data?.recebedores?.map((item: any) => (
                                <div key={item._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 flex-1">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="font-semibold text-gray-900 text-lg">{item.tipo === "individual" ? item.nome : item.razao_social}</h3>
                                                    <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${getTipoColor(item.tipo)}`}>
                                                        {getTipoIcon(item.tipo)}
                                                        <span className="ml-1 capitalize">{item.tipo}</span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <Mail className="w-4 h-4 text-gray-400" />
                                                        <span className="text-gray-600 truncate">{item.email}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <User className="w-4 h-4 text-gray-400" />
                                                        <span className="text-gray-600">{formatarDocumento(item.documento, item.tipo)}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Phone className="w-4 h-4 text-gray-400" />
                                                        <span className="text-gray-600">{formatarTelefone(item.telefones)}</span>
                                                    </div>
                                                    {item.tipo === "empresa" && item.nome_fantasia && (
                                                        <div className="flex items-center space-x-2">
                                                            <Building2 className="w-4 h-4 text-gray-400" />
                                                            <span className="text-gray-600">Nome Fantasia: {item.nome_fantasia}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center space-x-2">
                                                        <CreditCard className="w-4 h-4 text-gray-400" />
                                                        <span className="text-gray-600">Código: {item.codigo}</span>
                                                    </div>
                                                    {item.referencia_externa && (
                                                        <div className="flex items-center space-x-2">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                            <span className="text-gray-600">Ref: {item.referencia_externa}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1 ml-4">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
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
                            {!get_pagina_recebedor.loading && get_pagina_recebedor?.recebedor?.data?.recebedores?.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p>Nenhum recebedor encontrado para os filtros aplicados.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Mostrando {totalItens > 0 ? (paginaAtual - 1) * itensPorPagina + 1 : 0} até {Math.min(paginaAtual * itensPorPagina, totalItens)} de {totalItens}{" "}
                                resultados, total de {get_pagina_recebedor?.recebedor?.data?.paginacao?.total_itens_pagina_atual} itens
                            </div>
                            {totalPaginas > 1 && (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => irParaPagina(1)}
                                        disabled={paginaAtual === 1 || get_pagina_recebedor.loading}
                                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Primeira página"
                                    >
                                        <ChevronsLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => irParaPagina(paginaAtual - 1)}
                                        disabled={paginaAtual === 1 || get_pagina_recebedor.loading}
                                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Página anterior"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <div className="flex items-center space-x-1">{gerarBotoesPaginacao()}</div>
                                    <button
                                        onClick={() => irParaPagina(paginaAtual + 1)}
                                        disabled={paginaAtual === totalPaginas || get_pagina_recebedor.loading}
                                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Próxima página"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => irParaPagina(totalPaginas)}
                                        disabled={paginaAtual === totalPaginas || get_pagina_recebedor.loading}
                                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Última página"
                                    >
                                        <ChevronsRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <FinanceiroFormularioRecebedor />
                </div>
            </div>
        </div>
    );
};
