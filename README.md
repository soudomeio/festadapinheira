# Festa da Pinheira

Aplicativo de interacao entre casais para festas exclusivas. Estilo Tinder com sistema de match e chat.

## Funcionalidades

- **Cadastro**: Nick do casal, nomes, cidade, preferencias e fotos
- **Login**: Nick + senha com validacao
- **Feed de Perfis**: Swipe com 3 opcoes (Interesse / Talvez / Ainda nao)
- **Match**: Animacao quando dois casais se interessam
- **Chat Global**: Conversa aberta entre todos os usuarios
- **Chat Privado**: Mensagens entre casais que deram match
- **Perfil**: Visualizacao e edicao do perfil
- **Matches**: Lista de matches mutuos, interesses e "talvez role"

## Preferencias Disponiveis

- Trocas de Casais
- Sexo no mesmo ambiente
- Somente Solteiras
- Somente Solteiros
- Apenas Curioso

## Deploy no GitHub Pages

### Configuracao do repositorio:

1. Acesse as configuracoes do repositorio no GitHub
2. Va em **Settings > Pages**
3. Em **Source**, selecione **GitHub Actions**

### Para fazer deploy:

O deploy e automatico quando voce faz push para a branch `main`. Tambem pode ser acionado manualmente em **Actions > Deploy to GitHub Pages > Run workflow**.

### URL do site:

Apos o deploy, o site estara disponivel em:
`https://soudomeio.github.io/festadapinheira/`

## Desenvolvimento local

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`

## Build

```bash
npm run build
```

Os arquivos de producao ficam na pasta `dist/`.

## Tecnologias

- React + TypeScript + Vite
- Tailwind CSS
- shadcn/ui components

## Contas de teste

| Nick | Senha |
|------|-------|
| CasalPinheira | 123456 |
| NoiteQuente | 123456 |
