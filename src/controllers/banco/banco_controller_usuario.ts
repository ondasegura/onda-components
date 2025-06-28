import { create } from "zustand";

//TYPES
import t from "onda-types";

//HOOKS

// UTILS
import utils from "onda-utils";

//CONTROLLERS
import banco_controller_ordem_servico from "./banco_controller_ordem_servico";
import banco_controller_cliente from "./banco_controller_cliente";

interface ZustandStore {
    states: {
        user: t.Banco.Controllers.Usuario.Auth;
        signed: boolean;
        loading: boolean;
        usuarios: t.Banco.Controllers.Usuario.BuscarPeloFiltro.Output;
        usuarios_loading: boolean;
        usuario: t.Banco.Controllers.Usuario.BuscarPeloId.Output;
        usuario_loading: boolean;
        formulario: {
            open: boolean,
            loading: boolean
        };
    }
}

const set_store = {
    states: {
        user: utils.session_storage.get_item_session_storage("auth_user") as t.Banco.Controllers.Usuario.Auth,
        signed: !!utils.session_storage.get_item_session_storage("auth_user") as boolean,
        loading: false,
        usuarios: { data: { usuarios: [] } } as t.Banco.Controllers.Usuario.BuscarPeloFiltro.Output,
        usuarios_loading: false,
        usuario: { data: { usuario: {} } } as t.Banco.Controllers.Usuario.BuscarPeloId.Output,
        usuario_loading: false,
        formulario: {
            open: false,
            loading: false,

        }
    },
}

const store = create<ZustandStore>((set, get) => (set_store));

