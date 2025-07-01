import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import t from "onda-types";

import utils from "onda-utils";

const PUBLIC_BASE_URL_BACKEND_WORKER_FINANCEIRO = process.env.PUBLIC_BASE_URL_BACKEND_WORKER_FINANCEIRO;

interface ZustandStore {
    states: {
        modal: {
            recebedor_item: t.Financeiro.Controllers.Recebedor.BuscarPeloId.Output;
            loading: boolean;
        };
        pagina: {
            loading: boolean;
            recebedor: t.Financeiro.Controllers.Recebedor.BuscarPeloFiltro.Output;
        };
        formulario: {
            step: number;
            recebedor_id: string;
            recebedor: t.Financeiro.Controllers.Recebedor.BuscarPeloId.Output;
            open: boolean;
            loading: boolean;
            loading_submit: boolean;
            tipo: t.Financeiro.Controllers.Recebedor.Tipo;
            dados_recebedor: {
                nome: string;
                documento: string;
                nome_fantasia: string;
                razao_social: string;
                data_fundacao: string;
                socios_administradores: {
                    nome: string;
                }[];
                email: string;
                conta_bancaria: {
                    nome_titular: string;
                    documento_titular: string;
                };
            };
            dados_recebedor_new: t.Financeiro.Controllers.Recebedor.Criar.Input;
        };
    };
}

const initialStates = {
    modal: {
        recebedor_item: {data: {recebedor: {}}} as t.Financeiro.Controllers.Recebedor.BuscarPeloId.Output,
        loading: false,
    },
    pagina: {
        loading: false,
        recebedor: {data: {recebedor: [], paginacao: {}}} as any,
    },
    formulario: {
        step: 0,
        recebedor_id: "",
        recebedor: {data: {recebedor: {}}} as t.Financeiro.Controllers.Recebedor.BuscarPeloId.Output,
        open: false,
        loading: false,
        loading_submit: false,
        tipo: "" as t.Financeiro.Controllers.Recebedor.Tipo,
        dados_recebedor: {
            nome: "",
            documento: "",
            nome_fantasia: "",
            razao_social: "",
            data_fundacao: "",
            socios_administradores: [
                {
                    nome: "",
                },
            ],
            email: "",
            conta_bancaria: {
                nome_titular: "",
                documento_titular: "",
            },
        },
        dados_recebedor_new: {} as t.Financeiro.Controllers.Recebedor.Criar.Input,
    },
};

const store = create<ZustandStore>()(
    immer(() => ({
        states: initialStates,
    }))
);

