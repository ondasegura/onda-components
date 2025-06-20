// Importar estilos CSS (importante para bibliotecas)
import './styles/globals.css';

// Exportar componentes do banco
export { Pagina, type PaginaProps } from './banco/componentes/pagina';

// Re-exportar tudo da pasta banco para facilitar imports
export * from './banco/componentes/pagina';

// Exemplo de como exportar funções utilitárias
export * from './banco/utils';