const controller_usuario = class controller_usuario {

    static api = class api {
        static async register(usuario: t.Banco.Controllers.Usuario.Register.Input) {
            try {
                const response = await utils.api.servidor_backend.post("/usuario/auth/register", usuario);

                if (response?.results?.data) {
                    controller_usuario.contexto.state.set_usuarios({ data: { usuarios: [response?.results?.data?.usuario] } });
                }
                return response
            } catch (error) {
                // Tratamento de erro
            }
        }

        static async login(props: t.Banco.Controllers.Usuario.Login.Input): Promise<t.Banco.Controllers.Usuario.Login.Output<"login" | "code">> {
            try {

                controller_usuario.contexto.state.set_loading(true);

                const response = await utils.api.servidor_backend.post("/usuario/auth/login", props);

                const resultado: t.Banco.Controllers.Usuario.Login.Output<"login"> = response?.results
                if (resultado?.data?.usuario_auth?.type == "login") {
                    controller_usuario.contexto.state.set_user(response?.results?.data?.usuario_auth);
                }
                return resultado;
            } finally {
                controller_usuario.contexto.state.set_loading(false);
            }
        }

        static async criar() { } // Função sem implementação no exemplo original

        static async buscar_pelo_filtro(input?: t.Banco.Controllers.Usuario.BuscarPeloFiltro.Input, reset: boolean = false) {
            try {
                controller_usuario.contexto.state.set_loading_usuarios(true);
                const response = await utils.api.servidor_backend.get("/usuarios", false, input?.filtros.usuario);

                if (response?.results?.data?.usuarios) {
                    controller_usuario.contexto.state.set_usuarios({ data: { usuarios: response?.results?.data?.usuarios } }, true);
                    return { data: { usuarios: response?.results?.data?.usuarios } };
                }
            } finally {
                controller_usuario.contexto.state.set_loading_usuarios(false);
            }
        }

        static async buscar_pelo_id(id: string) {
            try {
                controller_usuario.contexto.state.set_usuario_loading(true);
                const response = await utils.api.servidor_backend.get(`/usuario/${id}`, false, {});

                if (response?.results?.data?.usuario) {
                    controller_usuario.contexto.state.set_usuario({ data: { usuario: response?.results?.data?.usuario } });
                    return { data: { usuario: response?.results?.data?.usuario } };
                }
                return { data: { usuario: {} as t.Banco.Controllers.Usuario.UsuarioBase } }; // Retorna um objeto vazio conforme o tipo
            } finally {
                controller_usuario.contexto.state.set_usuario_loading(false);
            }
        }

        static async atualizar_pelo_id(input: t.Banco.Controllers.Usuario.AtualizarPeloId.Input) {
            const response = await utils.api.servidor_backend.patch(`/usuario/${input.data.usuario._id}`, input);

            if (response?.results?.data?.usuario) {
                // Assumindo que set_usuarios agora lida com a atualização de um único usuário na lista de usuários
                controller_usuario.contexto.state.set_usuarios({ data: { usuarios: [response?.results?.data?.usuario] } });
            }
            return response
        }

        static async deletar_pelo_id(id: string) {
            const response = await utils.api.servidor_backend.delete(`/usuario/${id}`);

            if (response?.results?.data?.usuario) {
                controller_usuario.contexto.state.delete_usuario({ data: { _id: id } });
                return response
            }
            return response
        }

        static async gerar_authenticator_code(props: t.Banco.Controllers.Usuario.gerarAuthenticatorCode.Input): Promise<t.Banco.Controllers.Usuario.gerarAuthenticatorCode.Output> {
            try {
                controller_usuario.contexto.state.set_usuario_loading(true);
                const response = await utils.api.servidor_backend.post(`/usuario/auth/authanticator`, props, true);

                return response?.results
            } finally {
                controller_usuario.contexto.state.set_usuario_loading(false);
            }
        }
    };

    static contexto = class contexto {
        static jsx = class jsx {
            static get_user(): t.Banco.Controllers.Usuario.Auth {
                return store((state) => state.states.user);
            }

            static get_usuarios(): t.Banco.Controllers.Usuario.BuscarPeloFiltro.Output {
                return store((state) => state.states.usuarios)
            }

            static get_usuario(): t.Banco.Controllers.Usuario.BuscarPeloId.Output {
                return store((state) => state.states.usuario);
            }

            static get_signed(): boolean {
                return store((state) => state.states.signed);
            }

            static get_loading(): boolean {
                return store((state) => state.states.loading);
            }

            static get_open_form(): boolean {
                return store((state) => state.states.formulario.open);
            }

            static get_usuarios_loading(): boolean {
                return store((state) => state.states.usuarios_loading);
            }

            static get_usuario_loading(): boolean {
                return store((state) => state.states.usuario_loading);
            }
        };

        static state = class state {
            static reset() {
                store.setState((state) => ({
                    states: {
                        user: {} as t.Banco.Controllers.Usuario.Auth,
                        signed: false as boolean,
                        loading: false,
                        usuarios: { data: { usuarios: [] } } as t.Banco.Controllers.Usuario.BuscarPeloFiltro.Output,
                        usuarios_loading: false,
                        usuario: { data: { usuario: {} } } as t.Banco.Controllers.Usuario.BuscarPeloId.Output,
                        usuario_loading: false,
                        formulario: {
                            open: false,
                            loading: false,

                        }
                    }
                }))
            }

            static get_usuarios(): t.Banco.Controllers.Usuario.BuscarPeloFiltro.Output {
                return store.getState().states.usuarios;
            }

            static set_user(userData: t.Banco.Controllers.Usuario.Auth) {
                utils.session_storage.set_session_storage_sem_incremento("auth_user", userData);
                store.setState((state) => ({
                    states: {
                        ...state.states,
                        user: userData,
                        signed: !!userData,
                    },
                }));
            }

            static set_usuarios(usuariosOutput: t.Banco.Controllers.Usuario.BuscarPeloFiltro.Output, reset: boolean = false) {
                store.setState((state) => ({
                    states: {
                        ...state.states,
                        usuarios: {
                            data: {
                                usuarios: utils.update_context.update_array_itens({
                                    oldArray: reset && [] || state?.states?.usuarios?.data?.usuarios,
                                    newItem: usuariosOutput?.data?.usuarios,
                                }),
                            }
                        },
                    },
                }));
            }

            static set_usuario(usuarioOutput: t.Banco.Controllers.Usuario.BuscarPeloId.Output) {
                store.setState((state) => ({
                    states: {
                        ...state.states,
                        usuario: usuarioOutput,
                    },
                }));
            }

            static delete_usuario(props: t.Banco.Controllers.Usuario.DeletarPeloId.Input) {
                store.setState((state) => ({
                    states: {
                        ...state.states,
                        usuarios: {
                            data: {
                                usuarios: utils.update_context.remover_item_pelo_id({
                                    oldArray: state?.states?.usuarios?.data?.usuarios,
                                    itemToRemove: props.data._id,
                                }),
                            }
                        },
                    },
                }));
            }

            static set_open_form(value: boolean, usuario?: t.Banco.Controllers.Usuario.UsuarioBase) {
                store.setState((state) => ({
                    states: {
                        ...state.states,
                        formulario: {
                            open: value,
                            loading: false,
                        },
                        usuario: {
                            data: {
                                usuario: usuario || state.states.usuario.data.usuario,
                            }
                        }
                    },
                }));
            }

            static set_loading(value: boolean) {
                store.setState((state) => ({
                    states: { ...state.states, loading: value },
                }));
            }

            static set_loading_usuarios(value: boolean) {
                store.setState((state) => ({
                    states: {
                        ...state.states,
                        usuarios_loading: value,
                    },
                }));
            }

            static set_usuario_loading(value: boolean) {
                store.setState((state) => ({
                    states: {
                        ...state.states,
                        usuario_loading: value,
                    },
                }));
            }

            static set_signout() {

                utils.session_storage.remover_item_session_storage("auth_user");
                banco_controller_ordem_servico.contexto.state.reset();
                banco_controller_cliente.contexto.state.reset();
                this.reset();
            }
        };
    };

    static websocket = class websocket { };
};

export default controller_usuario;