import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Save, Loader2, DollarSign, Calendar, User, Tag, FileText } from "lucide-react";
import t from "onda-types";

//CONTROLLERS
import controller_conta_pagar from "@/controllers/banco/controller_contas_pagar";
//COMPONENTES
import FormLoadingSubmit from "@/geral/FormLoadingSubmit";

const BancoFormularioContaPagar: React.FC = () => {
    const formulario = controller_conta_pagar.contexto.jsx.get_formulario();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<t.Banco.Controllers.ContaPagar.Criar.Input>({
        resolver: zodResolver(t.Banco.Controllers.ContaPagar.Criar.InputSchema as t.Banco.Controllers.ContaPagar.Criar.Input | any),
        defaultValues: {
            data: {
                conta_pagar: {
                    fornecedor: "",
                    descricao: "",
                    valor: 0,
                    data_emissao: new Date().toISOString().split("T")[0],
                    data_vencimento: "",
                    data_pagamento: null,
                    status: "pendente",
                    forma_pagamento: "boleto",
                    categoria: "",
                    deletado: false,
                    ativo: true,
                },
            },
        },
    });

    useEffect(() => {
        if (formulario.conta_pagar?.data?.conta_pagar && formulario.conta_pagar_id) {
            const contaPagar = formulario.conta_pagar.data.conta_pagar;

            reset({
                data: {
                    conta_pagar: {
                        fornecedor: contaPagar.fornecedor || "",
                        descricao: contaPagar.descricao || "",
                        valor: contaPagar.valor || 0,
                        data_emissao: contaPagar.data_emissao || new Date().toISOString().split("T")[0],
                        data_vencimento: contaPagar.data_vencimento || "",
                        data_pagamento: contaPagar.data_pagamento || null,
                        status: contaPagar.status || "pendente",
                        forma_pagamento: contaPagar.forma_pagamento || "boleto",
                        categoria: contaPagar.categoria || "",
                        deletado: contaPagar.deletado || false,
                        ativo: contaPagar.ativo !== undefined ? contaPagar.ativo : true,
                    },
                },
            });
        } else {
            reset({
                data: {
                    conta_pagar: {
                        fornecedor: "",
                        descricao: "",
                        valor: 0,
                        data_emissao: new Date().toISOString().split("T")[0],
                        data_vencimento: "",
                        data_pagamento: null,
                        status: "pendente",
                        forma_pagamento: "boleto",
                        categoria: "",
                        deletado: false,
                        ativo: true,
                    },
                },
            });
        }
    }, [formulario.conta_pagar, formulario.conta_pagar_id, reset]);

    const onSubmit = async (data: t.Banco.Controllers.ContaPagar.Criar.Input | t.Banco.Controllers.ContaPagar.AtualizarPeloId.Input | any) => {
        if (formulario.conta_pagar_id) {
            await controller_conta_pagar.api.atualizar_pelo_id({
                data: {
                    conta_pagar: {
                        ...data.data.conta_pagar,
                        _id: formulario.conta_pagar_id,
                    },
                },
            } as t.Banco.Controllers.ContaPagar.AtualizarPeloId.Input);
        } else {
            await controller_conta_pagar.api.criar({
                data: {
                    conta_pagar: {
                        ...data.data.conta_pagar,
                    },
                },
            } as t.Banco.Controllers.ContaPagar.Criar.Input);
        }
        controller_conta_pagar.contexto.state.set_close_formulario();
    };

    const handleClose = () => {
        if (!formulario.loading) {
            controller_conta_pagar.contexto.state.set_close_formulario();
        }
    };

    if (!formulario.open) {
        return null;
    }

    const isDisabled = formulario.loading || isSubmitting;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={handleClose} />

            <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl z-50 transform transition-transform">
                <div className="flex flex-col h-full relative">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <DollarSign className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">{formulario.conta_pagar_id ? "Editar Conta a Pagar" : "Nova Conta a Pagar"}</h2>
                                <p className="text-sm text-gray-500">{formulario.conta_pagar_id ? "Atualize os dados da conta" : "Preencha os dados da nova conta"}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isDisabled}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <User className="h-4 w-4" />
                                    Fornecedor
                                </label>
                                <input
                                    {...register("data.conta_pagar.fornecedor")}
                                    type="text"
                                    placeholder="Nome do fornecedor"
                                    disabled={isDisabled}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 disabled:bg-gray-50 disabled:opacity-50 transition-colors"
                                />
                                {errors.data?.conta_pagar?.fornecedor && <p className="text-sm text-red-600">{errors.data.conta_pagar.fornecedor.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <FileText className="h-4 w-4" />
                                    Descrição *
                                </label>
                                <textarea
                                    {...register("data.conta_pagar.descricao")}
                                    placeholder="Descrição da conta a pagar"
                                    rows={3}
                                    disabled={isDisabled}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 disabled:bg-gray-50 disabled:opacity-50 transition-colors"
                                />
                                {errors.data?.conta_pagar?.descricao && <p className="text-sm text-red-600">{errors.data.conta_pagar.descricao.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <DollarSign className="h-4 w-4" />
                                    Valor *
                                </label>
                                <input
                                    {...register("data.conta_pagar.valor", { valueAsNumber: true })}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0,00"
                                    disabled={isDisabled}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 disabled:bg-gray-50 disabled:opacity-50 transition-colors"
                                />
                                {errors.data?.conta_pagar?.valor && <p className="text-sm text-red-600">{errors.data.conta_pagar.valor.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <Calendar className="h-4 w-4" />
                                        Data de Emissão *
                                    </label>
                                    <input
                                        {...register("data.conta_pagar.data_emissao")}
                                        type="date"
                                        disabled={isDisabled}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 disabled:bg-gray-50 disabled:opacity-50 transition-colors"
                                    />
                                    {errors.data?.conta_pagar?.data_emissao && <p className="text-sm text-red-600">{errors.data.conta_pagar.data_emissao.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <Calendar className="h-4 w-4" />
                                        Data de Vencimento *
                                    </label>
                                    <input
                                        {...register("data.conta_pagar.data_vencimento")}
                                        type="date"
                                        disabled={isDisabled}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 disabled:bg-gray-50 disabled:opacity-50 transition-colors"
                                    />
                                    {errors.data?.conta_pagar?.data_vencimento && <p className="text-sm text-red-600">{errors.data.conta_pagar.data_vencimento.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <Calendar className="h-4 w-4" />
                                    Data de Pagamento
                                </label>
                                <input
                                    {...register("data.conta_pagar.data_pagamento")}
                                    type="date"
                                    disabled={isDisabled}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 disabled:bg-gray-50 disabled:opacity-50 transition-colors"
                                />
                                {errors.data?.conta_pagar?.data_pagamento && <p className="text-sm text-red-600">{errors.data.conta_pagar.data_pagamento.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <Tag className="h-4 w-4" />
                                        Status
                                    </label>
                                    <select
                                        {...register("data.conta_pagar.status")}
                                        disabled={isDisabled}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 disabled:bg-gray-50 disabled:opacity-50 transition-colors"
                                    >
                                        <option value="pendente">Pendente</option>
                                        <option value="pago">Pago</option>
                                        <option value="cancelado">Cancelado</option>
                                    </select>
                                    {errors.data?.conta_pagar?.status && <p className="text-sm text-red-600">{errors.data.conta_pagar.status.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <DollarSign className="h-4 w-4" />
                                        Forma de Pagamento *
                                    </label>
                                    <select
                                        {...register("data.conta_pagar.forma_pagamento")}
                                        disabled={isDisabled}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 disabled:bg-gray-50 disabled:opacity-50 transition-colors"
                                    >
                                        <option value="boleto">Boleto</option>
                                        <option value="transferencia">Transferência</option>
                                        <option value="dinheiro">Dinheiro</option>
                                        <option value="cartao">Cartão</option>
                                    </select>
                                    {errors.data?.conta_pagar?.forma_pagamento && <p className="text-sm text-red-600">{errors.data.conta_pagar.forma_pagamento.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <Tag className="h-4 w-4" />
                                    Categoria *
                                </label>
                                <select
                                    {...register("data.conta_pagar.categoria")}
                                    disabled={isDisabled}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 disabled:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                    <option value="">Selecione uma categoria</option>
                                    <option value="alimentacao">Alimentação</option>
                                    <option value="transporte">Transporte</option>
                                    <option value="moradia">Moradia</option>
                                    <option value="saude">Saúde</option>
                                    <option value="educacao">Educação</option>
                                    <option value="lazer">Lazer</option>
                                    <option value="outros">Outros</option>
                                </select>
                                {errors.data?.conta_pagar?.categoria && <p className="text-sm text-red-600">{errors.data.conta_pagar.categoria.message}</p>}
                            </div>
                        </form>
                    </div>

                    <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isDisabled}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit(onSubmit)}
                            disabled={isDisabled}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isDisabled ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Salvar
                                </>
                            )}
                        </button>
                    </div>

                    <FormLoadingSubmit loading={formulario.loading} />
                </div>
            </div>
        </>
    );
};

export default BancoFormularioContaPagar;
