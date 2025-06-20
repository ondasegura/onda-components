// Funções utilitárias que serão exportadas pela biblioteca

/**
 * Formata um valor monetário para o padrão brasileiro
 */
export const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
};

/**
 * Formata um CPF
 */
export const formatarCPF = (cpf: string): string => {
    const numeros = cpf.replace(/\D/g, '');
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formata um CNPJ
 */
export const formatarCNPJ = (cnpj: string): string => {
    const numeros = cnpj.replace(/\D/g, '');
    return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

/**
 * Valida se um email é válido
 */
export const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * Gera um ID único
 */
export const gerarId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

/**
 * Capitaliza a primeira letra de cada palavra
 */
export const capitalizarPalavras = (texto: string): string => {
    return texto.replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Remove acentos de uma string
 */
export const removerAcentos = (texto: string): string => {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};