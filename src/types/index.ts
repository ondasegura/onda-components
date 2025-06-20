// Export types for the library
export interface OndaComponentsConfig {
  apiBaseUrl?: string;
}

// Re-export relevant types that might be needed by consumers
export type { ZustandStore } from '../financeiro/controllers/contas_pagar';