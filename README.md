# PADRÕES DE COMMIT UTILIZADOS NO PROJETO

🎉 start: Inicial  
📚 docs: Atualiza README  
🐛 fix: Corrige loop na 50  
✨ feat: Adiciona login  
💄 feat: Estiliza formulário  
🧱 ci: Modifica Dockerfile  
♻️ refactor: Refatora para arrow functions  
⚡ perf: Melhora resposta  
💥 fix: Reverte mudanças  
🧪 test: Adiciona teste  
💡 docs: Comenta função  
🗃️ raw: Adiciona dados RAW  
🧹 cleanup: Limpa validação  
🗑️ remove: Remove arquivos inúteis

# COMMITS NO GIT HUB

bunx npm version patch --no-git-tag-version --no-git-checks
git init
git add .
git commit -m "💄 feat: "
git push -u origin guilherme

# PADRÃO DO CRUD NAS CONTROLLERS E MODELS

```plaintext
api:
POST::   criar
GET::    buscar_pelo_filtro
GET::    buscar_pelo_id
PATCH::  atualizar_pelo_id
DELETE:: deletar_pelo_id

contexto: falta definir
websocket: falta definir

```

# COMO USAR O CONTEXTO DA ZUSTAND?

```plaintext
store: Retorna um seletor reativo do estado que causa re-renderização do componente quando o valor muda.

store.getState(): Obtém o valor atual do estado sem criar reatividade, ideal para uso em funções e eventos.
```

# Versionamento semântico (SemVer): Use o padrão X.Y.Z (Major.Minor.Patch)

X (Major): Primeiro número - aumentado quando ocorrem mudanças incompatíveis com versões anteriores (breaking changes)
Y (Minor): Número do meio - aumentado quando adicionados novos recursos compatíveis com versões anteriores
Z (Patch): Último número - aumentado para correções de bugs e pequenos ajustes que não alteram a funcionalidade existente

# COMMITS NO GIT HUB

bunx npm version patch --no-git-tag-version --no-git-checks
git init
git add .
git commit -m "💄 feat:"
git push -u origin producao

adm principal

Dos seviços para os menus - Limpa nome - Tira proço - Tira link - Antecipação de licitação
acesso franqueado - Franqueado vai enviar a liminar do limpa nome -
acesso do parceiro advogados - ele vai receber as liminares -

        # Configuração do sistema

-   Pagar o lucro do advogado, lucro do banco, lucro franqueado
-                                           # Consulta nome

    1º Vai gerar um link no parme
    2º Depois que pagar Vai bater na API do analisando e retonar um PDF # Limpa nome
    1º Vai gerar um link no parme
    2º Depois que o link foi pago
    3º Assinar o documento online
    4º Enviar uma ordem de serviço para o parceiro advogado
    5º 45 dias corridos
    6º Advogado vai alterar o status para processo conclído

3º webs
arquivos:
ficha sociativa

-   Tira proço
-   Tira link
-   Antecipação de licitação
