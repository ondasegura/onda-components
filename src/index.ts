// Importar estilos CSS primeiro (importante para bibliotecas)
import './styles/globals.css';

// Exportar componentes do banco
export { Pagina, type PaginaProps } from './banco/componentes/pagina';

// Exportar funções utilitárias
export {
    formatarMoeda,
    formatarCPF,
    formatarCNPJ,
    validarEmail,
    gerarId,
    capitalizarPalavras,
    removerAcentos
} from './banco/utils';

// Re-exportar tudo das pastas para facilitar imports
export * from './banco/componentes/pagina';
export * from './banco/utils';