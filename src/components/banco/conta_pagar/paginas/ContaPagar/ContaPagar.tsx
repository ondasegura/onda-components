import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Plus, ArrowUp, Edit, DollarSign, Calendar, User, FileText } from "lucide-react";
import { controller } from "@/controllers/banco/banco_controller_contas_pagar";

const contaPagarSchema = z.object({
    fornecedor: z.string().min(1, "Fornecedor é obrigatório"),
    descricao: z.string().min(1, "Descrição é obrigatória"),
    valor: z
        .string()
        .min(1, "Valor é obrigatório")
        .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Valor deve ser um número positivo"),
    data_emissao: z.string().min(1, "Data de emissão é obrigatória"),
    data_vencimento: z.string().min(1, "Data de vencimento é obrigatória"),
    status: z.enum(["pendente", "cancelado", "pago"]),
    forma_pagamento: z.enum(["boleto", "transferencia", "cartao", "dinheiro", "pix"]),
    categoria: z.enum(["operacional", "financeira", "administrativa"]),
});

type ContaPagarFormData = z.infer<typeof contaPagarSchema>;

export function BancoPaginaContaPagar() {
    const store = new controller({ entidade: "conta_pagar" });

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm<ContaPagarFormData>({
        resolver: zodResolver(contaPagarSchema),
        defaultValues: {
            fornecedor: "",
            descricao: "",
            valor: "",
            data_emissao: "",
            data_vencimento: "",
            status: "pendente",
            forma_pagamento: "boleto",
            categoria: "operacional",
        },
        mode: "onChange",
    });

    const criarNovoItem = (data: ContaPagarFormData) => {
        return {
            _id: `new-${Date.now()}`,
            data_criacao: new Date().toISOString(),
            usuario_criacao: null,
            data_atualizacao: null,
            usuario_atualizacao: null,
            excluido: false,
            usuario_exclusao: null,
            data_exclusao: null,
            fornecedor: data.fornecedor,
            descricao: data.descricao,
            valor: data.valor,
            data_emissao: data.data_emissao,
            data_vencimento: data.data_vencimento,
            status: data.status,
            forma_pagamento: data.forma_pagamento,
            categoria: data.categoria,
            data_pagamento: null,
            deletado: false,
            ativo: true,
        };
    };

    const onSubmitAdicionarFinal = (data: ContaPagarFormData) => {
        const novoItem = criarNovoItem(data);
        store.set_state((store) => {
            store.states.pagina.itens?.push(novoItem);
        });
        reset();
    };

    const onSubmitAdicionarInicio = (data: ContaPagarFormData) => {
        const novoItem = criarNovoItem(data);
        store.set_state((store) => {
            store.states.pagina.itens?.unshift(novoItem);
        });
        reset();
    };

    const removerItem = (index: number) => {
        store.set_state((store) => {
            store.states.pagina.itens?.splice(index, 1);
        });
    };

    const formatarValor = (valor: string) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(parseFloat(valor));
    };

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString("pt-BR");
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pendente":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "cancelado":
                return "bg-red-100 text-red-800 border-red-200";
            case "pago":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getCategoriaColor = (categoria: string) => {
        switch (categoria) {
            case "financeira":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "administrativa":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "operacional":
                return "bg-orange-100 text-orange-800 border-orange-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const handleCancelar = () => {
        store.set_state((store) => {
            store.states.formulario.open = false;
        });
        reset();
    };

    useEffect(() => {
        const filtro = {
            filtros: {
                conta_pagar: {
                    pagina: 1,
                },
            },
        };
        store.api.buscar_pelo_filtro(filtro);
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Contas a Pagar</h1>
                </div>
                <button
                    type="button"
                    color="primary"
                    onClick={() =>
                        store.set_state((store) => {
                            store.states.formulario.open = true;
                        })
                    }
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                    <Plus className="w-4 h-4" />
                    Nova Conta
                </button>
            </div>

            {store.get_jsx.formulario.open && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-blue-200">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Adicionar Nova Conta</h2>
                    </div>

                    <form>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <User className="w-4 h-4" />
                                    Fornecedor
                                </label>
                                <input
                                    color="primary"
                                    type="text"
                                    {...register("fornecedor")}
                                    placeholder="Nome do fornecedor"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.fornecedor ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {errors.fornecedor && <p className="text-red-500 text-xs mt-1">{errors.fornecedor.message}</p>}
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <FileText className="w-4 h-4" />
                                    Descrição
                                </label>
                                <input
                                    color="primary"
                                    type="text"
                                    {...register("descricao")}
                                    placeholder="Descrição da conta"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.descricao ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>}
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <DollarSign className="w-4 h-4" />
                                    Valor
                                </label>
                                <input
                                    color="primary"
                                    type="number"
                                    step="0.01"
                                    {...register("valor")}
                                    placeholder="0.00"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.valor ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {errors.valor && <p className="text-red-500 text-xs mt-1">{errors.valor.message}</p>}
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    Data Emissão
                                </label>
                                <input
                                    color="primary"
                                    type="date"
                                    {...register("data_emissao")}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.data_emissao ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {errors.data_emissao && <p className="text-red-500 text-xs mt-1">{errors.data_emissao.message}</p>}
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    Data Vencimento
                                </label>
                                <input
                                    color="primary"
                                    type="date"
                                    {...register("data_vencimento")}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.data_vencimento ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {errors.data_vencimento && <p className="text-red-500 text-xs mt-1">{errors.data_vencimento.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    {...register("status")}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.status ? "border-red-500" : "border-gray-300"
                                    }`}
                                >
                                    <option value="pendente">Pendente</option>
                                    <option value="cancelado">Cancelado</option>
                                    <option value="pago">Pago</option>
                                </select>
                                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Forma Pagamento</label>
                                <select
                                    {...register("forma_pagamento")}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.forma_pagamento ? "border-red-500" : "border-gray-300"
                                    }`}
                                >
                                    <option value="boleto">Boleto</option>
                                    <option value="transferencia">Transferência</option>
                                    <option value="cartao">Cartão</option>
                                    <option value="dinheiro">Dinheiro</option>
                                    <option value="pix">PIX</option>
                                </select>
                                {errors.forma_pagamento && <p className="text-red-500 text-xs mt-1">{errors.forma_pagamento.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                                <select
                                    {...register("categoria")}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.categoria ? "border-red-500" : "border-gray-300"
                                    }`}
                                >
                                    <option value="operacional">Operacional</option>
                                    <option value="financeira">Financeira</option>
                                    <option value="administrativa">Administrativa</option>
                                </select>
                                {errors.categoria && <p className="text-red-500 text-xs mt-1">{errors.categoria.message}</p>}
                            </div>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                            <button
                                color="primary"
                                type="button"
                                onClick={handleSubmit(onSubmitAdicionarFinal)}
                                disabled={!isValid}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                            >
                                <Plus className="w-4 h-4" />
                                Adicionar no Final
                            </button>

                            <button
                                color="primary"
                                type="button"
                                onClick={handleSubmit(onSubmitAdicionarInicio)}
                                disabled={!isValid}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                            >
                                <ArrowUp className="w-4 h-4" />
                                Adicionar no Início
                            </button>

                            <button
                                type="button"
                                color="primary"
                                onClick={handleCancelar}
                                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {store?.get_jsx?.pagina?.itens?.map((item, index) => (
                    <div key={item._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="w-5 h-5 text-gray-600" />
                                        <h3 className="font-semibold text-lg text-gray-900">{item.fornecedor}</h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FileText className="w-4 h-4" />
                                        <p className="text-sm">{item.descricao}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>{item.status.toUpperCase()}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoriaColor(item.categoria)}`}>{item.categoria.toUpperCase()}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    <div>
                                        <span className="text-xs text-gray-500">Valor:</span>
                                        <p className="font-semibold text-lg text-green-600">{formatarValor(item.valor)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                    <div>
                                        <span className="text-xs text-gray-500">Data Emissão:</span>
                                        <p className="font-medium text-sm">{formatarData(item.data_emissao)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-red-600" />
                                    <div>
                                        <span className="text-xs text-gray-500">Vencimento:</span>
                                        <p className="font-medium text-sm">{formatarData(item.data_vencimento)}</p>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-xs text-gray-500">Forma Pagamento:</span>
                                    <p className="font-medium text-sm capitalize">{item.forma_pagamento}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <div className="text-xs text-gray-500 flex items-center gap-4">
                                    <span>Criado em: {formatarData(item.data_criacao)}</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">Posição: {index + 1}</span>
                                </div>
                                <button
                                    color="primary"
                                    onClick={() => removerItem(index)}
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg text-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Remover
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {store?.get_jsx?.pagina?.itens?.length === 0 && (
                <div className="bg-white rounded-lg shadow-md text-center py-12">
                    <div className="flex flex-col items-center gap-4">
                        <DollarSign className="w-16 h-16 text-gray-300" />
                        <div>
                            <p className="text-gray-500 text-lg font-medium">Nenhuma conta a pagar encontrada</p>
                            <p className="text-gray-400 text-sm mt-2">Adicione uma nova conta para começar</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Edit className="w-5 h-5 text-blue-600" />
                    Validações Implementadas com Zod:
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <code className="bg-white px-2 py-1 rounded text-xs">fornecedor</code>
                            <span>- Campo obrigatório</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <code className="bg-white px-2 py-1 rounded text-xs">valor</code>
                            <span>- Número positivo obrigatório</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <code className="bg-white px-2 py-1 rounded text-xs">datas</code>
                            <span>- Campos de data obrigatórios</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <code className="bg-white px-2 py-1 rounded text-xs">enums</code>
                            <span>- Status, forma de pagamento e categoria validados</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
