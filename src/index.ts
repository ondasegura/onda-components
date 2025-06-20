// Importar estilos CSS (importante para bibliotecas)
import './styles/globals.css';

// Exportar componentes do banco
export { Pagina, type PaginaProps } from './banco/componentes/pagina';

// Exemplo de como exportar funções utilitárias (se você tiver)
// export { minhaFuncaoUtil, outraFuncao } from './banco/utils';

// Exemplo de como exportar hooks personalizados (se você tiver)
// export { useMeuHook } from './banco/hooks';

// Exemplo de como exportar constantes/tipos globais
// export type { TipoGlobal } from './banco/types';

// Re-exportar tudo da pasta banco para facilitar imports
export * from './banco/componentes/pagina';

// Se você tiver mais pastas de componentes, adicione aqui:
// export * from './banco/componentes/botao';
// export * from './banco/componentes/input';
// etc.