import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import t from "onda-types";

import utils from "onda-utils";

const PUBLIC_BASE_URL_BACKEND_BANCO_S8 = process.env.PUBLIC_BASE_URL_BACKEND_BANCO_S8;

interface ZustandStore {
    states: {
        modal: {
            ordem_servico_item: t.Banco.Controllers.OrdemServico.BuscarPeloId.Output;
            loading: boolean;
        }
        pagina: {
            loading: boolean;
            ordem_servico: t.Banco.Controllers.OrdemServico.BuscarPeloFiltro.Output;
        }
        formulario: {
            ordem_servico_id: string;
            ordem_servico: t.Banco.Controllers.OrdemServico.BuscarPeloId.Output;
            open: boolean;
            loading: boolean;
            loading_submit: boolean;
        };
    };
}

const initialStates = {
    modal: {
        ordem_servico_item: { data: { ordem_servico: {} } } as t.Banco.Controllers.OrdemServico.BuscarPeloId.Output,
        loading: false,
    },
    pagina: {
        ordem_servico: { data: { ordens_servico: [], paginacao: {} } } as t.Banco.Controllers.OrdemServico.BuscarPeloFiltro.Output,
        loading: false,
    },
    formulario: {
        ordem_servico: { data: { ordem_servico: {} } } as t.Banco.Controllers.OrdemServico.BuscarPeloId.Output,
        ordem_servico_id: "",
        open: false,
        loading: false,
        loading_submit: false
    },
};

const store = create<ZustandStore>()(
    immer(() => ({
        states: initialStates
    }))
);

