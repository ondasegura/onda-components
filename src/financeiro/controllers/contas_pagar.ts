import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import t from "onda-types";

import utils from "onda-utils";

const PUBLIC_BASE_URL_BACKEND = process.env.PUBLIC_BASE_URL_BACKEND;

interface ZustandStore {
    states: {
        modal: {
            conta_pagar_item: t.Banco.Controllers.ContaPagar.BuscarPeloId.Output;
            loading: boolean;
        };
        pagina: {
            loading: boolean;
            conta_pagar: t.Banco.Controllers.ContaPagar.BuscarPeloFiltro.Output;
        };
        formulario: {
            conta_pagar_id: string;
            conta_pagar: t.Banco.Controllers.ContaPagar.BuscarPeloId.Output;
            open: boolean;
            loading: boolean;
            loading_submit: boolean;
        };
    };
}

const initialStates = {
    modal: {
        conta_pagar_item: {} as t.Banco.Controllers.ContaPagar.BuscarPeloId.Output,
        loading: false,
    },
    pagina: {
        loading: false,
        conta_pagar: {} as t.Banco.Controllers.ContaPagar.BuscarPeloFiltro.Output,
    },
    formulario: {
        conta_pagar_id: "",
        conta_pagar: {} as t.Banco.Controllers.ContaPagar.BuscarPeloId.Output,
        open: false,
        loading: false,
        loading_submit: false,
    },
};

const store = create<ZustandStore>()(
    immer(() => ({
        states: initialStates,
    }))
);

