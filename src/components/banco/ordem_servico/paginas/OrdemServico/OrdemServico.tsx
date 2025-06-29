import { useEffect, useState } from "react";
import {
    Search,
    Plus,
    Edit,
    Trash2,
    FileText,
    Circle,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Calendar,
    DollarSign,
    User,
    Tag,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";

import t from "onda-types";
import banco_controller_ordem_servico from "@/controllers/banco/banco_controller_ordem_servico";

export const PaginaBancoOrdemServico: React.FC = () => {
    const get_pagina_ordem_servico = banco_controller_ordem_servico.contexto.jsx.get_pagina();

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filtroTipoServico, setFiltroTipoServico] = useState("" as t.Banco.Controllers.OrdemServico.TipoServico | any);
    const [filtroStatus, setFiltroStatus] = useState("");
    const itensPorPagina = get_pagina_ordem_servico.ordem_servico.data.paginacao?.itens_por_pagina || 10;

    async function buscarDados(
        pagina: number,
        termoBusca: string,
        tipoServico: t.Banco.Controllers.OrdemServico.TipoServico | any,
        status: t.Banco.Controllers.OrdemServico.OrdemServicoStatus | any
    ) {
        await banco_controller_ordem_servico.api.buscar_pelo_filtro({
            filtros: {
                ordem_servico: {
                    pagina: pagina,
                    titulo: termoBusca || null,
                    tipo_servico: tipoServico || null,
                    status: status || null,
                },
            },
        });
    }

    useEffect(() => {
        buscarDados(1, "", "", "");
    }, []);

    function handleEdit(item: any) {
        banco_controller_ordem_servico.contexto.state.set_open_formulario(item._id);
    }

    async function handleDelete(id: string) {
        if (window.confirm("Tem certeza que deseja deletar esta ordem de serviço?")) {
            await banco_controller_ordem_servico.api.deletar_pelo_id({ data: { _id: id } });
            if (get_pagina_ordem_servico?.ordem_servico?.data?.ordens_servico?.length === 1 && paginaAtual > 1) {
                irParaPagina(paginaAtual - 1);
            } else {
                irParaPagina(paginaAtual);
            }
        }
    }

    function handleCreate() {
        banco_controller_ordem_servico.contexto.state.set_open_formulario();
    }

    function handleBuscar() {
        setPaginaAtual(1);
        buscarDados(1, searchTerm, filtroTipoServico, filtroStatus);
    }

    const totalItens = get_pagina_ordem_servico?.ordem_servico?.data?.paginacao?.total_itens || 0;
    const totalPaginas = Math.ceil(totalItens / itensPorPagina);

    function irParaPagina(pagina: number) {
        if (pagina >= 1 && pagina <= totalPaginas) {
            setPaginaAtual(pagina);
            buscarDados(pagina, searchTerm, filtroTipoServico, filtroStatus);
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
            case "concluido":
                return "text-green-600 bg-green-100";
            case "em_andamento":
                return "text-blue-600 bg-blue-100";
            case "aguardando_pagamento":
                return "text-yellow-600 bg-yellow-100";
            case "aguardando_documentos":
                return "text-orange-600 bg-orange-100";
            case "processando_analise":
                return "text-purple-600 bg-purple-100";
            case "aguardando_assinatura":
                return "text-indigo-600 bg-indigo-100";
            case "cancelada":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "concluido":
                return <CheckCircle className="w-4 h-4" />;
            case "em_andamento":
                return <Clock className="w-4 h-4" />;
            case "cancelada":
                return <XCircle className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    const getTipoServicoColor = (tipo: string) => {
        switch (tipo) {
            case "consulta_nome":
                return "text-blue-600 bg-blue-100";
            case "limpa_nome":
                return "text-green-600 bg-green-100";
            case "audiencia":
                return "text-purple-600 bg-purple-100";
            case "contrato":
                return "text-orange-600 bg-orange-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    const formatarTipoServico = (tipo: string) => {
        const tipos = {
            consulta_nome: "Consulta Nome",
            limpa_nome: "Limpa Nome",
            audiencia: "Audiência",
            contrato: "Contrato",
        };
        return tipos[tipo as keyof typeof tipos] || tipo;
    };

    const formatarStatus = (status: string) => {
        const statusMap = {
            aguardando_pagamento: "Aguardando Pagamento",
            aguardando_documentos: "Aguardando Documentos",
            processando_analise: "Processando Análise",
            aguardando_assinatura: "Aguardando Assinatura",
            em_andamento: "Em Andamento",
            concluido: "Concluído",
            cancelada: "Cancelada",
        };
        return statusMap[status as keyof typeof statusMap] || status;
    };

    if (get_pagina_ordem_servico.loading && !get_pagina_ordem_servico) {
        return (
            <div className="h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Carregando ordens de serviço...</span>
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
                            <h1 className="text-xl font-bold text-gray-900">Ordens de Serviço</h1>
                            <p className="text-sm text-gray-500">Gerencie e filtre as ordens de serviço do sistema.</p>
                        </div>

                        <div className="flex items-center gap-x-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Buscar ordens..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleBuscar()}
                                    className="w-48 sm:w-60 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 focus:w-full sm:focus:w-72"
                                />
                            </div>

                            <select
                                value={filtroTipoServico}
                                onChange={(e) => setFiltroTipoServico(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                                <option value="">Todos os Tipos</option>
                                <option value="consulta_nome">Consulta Nome</option>
                                <option value="limpa_nome">Limpa Nome</option>
                                <option value="audiencia">Audiência</option>
                                <option value="contrato">Contrato</option>
                            </select>

                            <select
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                                <option value="">Todos os Status</option>
                                <option value="aguardando_pagamento">Aguardando Pagamento</option>
                                <option value="aguardando_documentos">Aguardando Documentos</option>
                                <option value="processando_analise">Processando Análise</option>
                                <option value="aguardando_assinatura">Aguardando Assinatura</option>
                                <option value="em_andamento">Em Andamento</option>
                                <option value="concluido">Concluído</option>
                                <option value="cancelada">Cancelada</option>
                            </select>

                            <button
                                onClick={handleCreate}
                                className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
                                title="Nova Ordem"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="hidden sm:inline sm:ml-2">Nova</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {get_pagina_ordem_servico.loading && (
                            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <span className="text-gray-600">Atualizando...</span>
                                </div>
                            </div>
                        )}
                        <div className="space-y-3">
                            {get_pagina_ordem_servico?.ordem_servico?.data?.ordens_servico?.map((item) => (
                                <div key={item._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 flex-1">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-3 mb-1">
                                                    <h3 className="font-semibold text-gray-900 text-lg">{item.titulo || "Sem título"}</h3>
                                                    <div className={`flex items-center text-sm px-2 py-1 rounded-md ${getTipoServicoColor(item.tipo_servico || "")}`}>
                                                        <Tag className="w-3 h-3 mr-1" />
                                                        {formatarTipoServico(item.tipo_servico || "")}
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-4 mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        <User className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">{item.cliente?.nome || "Cliente não informado"}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">Criado: {formatarData(item.data_criacao)}</span>
                                                    </div>
                                                    {item.info_pagamento?.valor && (
                                                        <div className="flex items-center space-x-2">
                                                            <DollarSign className="w-4 h-4 text-gray-400" />
                                                            <span className="text-lg font-bold text-green-600">{formatarMoeda(item.info_pagamento.valor)}</span>
                                                        </div>
                                                    )}
                                                    {item.fornecedor?.nome && (
                                                        <div className="flex items-center space-x-2">
                                                            <User className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm text-gray-600">Fornecedor: {item.fornecedor.nome}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {item.descricao && <p className="text-sm text-gray-500 mt-2">{item.descricao}</p>}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-6 ml-4">
                                            <div className="flex items-center space-x-2">
                                                {getStatusIcon(item.status)}
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>{formatarStatus(item.status)}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Circle className={`w-3 h-3 ${item.pagamento_efetuado ? "text-green-500 fill-current" : "text-red-400"}`} />
                                                <span className={`text-sm font-medium ${item.pagamento_efetuado ? "text-green-600" : "text-red-500"}`}>
                                                    {item.pagamento_efetuado ? "Pago" : "Pendente"}
                                                </span>
                                            </div>
                                            {item.documento_assinado && (
                                                <div className="flex items-center space-x-2">
                                                    <CheckCircle className="w-3 h-3 text-blue-500 fill-current" />
                                                    <span className="text-sm font-medium text-blue-600">Assinado</span>
                                                </div>
                                            )}
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
                            {!get_pagina_ordem_servico.loading && get_pagina_ordem_servico?.ordem_servico?.data?.ordens_servico?.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p>Nenhuma ordem de serviço encontrada para os filtros aplicados.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Mostrando {totalItens > 0 ? (paginaAtual - 1) * itensPorPagina + 1 : 0} até {Math.min(paginaAtual * itensPorPagina, totalItens)} de {totalItens}{" "}
                                resultados, total de {get_pagina_ordem_servico?.ordem_servico?.data?.paginacao?.total_itens_pagina_atual} itens
                            </div>
                            {totalPaginas > 1 && (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => irParaPagina(1)}
                                        disabled={paginaAtual === 1 || get_pagina_ordem_servico.loading}
                                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Primeira página"
                                    >
                                        <ChevronsLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => irParaPagina(paginaAtual - 1)}
                                        disabled={paginaAtual === 1 || get_pagina_ordem_servico.loading}
                                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Página anterior"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <div className="flex items-center space-x-1">{gerarBotoesPaginacao()}</div>
                                    <button
                                        onClick={() => irParaPagina(paginaAtual + 1)}
                                        disabled={paginaAtual === totalPaginas || get_pagina_ordem_servico.loading}
                                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Próxima página"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => irParaPagina(totalPaginas)}
                                        disabled={paginaAtual === totalPaginas || get_pagina_ordem_servico.loading}
                                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
