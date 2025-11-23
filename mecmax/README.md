Claro! Aqui está o código completo. É só clicar em "Copiar" no canto direito da caixa preta abaixo e colar dentro do seu arquivo README.md.
Markdown
# MecMax - Gestão de Estoque de Ferramentas 

## Sobre o Projeto
Este projeto foi desenvolvido como parte da disciplina de **Projeto Aplicado** do curso de Análise e Desenvolvimento de Sistemas. Nossa equipe é composta por **Theo** e **Luiz**!

O objetivo do sistema é acabar com as anotações em papel na hora de emprestar ferramentas na oficina, evitando desperdício de tempo e gerenciando com eficiência o uso das ferramentas da oficina.

## Funcionalidades Principais

### Para o Mecânico:
* **Consulta rápida:** Verifica se a ferramenta está disponível ou ocupada.
* **Registro de retirada:** Faz o empréstimo informando onde a ferramenta será usada.
* **Reserva:** Permite agendar o uso de ferramentas para dias futuros.

###  Para o Gerente:
* **Painel de Visão Geral:** Dashboard do estoque.
* **Cadastros:** Gestão completa de Ferramentas, Mecânicos e Locais.
* **Relatórios:** Histórico de quem usou o quê (auditabilidade).

##  Tecnologias Usadas
Nós escolhemos essas tecnologias por serem amplamente utilizadas no mercado:

* **Frontend:** React (com tema escuro para facilitar o uso na oficina).
* **Backend:** Node.js (rápido e leve).
* **Banco de Dados:** MySQL (segurança e relacionamento de dados).

##  Como rodar no seu computador

### 1. Banco de Dados
* Instale o **MySQL**.
* Abra o arquivo `mecmax_v5.sql` (na pasta `banco`) e rode o script.
* *Nota:* Ele já cria o banco e insere dados de teste (ex: mecânico João, matrícula `100001`).

### 2. Backend (Servidor)
Entre na pasta do backend e instale as dependências:

```bash
cd backend
npm install
npm start
O servidor rodará na porta 3002.

### 3. Frontend (Telas)
Entre na pasta do frontend e inicie o site:
Bash
cd frontend
npm install
npm start
O navegador abrirá automaticamente na porta 3000.

Decisões de Projeto
No início, tivemos dificuldade com a conexão do banco, então criamos uma função de segurança no backend para garantir que os dados sempre cheguem corretamente na tela.
Também utilizamos Triggers no banco de dados para que, assim que um empréstimo é realizado, o status da ferramenta mude para "EMPRESTADA" automaticamente, sem necessidade de código extra no sistema.

Desenvolvido por Theo e Luiz.

