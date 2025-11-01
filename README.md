# 📦 Patrimônio Escolar

Sistema web/mobile para controle patrimonial escolar, desenvolvido como atividade de extensão da disciplina **Programação para Dispositivos Móveis em Android (305)** — Estácio EAD, período 2025.3.

## 👩‍🏫 Projeto de Extensão

Este projeto foi aplicado na **Escola Municipal Profª Iracema Maria Vicente**, localizada em Campo Grande/MS. A solução digital substitui o processo manual de revisão patrimonial, permitindo cadastro, edição, exclusão e consulta de itens diretamente pelo navegador ou celular.

---

## 🚀 Funcionalidades

- Cadastro de patrimônios com campos como número, nome, setor, estado, ano, quantidade e presença
- Edição e exclusão de itens com sincronização automática com Supabase
- Armazenamento local (offline) e sincronização quando a internet volta
- Filtros por ano e setor
- Exportação de dados para Excel
- Interface responsiva para dispositivos móveis

---

## 🛠️ Tecnologias utilizadas

- **JavaScript (ES6+)**
- **Vite** para bundling
- **Supabase** como backend (REST API + banco de dados)
- **HTML + CSS**
- **UUID** para identificação única dos itens
- **LocalStorage** para funcionamento offline

---

## 📦 Clonando o projeto

```bash
git clone https://github.com/Patriciapaes88/patrimonio.git
cd patrimonio
## ▶️ Rodando localmente
1. Instale as dependências:

```bash
npm install

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev

3.Acesse no navegador:

Código
http://localhost:5173

```
## 📋 Como usar
### ✅ Cadastro
- Preencha o formulário com os dados do patrimônio
-Clique em Salvar
-O item será salvo localmente e, se houver internet, enviado ao Supabase

## 🔐 Configuração do Supabase

Para rodar o projeto localmente, crie um arquivo `.env` na raiz com as seguintes variáveis:

```env
VITE_SUPABASE_URL=COLE_AQUI_SUA_URL_DO_SUPABASE
VITE_SUPABASE_KEY=COLE_AQUI_SUA_CHAVE_DO_SUPABASE

### ✏️ Edição
- Clique no botão Editar ao lado do item
- Altere os campos desejados
- Clique em Salvar alterações

### 🗑️ Exclusão
-Clique no botão Excluir
-O item será removido do Supabase e da tabela local

###📤 Exportação
- Clique em Exportar para Excel
- Os dados serão convertidos e baixados como .xlsx para arquivamento físico

## 📱 Aplicação prática
O sistema será utilizado pela equipe administrativa da escola a partir de 2026, com cadastro retroativo dos patrimônios anteriores. A interface foi testada em computadores e celulares, garantindo acessibilidade e praticidade.


---

## 🔗 Links úteis

- [🔗 Acesse o sistema online](https://patrimonio-r1fa.vercel.app)
- [📦 Repositório GitHub](https://github.com/Patriciapaes88/patrimonio)
- [🛠️ Supabase Dashboard](https://supabase.com/dashboard/project/dklkrryzawlyvtvedlec)


## 🧾 Autoria

**Patrícia Paes Cesar**  
**RA:** 202309934876  
**Curso:** Análise e Desenvolvimento de Sistemas — Estácio EAD  
**Disciplina:** Programação para Dispositivos Móveis em Android (305)  
**Período:** 2025.3

## 📄 Licença

Este projeto tem finalidade acadêmica e comunitária. Está disponível para uso, adaptação e aprimoramento com fins educacionais.
