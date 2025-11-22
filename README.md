MecMax - Gestão de Estoque de Ferramentas 
Sobre o Projeto 
Este projeto foi desenvolvido como parte da disciplina de Projeto Aplicado do curso de Análise e 
Desenvolvimento de Sistemas. 
Nossa equipe está composta por Theo e Luiz! O objetivo do sistema é acabar com as anotações em 
papel na hora de emprestar ferramentas na oficina, desperdício de tempo e gerenciar com eficiência 
o uso das ferramenta da oficnia. 
Funcionalidades Principais 
Para o Mecânico: 
Consulta rápida se a ferramenta está disponível ou ocupada. 
Registro de retirada (Empréstimo) informando onde vai usar. 
Reserva de ferramentas para dias futuros. 
Para o Gerente: 
Painel com visão geral do estoque. 
Cadastro completo de Ferramentas, Mecânicos e Locais. 
Relatório histórico de quem usou o quê (auditabilidade). 
Tecnologias Usadas 
Nós escolhemos HTML, CSS, JS porque é muito usada no mercado: 
Frontend: React (com um tema escuro para facilitar o uso na oficina). 
Backend: Node.js (rápido e leve). 
Banco de Dados: MySQL (para garantir que os dados fiquem seguros e relacionados). 
Como rodar no seu computador 
1. Banco de Dados: - Instale o MySQL. - Abra o arquivo `mecmax_v5.sql` e rode o script. Ele já cria o banco e coloca uns dados de teste 
(como o mecânico João `100001`). 
2. Backend (Servidor): - Entre na pasta `backend`: `cd backend` - Instale as dependências: `npm install` - Rode o servidor: `npm start` - Ele vai rodar na porta 3002. 
3. Frontend (Telas): - Entre na pasta `frontend`: `cd frontend` - Instale as dependências: `npm install` - Rode o site: `npm start` - O navegador vai abrir na porta 3000. 
Decisões de Projeto 
No início, tivemos dificuldade com a conexão do banco, então criamos uma função de segurança no 
backend para garantir que os dados sempre cheguem certos na tela. Também usamos **Triggers** 
no banco para que, assim que um empréstimo é feito, o status da ferramenta mude para 
"EMPRESTADA" automaticamente, sem precisar de código extra. 
Desenvolvido por Theo e Luiz.
