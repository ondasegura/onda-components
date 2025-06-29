import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import utils from "onda-utils";

const PUBLIC_BASE_URL_BACKEND = process.env.PUBLIC_BASE_URL_BACKEND;

interface ZustandStore {
    states: {
        modal: {
            item?: any;
            loading?: boolean;
        }
        pagina: {
            loading?: boolean;
            itens?: any[];
            paginacao: {
                total_itens: number,
                total_paginas: number,
                total_itens_pagina_atual: number,
                itens_por_pagina: number
            }
        }
        formulario: {
            open?: boolean,
            item?: any,
            progress?: number,
            loading?: boolean,
            loading_submit?: boolean
        };
    };
}

const store = create<ZustandStore>()(
    immer((set) => ({
        states: {
            modal: {
            },
            pagina: {
                paginacao: {
                    total_itens: 0,
                    total_paginas: 10,
                    total_itens_pagina_atual: 0,
                    itens_por_pagina: 0
                }
            },
            formulario: {
            }
        },
    }))
);

interface Controller {
    entidade: string
}

export class controller {
    private entidade: string;
    constructor({ entidade }: Controller) {
        this.entidade = entidade;
    }

    api = {
        criar: async (props: any) => {
            try {
                this.set_state((store) => { store.states.formulario.loading = true })

                const data = await utils.api.servidor_backend.post(String(PUBLIC_BASE_URL_BACKEND), this.entidade, props, false);

                if (data?.results?.data?.[this.entidade]) this.set_state((store) => { store.states.pagina.itens?.unshift(data?.results?.data?.[this.entidade]) })

            } finally {
                this.set_state((store) => { store.states.formulario.loading = false })
            }
        },

        buscar_pelo_filtro: async (props: any) => {
            try {
                this.set_state((store) => { store.states.pagina.loading = true })

                const data = await utils.api.servidor_backend.get(String(PUBLIC_BASE_URL_BACKEND), this.entidade, true, props?.filtros?.[this.entidade] || {});

                if (data?.results?.data?.[this.entidade]) this.set_state((store) => {
                    store.states.pagina = {
                        paginacao: {
                            itens_por_pagina: data?.results?.data?.paginacao?.itens_por_pagina | 0,
                            total_itens: data?.results?.data?.paginacao?.total_itens | 0,
                            total_itens_pagina_atual: data?.results?.data?.paginacao?.total_itens_pagina_atual | 0,
                            total_paginas: data?.results?.data?.paginacao?.total_paginas | 0,
                        },
                        itens: data?.results?.data?.[this.entidade],
                        loading: false
                    }
                })
            } finally {
                if (this.get_state.pagina.loading !== true) return this.set_state((store) => { store.states.pagina.loading = false })
            }
        },

        buscar_pelo_id: async (props: any) => {
            try {
                this.set_state((store) => { store.states.formulario.loading = true })
                this.set_state((store) => { store.states.modal.loading = true })

                const data = await utils.api.servidor_backend.get(String(PUBLIC_BASE_URL_BACKEND), `${this.entidade}/${props.data._id}`, true, {});

                if (data?.results?.data?.[this.entidade]) {
                    this.set_state((store) => { store.states.modal.item = data?.results?.data?.[this.entidade] })
                    this.set_state((store) => { store.states.formulario.item = data?.results?.data?.[this.entidade] })
                }
            } finally {
                this.set_state((store) => { store.states.formulario.loading = false })
                this.set_state((store) => { store.states.modal.loading = false })
            }
        },

        atualizar_pelo_id: async (props: any) => {
            try {
                this.set_state((store) => { store.states.formulario.loading = true })
                this.set_state((store) => { store.states.modal.loading = true })

                const data = await utils.api.servidor_backend.patch(String(PUBLIC_BASE_URL_BACKEND), `${this.entidade}/${props.data[this.entidade]._id}`, { data: props.data }, true);

                if (data?.results?.data?.[this.entidade]) {
                    const update_itens = utils.update_context.update_array_itens({ oldArray: this.get_state.pagina.itens, newItem: data?.results?.data?.[this.entidade] })
                    this.set_state((store) => { store.states.pagina.itens = update_itens })
                }
            } finally {
                this.set_state((store) => { store.states.formulario.loading = false })
                this.set_state((store) => { store.states.modal.loading = false })
            }
        },

        deletar_pelo_id: async (props: any) => {
            try {
                this.set_state((store) => { store.states.modal.loading = true })

                const data = await utils.api.servidor_backend.delete(String(PUBLIC_BASE_URL_BACKEND), `${this.entidade}/${props._id}`);

                if (data?.results?.data?.[this.entidade]) {
                    const update_itens = utils.update_context.remover_item_pelo_id({ oldArray: this.get_state.pagina.itens as any, itemToRemove: { _id: props._id } })
                    this.set_state((store) => { store.states.pagina.itens = update_itens })
                }
            } finally {
                this.set_state((store) => { store.states.modal.loading = false })
            }
        }
    };

    get_jsx: ZustandStore["states"] = store().states

    get_state: ZustandStore["states"] = store.getState().states;

    set_state = store.setState;
}

