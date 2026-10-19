Portal da Agenda Escolar

Aplicação web desenvolvida como avaliação técnica, utilizando Laravel, Angular, Tailwind CSS, MySQL, Redis e Docker Compose.

Tecnologias

Backend: Laravel e PHP

Frontend: Angular e TypeScript

Estilização: Tailwind CSS

Banco de dados: MySQL 8.4

Processamento assíncrono: Redis e Laravel Queue Worker

Armazenamento de arquivos: MinIO, compatível com a API S3

Infraestrutura: Docker Compose

Pré-requisitos

Docker Desktop instalado e em execução

Git instalado

Como executar

1. Clonar o repositório

git clone https://github.com/EhoMaveko/portal-agenda-escolar.git
cd portal-agenda-escolar

2. Configurar o ambiente

Na raiz do projeto, execute no PowerShell:

Copy-Item .\backend\.env.example .\backend\.env

O arquivo backend/.env.example serve como referência para a configuração local. Confira se as variáveis de ambiente estão compatíveis com os serviços definidos no docker-compose.yml.

3. Iniciar os containers

docker compose up -d --build

4. Gerar a chave da aplicação

docker compose exec backend php artisan key:generate

5. Executar as migrations

docker compose exec backend php artisan migrate --force

6. Verificar os serviços

docker compose ps

Para consultar os logs:

docker compose logs --tail=100 backend
docker compose logs --tail=100 queue-worker

Acessos locais

Frontend Angular: http://localhost:4200

API Laravel: http://localhost:8000/api

MySQL: localhost:3307

MinIO Console: http://localhost:9002

API S3 do MinIO: http://localhost:9000

Dentro da rede Docker, o backend utiliza o nome do serviço mysql para acessar o banco de dados e minio:9000 para acessar o armazenamento de arquivos.

As credenciais do MinIO devem ser configuradas no ambiente local, sem incluir senhas no repositório.

Funcionalidades

Listagem de agendas por perfil.

Cadastro de agendas com validação.

Envio de respostas dos alunos com anexos.

Armazenamento de arquivos no MinIO.

Listagem das respostas de uma agenda.

Solicitação de relatório resumido da DSA com processamento assíncrono.

Processamento de tarefas com Redis e Laravel Queue Worker.

Interface responsiva para celular, tablet e desktop.

Responsividade

A interface utiliza classes responsivas do Tailwind CSS para adaptar a organização dos componentes à largura da tela.

Largura de referência

Comportamento esperado

375 px — celular

Formulário, lista e respostas empilhados verticalmente, com um cartão de agenda por linha.

768 px — tablet

Formulário com campos relacionados lado a lado e lista com dois cartões por linha.

1440 px — desktop

Cadastro organizado em duas colunas e lista de agendas ao lado do painel de respostas.

Roteiro de testes responsivos

Em cada largura, verificar:

Carregar a lista de agendas.

Cadastrar uma nova agenda.

Selecionar uma agenda e visualizar suas respostas.

Enviar uma resposta com comentário.

Enviar uma resposta com arquivo anexado.

Solicitar o relatório DSA.

Conferir mensagens de carregamento, erro e lista vazia.

Verificar se textos longos, datas, nomes de arquivos e botões permanecem visíveis, sem rolagem horizontal indesejada.

Os testes devem ser marcados como concluídos somente após a verificação no navegador.

Fila de processamento

O serviço queue-worker processa as tarefas enfileiradas pelo Laravel. Para acompanhar sua execução:

docker compose logs -f queue-worker

Encerrar a aplicação

Para parar os containers:

docker compose down

Para parar os containers e remover os volumes persistidos:

docker compose down -v

Atenção: o segundo comando remove os volumes e pode apagar os dados persistidos do banco e do armazenamento local.

Observações

Não versionar o arquivo backend/.env, pois ele contém configurações locais.

Manter o arquivo backend/.env.example versionado, sem segredos reais.

As credenciais utilizadas no ambiente de desenvolvimento devem ser diferentes das credenciais de produção.

O MinIO é utilizado para simular um armazenamento de objetos compatível com S3 em ambiente local.