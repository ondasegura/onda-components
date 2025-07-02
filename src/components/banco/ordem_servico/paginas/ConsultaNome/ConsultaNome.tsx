import { useEffect, useState } from "react";
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Settings,
    Activity,
    FileText,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Calendar,
    DollarSign,
    MapPin,
    User,
    Tag,
    Mail,
    Phone,
} from "lucide-react";

import utils from "onda-utils";
import t from "onda-types";
import banco_controller_ordem_servico from "@/controllers/banco/banco_controller_ordem_servico";

import { controller } from "@/controllers";

export const PaginaBancoOrdemServicoConsultaNome: React.FC = () => {
    const store = new controller<t.Banco.Controllers.OrdemServico.TController>({ entidade: "ordem_servico" });
    const get_pagina_ordem_servico = store.get_jsx.pagina;

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filtroTipoServico, setFiltroTipoServico] = useState("" as t.Banco.Controllers.OrdemServico.TipoServico | any);
    const [filtroStatus, setFiltroStatus] = useState("");
    const itensPorPagina = get_pagina_ordem_servico?.paginacao?.itens_por_pagina || 10;

    async function buscarDados(
        pagina: number,
        cliente_nome: string,
        tipoServico: t.Banco.Controllers.OrdemServico.TipoServico | any,
        status: t.Banco.Controllers.OrdemServico.OrdemServicoStatus | any
    ) {
        await store.api.buscar_pelo_filtro({
            filtros: {
                ordem_servico: {
                    pagina: pagina,
                    cliente_nome: cliente_nome || null,
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
            if (get_pagina_ordem_servico?.itens?.length === 1 && paginaAtual > 1) {
                irParaPagina(paginaAtual - 1);
            } else {
                irParaPagina(paginaAtual);
            }
        }
    }

    function handleCreate() {
        store.set_state((store) => {
            store.formulario.open = true;
        });
    }

    function handleBuscar() {
        setPaginaAtual(1);
        buscarDados(1, searchTerm, filtroTipoServico, filtroStatus);
    }

    const totalItens = get_pagina_ordem_servico?.paginacao?.total_itens || 0;
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
                <button color={paginaAtual == i ? "standard" : "basic"} key={i} onClick={() => irParaPagina(i)}>
                    {i}
                </button>
            );
        }

        return botoes;
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

    if (get_pagina_ordem_servico?.loading && !get_pagina_ordem_servico) {
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
                                    color="primary"
                                    type="search"
                                    placeholder="Buscar clientes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyUp={(e) => e.key === "Enter" && handleBuscar()}
                                />
                            </div>
                            <div className="relative">
                                <Settings className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <select value={filtroTipoServico} onChange={(e) => setFiltroTipoServico(e.target.value)}>
                                    <option value="">Todos os Tipos</option>
                                    <option value="consulta_nome">Consulta Nome</option>
                                    <option value="limpa_nome">Limpa Nome</option>
                                    <option value="audiencia">Audiência</option>
                                    <option value="contrato">Contrato</option>
                                </select>
                            </div>
                            <div className="relative">
                                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                                    <option value="">Todos os Status</option>
                                    <option value="aguardando_pagamento">Aguardando Pagamento</option>
                                    <option value="aguardando_documentos">Aguardando Documentos</option>
                                    <option value="processando_analise">Processando Análise</option>
                                    <option value="aguardando_assinatura">Aguardando Assinatura</option>
                                    <option value="em_andamento">Em Andamento</option>
                                    <option value="concluido">Concluído</option>
                                    <option value="cancelada">Cancelada</option>
                                </select>
                            </div>

                            <button
                                color="primary"
                                onClick={handleCreate}
                                className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
                                title="Nova Ordem"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="hidden sm:inline sm:ml-2">Cadastrar</span>
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
                            {get_pagina_ordem_servico?.itens?.map((item) => (
                                <div key={item._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 mb-4 border border-slate-200/80">
                                    {/* Header com tipo de serviço e ações fixas */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`flex items-center text-sm px-3 py-1.5 rounded-lg font-medium ${getTipoServicoColor(item.tipo_servico || "")}`}>
                                            <Tag className="w-3.5 h-3.5 mr-2" />
                                            {formatarTipoServico(item.tipo_servico || "")}
                                        </div>

                                        {/* Ações fixas - sempre no mesmo lugar */}
                                        <div className="flex gap-2 ml-4">
                                            <button color="standard" onClick={() => handleEdit(item)} title="Editar">
                                                <Edit className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                            </button>
                                            <button color="primary" onClick={() => handleDelete(item._id)} title="Excluir">
                                                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Grid de informações principais */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
                                        {item.cliente?.nome && (
                                            <div className="flex flex-col space-y-1">
                                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Nome</span>
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                    <span className="font-semibold text-sm text-slate-800 truncate">{utils.form.formatar_nomes(item.cliente.nome)}</span>
                                                </div>
                                            </div>
                                        )}

                                        {item.cliente?.email && (
                                            <div className="flex flex-col space-y-1">
                                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Email</span>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                    <span className="text-sm text-slate-800 truncate" title={item.cliente.email}>
                                                        {item.cliente.email}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {item.cliente?.cpf_cnpj && (
                                            <div className="flex flex-col space-y-1">
                                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">CPF/CNPJ</span>
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                    <span className="font-mono text-sm text-slate-800">{utils.form.formatar_cpf_cnpj(item.cliente.cpf_cnpj)}</span>
                                                </div>
                                            </div>
                                        )}

                                        {item.cliente?.celular && (
                                            <div className="flex flex-col space-y-1">
                                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Celular</span>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                    <span className="font-mono text-sm text-slate-800">{utils.form.formatar_celular(item.cliente.celular)}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col space-y-1">
                                            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Data Criação</span>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span className="text-sm text-slate-800">{utils.data.DD_MM_YYYY_00_00(item.data_criacao)}</span>
                                            </div>
                                        </div>

                                        {item.cobranca?.value && (
                                            <div className="flex flex-col space-y-1">
                                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Valor</span>
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                    <span className="text-lg font-bold text-green-600">{utils.form.formatar_reais(String(item?.cobranca?.value))}</span>
                                                </div>
                                            </div>
                                        )}

                                        {item.fornecedor?.nome && (
                                            <div className="flex flex-col space-y-1">
                                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Fornecedor</span>
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                    <span className="text-sm text-slate-800 truncate">{item.fornecedor.nome}</span>
                                                </div>
                                            </div>
                                        )}
                                        {item.cliente?.endereco?.cep && (
                                            <div className="flex flex-col col-span-1 sm:col-span-2">
                                                {" "}
                                                {/* Adjusted col-span */}
                                                <span className="text-xs text-slate-500 mb-0.5 font-medium">Endereço</span>
                                                <div className="flex items-center gap-1.5 text-slate-800">
                                                    <MapPin className="w-4 h-4 text-slate-400" />
                                                    <span
                                                        className="text-xs truncate cursor-pointer hover:text-blue-600 transition-colors hover:underline"
                                                        onClick={() => {
                                                            const endereco = item.cliente?.endereco;
                                                            const query = `${endereco?.logradouro || ""}, ${endereco?.numero || ""}, ${endereco?.complemento || ""}, ${
                                                                endereco?.bairro || ""
                                                            }, ${endereco?.localidade || ""}, ${endereco?.uf || ""}, ${endereco?.cep || ""}`;
                                                            // Corrected Google Maps URL and query cleaning
                                                            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                                query.replace(/,\s*$/, "").replace(/, ,/g, ",").trim()
                                                            )}`;
                                                            window.open(mapsUrl, "_blank");
                                                        }}
                                                        title="Abrir no Google Maps"
                                                    >
                                                        {`${item.cliente.endereco.logradouro || ""}, ${item.cliente.endereco.numero || ""} - ${
                                                            item.cliente.endereco.bairro || ""
                                                        }, ${item.cliente.endereco.localidade || ""}/${item.cliente.endereco.uf || ""}`}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">steepers</div>
                                </div>
                            ))}
                            {!get_pagina_ordem_servico.loading && get_pagina_ordem_servico?.itens?.length === 0 && (
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
                                resultados, total de {get_pagina_ordem_servico?.paginacao?.total_itens_pagina_atual} itens
                            </div>
                            {totalPaginas > 1 && (
                                <div className="flex items-center space-x-2">
                                    <button color="basic" onClick={() => irParaPagina(1)} disabled={paginaAtual === 1 || get_pagina_ordem_servico.loading} title="Primeira página">
                                        <ChevronsLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        color="basic"
                                        onClick={() => irParaPagina(paginaAtual - 1)}
                                        disabled={paginaAtual === 1 || get_pagina_ordem_servico.loading}
                                        title="Página anterior"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <div className="flex items-center space-x-1">{gerarBotoesPaginacao()}</div>
                                    <button
                                        color="basic"
                                        onClick={() => irParaPagina(paginaAtual + 1)}
                                        disabled={paginaAtual === totalPaginas || get_pagina_ordem_servico.loading}
                                        title="Próxima página"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <button
                                        color="basic"
                                        onClick={() => irParaPagina(totalPaginas)}
                                        disabled={paginaAtual === totalPaginas || get_pagina_ordem_servico.loading}
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
