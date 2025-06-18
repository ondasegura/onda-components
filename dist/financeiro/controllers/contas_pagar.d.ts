import t from "onda-types";
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
declare class Api {
    criar(props: t.Banco.Controllers.ContaPagar.Criar.Input): Promise<t.Banco.Controllers.ContaPagar.Criar.Output>;
    buscar_pelo_filtro(props: t.Banco.Controllers.ContaPagar.BuscarPeloFiltro.Input): Promise<t.Banco.Controllers.ContaPagar.BuscarPeloFiltro.Output>;
    buscar_pelo_id(props: t.Banco.Controllers.ContaPagar.BuscarPeloId.Input): Promise<t.Banco.Controllers.ContaPagar.BuscarPeloId.Output>;
    atualizar_pelo_id(props: t.Banco.Controllers.ContaPagar.AtualizarPeloId.Input): Promise<t.Banco.Controllers.ContaPagar.AtualizarPeloId.Output>;
    deletar_pelo_id(props: t.Banco.Controllers.ContaPagar.DeletarPeloId.Input): Promise<t.Banco.Controllers.ContaPagar.DeletarPeloId.Output>;
}
declare class JsxContext {
    get_formulario(): ZustandStore["states"]["formulario"];
    get_pagina(): ZustandStore["states"]["pagina"];
    get_modal(): ZustandStore["states"]["modal"];
}
declare class StateContext {
    reset(): void;
    set_conta_pagar_item(contaPagarData: t.Banco.Controllers.ContaPagar.BuscarPeloId.Output): void;
    set_conta_pagar(contaPagarData: t.Banco.Controllers.ContaPagar.BuscarPeloFiltro.Output): void;
    set_open_formulario(conta_pagar_id?: string): Promise<void>;
    set_close_formulario(): void;
    get_state_formulario(): ZustandStore["states"]["formulario"];
    get_state_modal(): ZustandStore["states"]["modal"];
    get_state_pagina(): ZustandStore["states"]["pagina"];
}
declare class Contexto {
    readonly jsx: JsxContext;
    readonly state: StateContext;
    constructor();
}
declare class Websocket {
    constructor();
}
declare class ControllerContaPagar {
    readonly api: Api;
    readonly contexto: Contexto;
    readonly websocket: Websocket;
    constructor();
}
declare const _default: ControllerContaPagar;
export default _default;