const controller_conta_pagar = class controller_conta_pagar {
    static api = class api {
        static async criar(props: t.Banco.Controllers.ContaPagar.Criar.Input): Promise<t.Banco.Controllers.ContaPagar.Criar.Output> {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const response = await utils.api.servidor_backend.post(String(PUBLIC_BASE_URL_BACKEND), "/conta-pagar", props, true);
            const results: t.Banco.Controllers.ContaPagar.Criar.Output | undefined = response?.results;

            store.setState((state) => {
                state.states.modal.loading = true;
            });

            if (results?.data?.conta_pagar) {
                store.setState((state) => {
                    state.states.pagina.conta_pagar.data.conta_pagar = utils.update_context.update_array_itens({
                        oldArray: state.states.pagina.conta_pagar.data.conta_pagar,
                        newItem: [results.data.conta_pagar],
                    });
                    const set_paginacao = state.states.pagina.conta_pagar.data.paginacao;
                    set_paginacao.itens_por_pagina = set_paginacao.itens_por_pagina + 1;
                    set_paginacao.total_itens = set_paginacao.total_itens + 1;
                    set_paginacao.total_itens_pagina_atual = set_paginacao.total_itens_pagina_atual + 1;
                });
            }

            return results as t.Banco.Controllers.ContaPagar.Criar.Output;
        }

        static async buscar_pelo_filtro(props: t.Banco.Controllers.ContaPagar.BuscarPeloFiltro.Input): Promise<t.Banco.Controllers.ContaPagar.BuscarPeloFiltro.Output> {
            store.setState((state) => {
                state.states.pagina.loading = true;
            });

            const response = await utils.api.servidor_backend.get(String(PUBLIC_BASE_URL_BACKEND), "/contas-pagar", true, props.filtros.conta_pagar);
            const results: t.Banco.Controllers.ContaPagar.BuscarPeloFiltro.Output | undefined = response?.results;

            if (results?.data?.conta_pagar) {
                store.setState((state) => {
                    state.states.pagina.conta_pagar = results;
                });
            }

            store.setState((state) => {
                state.states.pagina.loading = false;
            });

            return results as t.Banco.Controllers.ContaPagar.BuscarPeloFiltro.Output;
        }

        static async buscar_pelo_id(props: t.Banco.Controllers.ContaPagar.BuscarPeloId.Input): Promise<t.Banco.Controllers.ContaPagar.BuscarPeloId.Output> {
            store.setState((state) => {
                state.states.modal.loading = true;
            });

            const response = await utils.api.servidor_backend.get(String(PUBLIC_BASE_URL_BACKEND), `/conta-pagar/${props.data._id}`, true, {});
            const results: t.Banco.Controllers.ContaPagar.BuscarPeloId.Output | undefined = response?.results;

            if (results?.data?.conta_pagar)
                store.setState((state) => {
                    state.states.modal.conta_pagar_item = results;
                });

            store.setState((state) => {
                state.states.modal.loading = false;
            });

            return results as t.Banco.Controllers.ContaPagar.BuscarPeloId.Output;
        }

        static async atualizar_pelo_id(props: t.Banco.Controllers.ContaPagar.AtualizarPeloId.Input): Promise<t.Banco.Controllers.ContaPagar.AtualizarPeloId.Output> {
            store.setState((state) => {
                state.states.modal.loading = true;
            });

            const response = await utils.api.servidor_backend.patch(String(PUBLIC_BASE_URL_BACKEND), `/conta-pagar/${props.data.conta_pagar._id}`, {data: props.data}, true);
            const results: t.Banco.Controllers.ContaPagar.AtualizarPeloId.Output | undefined = response?.results;

            const contaPagarAtualizada = results?.data.conta_pagar || (results?.data as any)?.conta_pagar;

            if (contaPagarAtualizada) {
                store.setState((state) => {
                    state.states.pagina.conta_pagar.data.conta_pagar = utils.update_context.update_array_itens({
                        oldArray: state.states.pagina.conta_pagar.data.conta_pagar,
                        newItem: [contaPagarAtualizada],
                    });
                    if (state.states.modal.conta_pagar_item.data.conta_pagar?._id === contaPagarAtualizada._id) {
                        state.states.modal.conta_pagar_item = {data: {conta_pagar: contaPagarAtualizada}};
                    }
                });
            }

            store.setState((state) => {
                state.states.pagina.loading = false;
            });

            return results as t.Banco.Controllers.ContaPagar.AtualizarPeloId.Output;
        }

        static async deletar_pelo_id(props: t.Banco.Controllers.ContaPagar.DeletarPeloId.Input): Promise<t.Banco.Controllers.ContaPagar.DeletarPeloId.Output> {
            const response = await utils.api.servidor_backend.delete(String(PUBLIC_BASE_URL_BACKEND), `/conta-pagar/${props._id}`);
            const results: t.Banco.Controllers.ContaPagar.DeletarPeloId.Output | undefined = response?.results;

            store.setState((state) => {
                state.states.pagina.conta_pagar.data.conta_pagar = utils.update_context.remover_item_pelo_id({
                    oldArray: state.states.pagina.conta_pagar.data.conta_pagar,
                    itemToRemove: props._id,
                });
                const set_paginacao = state.states.pagina.conta_pagar.data.paginacao;
                set_paginacao.itens_por_pagina = set_paginacao.itens_por_pagina - 1;
                set_paginacao.total_itens = set_paginacao.total_itens - 1;
                set_paginacao.total_itens_pagina_atual = set_paginacao.total_itens_pagina_atual - 1;
            });

            return results as t.Banco.Controllers.ContaPagar.DeletarPeloId.Output;
        }
    };

    static contexto = class contexto {
        static jsx = class jsx {
            static get_formulario(): ZustandStore["states"]["formulario"] {
                return store((state) => state.states.formulario);
            }

            static get_pagina(): ZustandStore["states"]["pagina"] {
                return store((state) => state.states.pagina);
            }

            static get_modal(): ZustandStore["states"]["modal"] {
                return store((state) => state.states.modal);
            }
        };

        static state = class state {
            static reset() {
                store.setState(() => ({states: initialStates}));
            }

            static set_conta_pagar_item(contaPagarData: t.Banco.Controllers.ContaPagar.BuscarPeloId.Output) {
                store.setState((state) => {
                    state.states.modal.conta_pagar_item = contaPagarData;
                });
            }

            static set_conta_pagar(contaPagarData: t.Banco.Controllers.ContaPagar.BuscarPeloFiltro.Output) {
                store.setState((state) => {
                    state.states.pagina.conta_pagar = contaPagarData;
                });
            }

            static async set_open_formulario(conta_pagar_id?: string) {
                store.setState((state) => {
                    (state.states.formulario.loading = true), (state.states.formulario.open = true);
                });
                if (conta_pagar_id) {
                    try {
                        const result = await controller_conta_pagar.api.buscar_pelo_id({data: {_id: conta_pagar_id}});
                        if (result?.data?.conta_pagar) {
                            store.setState((state) => {
                                state.states.formulario.conta_pagar = result;
                                state.states.formulario.loading = false;
                            });
                        } else {
                            store.setState((state) => {
                                state.states.formulario.loading = false;
                            });
                        }
                    } catch (error) {
                        store.setState((state) => {
                            state.states.formulario.loading = false;
                        });
                        console.error("Erro ao buscar conta a pagar:", error);
                    }
                }

                store.setState((state) => {
                    state.states.formulario.loading = false;
                });
            }

            static set_close_formulario() {
                store.setState((state) => {
                    (state.states.formulario.loading = false), (state.states.formulario.open = false);
                });
            }

            static get_state_formulario(): ZustandStore["states"]["formulario"] {
                return store.getState().states.formulario;
            }

            static get_state_modal(): ZustandStore["states"]["modal"] {
                return store.getState().states.modal;
            }

            static get_state_pagina(): ZustandStore["states"]["pagina"] {
                return store.getState().states.pagina;
            }
        };
    };

    static websocket = class websocket {};
};
export default controller_conta_pagar;
