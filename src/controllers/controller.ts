import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import utils from "onda-utils";

const PUBLIC_BASE_URL_BACKEND = process.env.PUBLIC_BASE_URL_BACKEND;

interface EntityState {
    modal: {
        item: any;
        loading?: boolean;
    };
    pagina: {
        loading?: boolean;
        itens: any[];
        paginacao: {
            total_itens: number;
            total_paginas: number;
            total_itens_pagina_atual: number;
            itens_por_pagina: number;
        };
    };
    formulario: {
        open?: boolean;
        item: any;
        progress?: number;
        loading?: boolean;
        loading_submit?: boolean;
    };
}

interface ZustandStore {
    states: {
        [entidade: string]: EntityState;
    };
}

export interface ControllerActions {
    Criar: { Input: any; Output: any };
    BuscarPeloFiltro: { Input: any; Output: any };
    BuscarPeloId: { Input: any; Output: any };
    AtualizarPeloId: { Input: any; Output: any };
    DeletarPeloId: { Input: any; Output: any };
    states: EntityState;
}

const criar_entidade_virtual = (): EntityState => ({
    modal: {
        item: {} as any
    },
    pagina: {
        itens: [],
        loading: false,
        paginacao: {
            total_itens: 0,
            total_paginas: 10,
            total_itens_pagina_atual: 0,
            itens_por_pagina: 0
        }
    },
    formulario: {
        item: {} as any,
        open: false,
        loading: false,
        loading_submit: false
    }
});


const store = create<ZustandStore>()(
    immer((set) => ({
        states: {}
    }))
);

interface ControllerProps {
    entidade: string;
}

export class controller<TController extends ControllerActions, TEntidade extends string = string> {
    private entidade: TEntidade;

    constructor({ entidade }: ControllerProps) {
        this.entidade = entidade as TEntidade;

        const currentState = store.getState();
        if (!currentState.states[this.entidade]) {
            store.setState((state) => {
                state.states[this.entidade] = criar_entidade_virtual();
            });
        }
    }

