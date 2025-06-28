import { create } from "zustand";
//TYPES
import t from "onda-types";
//HOOKS

// UTILS
import utils from "onda-utils";

const PUBLIC_BASE_URL_BACKEND_BANCO_S8 = process.env.PUBLIC_BASE_URL_BACKEND_BANCO_S8;

const set_store = {
    states: {
        clientes: {
            data: [],
            loading: false,
        },
        cliente: {
            data: {},
            loading: false,
        },
        openForm: false,
    }
}
const store = create((set, get) => (set_store));

const banco_controller_cliente = class banco_controller_cliente {
    static api = class api {
        static async criar(input: t.Banco.Controllers.Cliente.Criar.Input) {
            const response = await utils.api.servidor_backend.post(String(PUBLIC_BASE_URL_BACKEND_BANCO_S8), "/cliente", input, true);

            if (response?.results) {
                banco_controller_cliente.contexto.state.set_clientes([response?.results?.data?.cliente]);

                return response;
            }

        }

        static async buscar_pelo_filtro(input: t.Banco.Controllers.Cliente.BuscarPeloFiltro.Input) {
            try {
                banco_controller_cliente.contexto.state.set_loading_clientes(true);

                const response = await utils.api.servidor_backend.get(String(PUBLIC_BASE_URL_BACKEND_BANCO_S8), "/clientes", false, input.filtros.cliente);

                if (response?.data?.results?.data?.clientes) {
                    banco_controller_cliente.contexto.state.set_clientes(response?.data?.results?.data?.clientes);
                    return response.data.results.data.clientes;
                }
            } finally {
                banco_controller_cliente.contexto.state.set_loading_clientes(false);
            }
        }

        static async buscar_pelo_id(input: t.Banco.Controllers.Cliente.BuscarPeloId.Input) {
            try {
                banco_controller_cliente.contexto.state.set_loading_cliente(true);

                const response = await utils.api.servidor_backend.get(String(PUBLIC_BASE_URL_BACKEND_BANCO_S8), `/cliente/${input.data._id}`, false);

                if (response?.data?.results) {
                    banco_controller_cliente.contexto.state.set_clientes(response?.data?.results);
                    return response.data.results;
                }
            } finally {
                banco_controller_cliente.contexto.state.set_loading_cliente(false);
            }
        }

        static async atualizar_pelo_id(input: t.Banco.Controllers.Cliente.AtualizarPeloId.Input) {
            try {
                banco_controller_cliente.contexto.state.set_loading_cliente(true);

                const response = await utils.api.servidor_backend.patch(String(PUBLIC_BASE_URL_BACKEND_BANCO_S8), `/cliente/${input.data.cliente._id}`, input, true);

                if (response?.results?.data?.cliente) {
                    banco_controller_cliente.contexto.state.set_clientes(response.results?.data?.cliente);
                    return response.results;
                }
            } finally {
                banco_controller_cliente.contexto.state.set_loading_cliente(false);
            }
        }

        static async deletar_pelo_id(input: t.Banco.Controllers.Cliente.DeletarPeloId.Input): Promise<t.Banco.Controllers.Cliente.DeletarPeloId.Output> {

            const response = await utils.api.servidor_backend.delete(String(PUBLIC_BASE_URL_BACKEND_BANCO_S8), `/cliente/${input.id}`, true);

            store.setState((state) => ({
                states: {
                    ...state.states,
                    cliente: {},
                    clientes: {
                        data: utils.update_context.remove_array_items({
                            oldArray: state?.states?.clientes?.data,
                            itemToRemove: { _id: input.id },
                        }),
                        loading: false,
                    },
                },
            }));

            return response.data.results;

        }
    };

    static contexto = class contexto {
        static jsx = class jsx {
            static get_cliente() {
                return store((state) => state.states.cliente);
            }

            static get_clientes(): t.Banco.Controllers.Cliente.ClienteBase[] {
                return store((state) => state.states.clientes);
            }

            static get_open_form(): boolean {
                return store((state) => state.states.openForm);
            }
        };
        static state = class state {

            static reset() { store.setState((state) => (set_store)) }

            static set_cliente(clienteData = {}) {
                store.setState((state) => ({
                    states: {
                        ...state.states,
                        cliente: {
                            data: clienteData,
                            loading: false,
                        },
                    },
                }));
            }

            static set_clientes(clientesData: t.Banco.Controllers.Cliente.BuscarPeloFiltro.Output[]) {
                store.setState((state) => ({
                    states: {
                        ...state.states,
                        cliente: {
                            data: {},
                            loading: false,
                        },
                        clientes: {
                            data: utils.update_context.update_array_itens({
                                oldArray: state?.states?.clientes?.data,
                                newItem: clientesData,
                            }),
                            loading: false,
                        },
                    },
                }));
            }

            static set_open_form({ openForm = false, cliente }) {
                store.setState((state) => ({
                    states: {
                        ...state.states,
                        cliente: {
                            data: cliente,
                            loading: false,
                        },
                        openForm: openForm,
                    },
                }));
            }

            static set_loading_clientes(value) {
                store.setState((state) => ({
                    states: {
                        ...state.states,
                        clientes: {
                            ...state.states.clientes,
                            loading: value,
                        },
                    },
                }));
            }

            static set_loading_cliente(value) {
                store.setState((state) => ({
                    states: {
                        ...state.states,
                        cliente: {
                            ...state.states.cliente,
                            loading: value,
                        },
                    },
                }));
            }

            static get_state_cliente() {
                return store.getState().states.cliente;
            }

            static get_state_clientes() {
                return store.getState().states.clientes;
            }

            static get_state_open_form() {
                return store.getState().states.openForm;
            }
        };
    };

    static websocket = class websocket { };
};

export default banco_controller_cliente;