const banco_controller_ordem_servico = class banco_controller_ordem_servico {
    static api = class api {
        static async criar(props: t.Banco.Controllers.OrdemServico.Criar.Input): Promise<t.Banco.Controllers.OrdemServico.Criar.Output> {
            const response = await utils.api.servidor_backend.post(String(PUBLIC_BASE_URL_BACKEND_BANCO_S8), "/ordem-servico", props, true);
            const results: t.Banco.Controllers.OrdemServico.Criar.Output | undefined = response?.results;

            store.setState((state) => { state.states.modal.loading = true });

            if (results?.data?.ordem_servico) {
                store.setState((state) => { state.states.pagina.ordem_servico.data.ordens_servico = utils.update_context.update_array_itens({ oldArray: state.states.pagina.ordem_servico.data.ordens_servico, newItem: [results.data.ordem_servico], }); });
            }

            return results as t.Banco.Controllers.OrdemServico.Criar.Output;
        }

        static async buscar_pelo_filtro(props: t.Banco.Controllers.OrdemServico.BuscarPeloFiltro.Input): Promise<t.Banco.Controllers.OrdemServico.BuscarPeloFiltro.Output> {
            store.setState((state) => { state.states.pagina.loading = true });

            const response = await utils.api.servidor_backend.get(String(PUBLIC_BASE_URL_BACKEND_BANCO_S8), "/ordens-servico", true, props.filtros.ordem_servico);
            const results: t.Banco.Controllers.OrdemServico.BuscarPeloFiltro.Output | undefined = response?.results;

            if (results?.data?.ordens_servico) {
                store.setState((state) => { state.states.pagina.ordem_servico = results; });
            }

            store.setState((state) => { state.states.pagina.loading = false });

            return results as t.Banco.Controllers.OrdemServico.BuscarPeloFiltro.Output;
        }

        static async buscar_pelo_id(props: t.Banco.Controllers.OrdemServico.BuscarPeloId.Input): Promise<t.Banco.Controllers.OrdemServico.BuscarPeloId.Output> {
            store.setState((state) => { state.states.modal.loading = true });

            const response = await utils.api.servidor_backend.get(String(PUBLIC_BASE_URL_BACKEND_BANCO_S8), `/ordem-servico/${props.data._id}`, true, {});
            const results: t.Banco.Controllers.OrdemServico.BuscarPeloId.Output | undefined = response?.results;

            if (results?.data?.ordem_servico) store.setState((state) => { state.states.modal.ordem_servico_item = results; })


            store.setState((state) => { state.states.modal.loading = false });

            return results as t.Banco.Controllers.OrdemServico.BuscarPeloId.Output;
        }

        static async atualizar_pelo_id(props: t.Banco.Controllers.OrdemServico.AtualizarPeloId.Input): Promise<t.Banco.Controllers.OrdemServico.AtualizarPeloId.Output> {
            store.setState((state) => { state.states.modal.loading = true });

            const response = await utils.api.servidor_backend.patch(String(PUBLIC_BASE_URL_BACKEND_BANCO_S8), `/ordem-servico/${props.data.ordem_servico._id}`, { data: props.data }, true);
            const results: t.Banco.Controllers.OrdemServico.AtualizarPeloId.Output | undefined = response?.results;

            const ordemServicoAtualizada = results?.data.ordem_servico || (results?.data as any)?.ordem_servico;

            if (ordemServicoAtualizada) {
                store.setState((state) => {
                    state.states.pagina.ordem_servico.data.ordens_servico = utils.update_context.update_array_itens({ oldArray: state.states.pagina.ordem_servico.data.ordens_servico, newItem: [ordemServicoAtualizada], });
                    if (state.states.modal.ordem_servico_item.data.ordem_servico?._id === ordemServicoAtualizada._id) { state.states.modal.ordem_servico_item = { data: { ordem_servico: ordemServicoAtualizada } }; }
                });
            }

            store.setState((state) => { state.states.pagina.loading = false });

            return results as t.Banco.Controllers.OrdemServico.AtualizarPeloId.Output;
        }

        static async deletar_pelo_id(props: t.Banco.Controllers.OrdemServico.DeletarPeloId.Input): Promise<t.Banco.Controllers.OrdemServico.DeletarPeloId.Output> {
            const response = await utils.api.servidor_backend.delete(String(PUBLIC_BASE_URL_BACKEND_BANCO_S8), `/ordem-servico/${props.data._id}`);
            const results: t.Banco.Controllers.OrdemServico.DeletarPeloId.Output | undefined = response?.results;

            store.setState((state) => {
                state.states.pagina.ordem_servico.data.ordens_servico = utils.update_context.remover_item_pelo_id({ oldArray: state.states.pagina.ordem_servico.data.ordens_servico, itemToRemove: props.data._id, });
                if (state.states.modal.ordem_servico_item.data.ordem_servico?._id === props.data._id) { state.states.modal.ordem_servico_item = initialStates.modal.ordem_servico_item; }
            });

            return results as t.Banco.Controllers.OrdemServico.DeletarPeloId.Output;
        }
    };

    static contexto = class contexto {
        static jsx = class jsx {
            static get_formulario(): ZustandStore['states']['formulario'] {
                return store((state) => state.states.formulario);
            }

            static get_pagina(): ZustandStore['states']['pagina'] {
                return store((state) => state.states.pagina);
            }

            static get_modal(): ZustandStore['states']['modal'] {
                return store((state) => state.states.modal);
            }
        };

        static state = class state {
            static reset() {
                store.setState(() => ({ states: initialStates }));
            }

            static set_ordem_servico_item(ordemServicoData: t.Banco.Controllers.OrdemServico.BuscarPeloId.Output) {
                store.setState((state) => { state.states.modal.ordem_servico_item = ordemServicoData; });
            }

            static set_ordem_servico(ordemServicoData: t.Banco.Controllers.OrdemServico.BuscarPeloFiltro.Output) {
                store.setState((state) => { state.states.pagina.ordem_servico = ordemServicoData; });
            }

            static async set_open_formulario(ordem_servico_id?: string) {
                store.setState((state) => { state.states.formulario.loading = true; });
                if (ordem_servico_id) {
                    try {
                        const result = await banco_controller_ordem_servico.api.buscar_pelo_id({ data: { _id: ordem_servico_id } });
                        if (result?.data?.ordem_servico) {
                            store.setState((state) => {
                                state.states.formulario.ordem_servico = result;
                                state.states.formulario.loading = false;
                            });
                        } else {
                            store.setState((state) => {
                                state.states.formulario.loading = false;
                            });
                        }
                    } catch (error) { store.setState((state) => { state.states.formulario.loading = false; }); console.error('Erro ao buscar ordem de serviço:', error); }
                }
            }

            static set_close_formulario() {
                store.setState((state) => { state.states.formulario = { ...initialStates.formulario }; });
            }

            static get_state_formulario(): ZustandStore['states']['formulario'] {
                return store.getState().states.formulario;
            }

            static get_state_modal(): ZustandStore['states']['modal'] {
                return store.getState().states.modal;
            }

            static get_state_pagina(): ZustandStore['states']['pagina'] {
                return store.getState().states.pagina;
            }
        };
    };

    static websocket = class websocket { };
}

export default banco_controller_ordem_servico;