    api = {
        criar: async (props: TController['Criar']['Input']) => {
            try {
                this.set_state((state_entidade) => { state_entidade.formulario.loading = true });

                const data: TController['Criar']['Output'] = await utils.api.servidor_backend.post(String(PUBLIC_BASE_URL_BACKEND), this.entidade, props, false);

                const newItem = (data as any)?.results?.data?.[this.entidade];

                if (newItem) {
                    this.set_state((state_entidade) => {
                        state_entidade.pagina = {
                            itens: utils.update_context.update_array_itens({ oldArray: state_entidade.pagina.itens, newItem: newItem }),
                            loading: false,
                            paginacao: {
                                itens_por_pagina: state_entidade.pagina.paginacao.itens_por_pagina + 1,
                                total_itens: state_entidade.pagina.paginacao.total_itens + 1,
                                total_itens_pagina_atual: state_entidade.pagina.paginacao.total_itens_pagina_atual + 1,
                                total_paginas: state_entidade.pagina.paginacao.total_paginas
                            }
                        };
                    });
                }

            } finally {
                if (this.get_state.pagina.loading !== true) this.set_state((state_entidade) => { state_entidade.pagina.loading = false })
            }
        },

        buscar_pelo_filtro: async (props: TController['BuscarPeloFiltro']['Input']) => {
            this.set_state((state_entidade) => {
                state_entidade.pagina.loading = true;
            });

            try {
                const data: TController['BuscarPeloFiltro']['Output'] = await utils.api.servidor_backend.get(
                    String(PUBLIC_BASE_URL_BACKEND),
                    this.entidade,
                    true,
                    (props as any)?.filtros?.[this.entidade] || {}
                );
                const results = (data as any)?.results?.data;

                if (results?.[this.entidade]) {
                    this.set_state((state_entidade) => {
                        state_entidade.pagina.paginacao.itens_por_pagina = results?.paginacao?.itens_por_pagina ?? 0;
                        state_entidade.pagina.paginacao.total_itens = results?.paginacao?.total_itens ?? 0;
                        state_entidade.pagina.paginacao.total_itens_pagina_atual = results?.paginacao?.total_itens_pagina_atual ?? 0;
                        state_entidade.pagina.paginacao.total_paginas = results?.paginacao?.total_paginas ?? 0;
                        state_entidade.pagina.itens = results?.[this.entidade];
                        state_entidade.pagina.loading = false;
                    });
                }
            } finally {
                this.set_state((state_entidade) => {
                    state_entidade.pagina.loading = false;
                });
            }
        },

        buscar_pelo_id: async (props: TController['BuscarPeloId']['Input']) => {
            try {
                this.set_state((state_entidade) => {
                    state_entidade.formulario.loading = true;
                    state_entidade.modal.loading = true;
                });

                const data: TController['BuscarPeloId']['Output'] = await utils.api.servidor_backend.get(
                    String(PUBLIC_BASE_URL_BACKEND),
                    `${this.entidade}/${(props as any).data._id}`,
                    true,
                    {}
                );
                const item = (data as any)?.results?.data?.[this.entidade];

                if (item) {
                    this.set_state((state_entidade) => {
                        state_entidade.modal.item = item;
                        state_entidade.formulario.item = item;
                    });
                }
            } finally {
                this.set_state((state_entidade) => { state_entidade.formulario.loading = false; state_entidade.modal.loading = false })
            }
        },

        atualizar_pelo_id: async (props: TController['AtualizarPeloId']['Input']) => {
            try {
                this.set_state((state_entidade) => {
                    state_entidade.formulario.loading = true;
                    state_entidade.modal.loading = true;
                });

                const id = (props as any).data[this.entidade]._id;
                const data: TController['AtualizarPeloId']['Output'] = await utils.api.servidor_backend.patch(
                    String(PUBLIC_BASE_URL_BACKEND),
                    `${this.entidade}/${id}`,
                    { data: (props as any).data },
                    true
                );
                const updatedItem = (data as any)?.results?.data?.[this.entidade];

                if (updatedItem) {
                    const update_itens = utils.update_context.update_array_itens({
                        oldArray: this.get_state.pagina.itens,
                        newItem: updatedItem
                    });
                    this.set_state((state_entidade) => {
                        state_entidade.pagina.itens = update_itens;
                    });
                }
            } finally {
                this.set_state((state_entidade) => {
                    state_entidade.formulario.loading = false;
                    state_entidade.modal.loading = false;
                });
            }
        },

        deletar_pelo_id: async (props: TController['DeletarPeloId']['Input']) => {
            try {
                this.set_state((state_entidade) => {
                    state_entidade.modal.loading = true;
                });

                await utils.api.servidor_backend.delete(
                    String(PUBLIC_BASE_URL_BACKEND),
                    `${this.entidade}/${(props as any)._id}`
                );

                const update_itens = utils.update_context.remover_item_pelo_id({
                    oldArray: this.get_state.pagina.itens as [],
                    itemToRemove: { _id: (props as any)._id }
                });

                this.set_state((state_entidade) => {
                    state_entidade.pagina = {
                        itens: update_itens,
                        loading: false,
                        paginacao: {
                            itens_por_pagina: state_entidade.pagina.paginacao.itens_por_pagina - 1,
                            total_itens: state_entidade.pagina.paginacao.total_itens - 1,
                            total_itens_pagina_atual: state_entidade.pagina.paginacao.total_itens_pagina_atual - 1,
                            total_paginas: state_entidade.pagina.paginacao.total_paginas
                        }
                    };
                });
            } finally {
                this.set_state((state_entidade) => { state_entidade.modal.loading = false });
            }
        }
    };

    get get_jsx(): TController['states'] {
        return store().states[this.entidade] || criar_entidade_virtual();
    }

    get get_state(): TController['states'] {
        return store.getState().states[this.entidade] || criar_entidade_virtual();
    }

    set_state = (updater: (state_entidade: EntityState) => void) => {
        store.setState((state) => {
            if (!state.states[this.entidade]) {
                state.states[this.entidade] = criar_entidade_virtual();
            }
            updater(state.states[this.entidade]);
        });
    };




}