const controller_recebedor = class controller_recebedor {
    static api = class api {
        static async criar(props: t.Financeiro.Controllers.Recebedor.Criar.Input): Promise<t.Financeiro.Controllers.Recebedor.Criar.Output> {
            const response = await utils.api.servidor_backend.post(String(PUBLIC_BASE_URL_BACKEND_WORKER_FINANCEIRO), "/financeiro/recebedor", props, true);
            const results: t.Financeiro.Controllers.Recebedor.Criar.Output | undefined = response?.results;

            store.setState((state) => {
                state.states.modal.loading = true;
            });

            if (results?.data?.recebedor) {
                store.setState((state) => {
                    state.states.pagina.recebedor.data.recebedor = utils.update_context.update_array_itens({
                        oldArray: state.states.pagina.recebedor.data.recebedor,
                        newItem: [results.data.recebedor],
                    });
                });
            }

            return results as t.Financeiro.Controllers.Recebedor.Criar.Output;
        }

        static async buscar_pelo_filtro(props: t.Financeiro.Controllers.Recebedor.BuscarPeloFiltro.Input): Promise<t.Financeiro.Controllers.Recebedor.BuscarPeloFiltro.Output> {
            store.setState((state) => {
                state.states.pagina.loading = true;
            });

            const response = await utils.api.servidor_backend.get(String(PUBLIC_BASE_URL_BACKEND_WORKER_FINANCEIRO), "/financeiro/recebedor", true, props.filtros.recebedor);
            const results: t.Financeiro.Controllers.Recebedor.BuscarPeloFiltro.Output | undefined = response?.results;

            if (results?.data?.recebedor) {
                store.setState((state) => {
                    state.states.pagina.recebedor = results;
                });
            }

            store.setState((state) => {
                state.states.pagina.loading = false;
            });

            return results as t.Financeiro.Controllers.Recebedor.BuscarPeloFiltro.Output;
        }

        static async buscar_pelo_id(props: t.Financeiro.Controllers.Recebedor.BuscarPeloId.Input): Promise<t.Financeiro.Controllers.Recebedor.BuscarPeloId.Output> {
            store.setState((state) => {
                state.states.modal.loading = true;
            });

            const response = await utils.api.servidor_backend.get(String(PUBLIC_BASE_URL_BACKEND_WORKER_FINANCEIRO), `/financeiro/recebedor/${props.data.recebedor._id}`, true, {});

            const results: t.Financeiro.Controllers.Recebedor.BuscarPeloId.Output | undefined = response?.results;
            console.log(results, "results");

            if (results?.data?.recebedor)
                store.setState((state) => {
                    state.states.modal.recebedor_item = results;
                });

            store.setState((state) => {
                state.states.modal.loading = false;
            });

            return results as t.Financeiro.Controllers.Recebedor.BuscarPeloId.Output;
        }

        static async atualizar_pelo_id(props: t.Financeiro.Controllers.Recebedor.AtualizarPeloId.Input): Promise<t.Financeiro.Controllers.Recebedor.AtualizarPeloId.Output> {
            store.setState((state) => {
                state.states.modal.loading = true;
            });

            const response = await utils.api.servidor_backend.patch(
                String(PUBLIC_BASE_URL_BACKEND_WORKER_FINANCEIRO),
                `/financeiro/recebedor/${props.data.recebedor._id}`,
                {data: props.data},
                true
            );
            const results: t.Financeiro.Controllers.Recebedor.AtualizarPeloId.Output | undefined = response?.results;

            const recebedorAtualizado = results?.data.recebedor || (results?.data as any)?.recebedor;

            if (recebedorAtualizado) {
                store.setState((state) => {
                    state.states.pagina.recebedor.data.recebedor = utils.update_context.update_array_itens({
                        oldArray: state.states.pagina.recebedor.data.recebedor,
                        newItem: [recebedorAtualizado],
                    });
                    if (state.states.modal.recebedor_item.data.recebedor?._id === recebedorAtualizado._id) {
                        state.states.modal.recebedor_item = {data: {recebedor: recebedorAtualizado}};
                    }
                });
            }

            store.setState((state) => {
                state.states.pagina.loading = false;
            });

            return results as t.Financeiro.Controllers.Recebedor.AtualizarPeloId.Output;
        }

        static async deletar_pelo_id(props: t.Financeiro.Controllers.Recebedor.DeletarPeloId.Input): Promise<t.Financeiro.Controllers.Recebedor.DeletarPeloId.Output> {
            const response = await utils.api.servidor_backend.delete(String(PUBLIC_BASE_URL_BACKEND_WORKER_FINANCEIRO), `/financeiro/recebedor/${props._id}`);
            const results: t.Financeiro.Controllers.Recebedor.DeletarPeloId.Output | undefined = response?.results;

            store.setState((state) => {
                state.states.pagina.recebedor.data.recebedor = utils.update_context.remover_item_pelo_id({
                    oldArray: state.states.pagina.recebedor.data.recebedor,
                    itemToRemove: props._id,
                });
                if (state.states.modal.recebedor_item.data.recebedor?._id === props._id) {
                    state.states.modal.recebedor_item = initialStates.modal.recebedor_item;
                }
            });

            return results as t.Financeiro.Controllers.Recebedor.DeletarPeloId.Output;
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

            static set_state(updater: (props: ZustandStore["states"]) => void) {
                store.setState((state) => {
                    updater(state.states);
                });
            }

            static set_recebedor_item(recebedorData: t.Financeiro.Controllers.Recebedor.BuscarPeloId.Output) {
                store.setState((state) => {
                    state.states.modal.recebedor_item = recebedorData;
                });
            }

            static set_recebedor(recebedorData: t.Financeiro.Controllers.Recebedor.BuscarPeloFiltro.Output) {
                store.setState((state) => {
                    state.states.pagina.recebedor = recebedorData;
                });
            }

            static async set_open_formulario() {
                store.setState((state) => {
                    (state.states.formulario.loading = false), (state.states.formulario.open = true);
                });
            }

            static set_close_formulario() {
                store.setState((state) => {
                    state.states.formulario = {...initialStates.formulario};
                });
            }

            static set_steep_progress(progress: number) {
                store.setState((state) => {
                    state.states.formulario.step = progress;
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

export default controller_recebedor;
