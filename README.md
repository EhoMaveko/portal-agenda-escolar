# Portal da Agenda Escolar

Aplicação web desenvolvida como avaliação técnica, com Laravel, Angular, MySQL, Redis e Docker Compose.

## Tecnologias

- **Backend:** Laravel e PHP
- **Frontend:** Angular e TypeScript
- **Estilização:** CSS responsivo
- **Banco de dados:** MySQL 8.4
- **Fila de processamento:** Redis e Laravel Queue Worker
- **Armazenamento de arquivos:** S3Mock
- **Infraestrutura:** Docker Compose

## Pré-requisitos

- Docker Desktop instalado e em execução
- Git instalado

## Como executar

### 1. Clonar o repositório

```bash
git clone https://github.com/EhoMaveko/portal-agenda-escolar.git
cd portal-agenda-escolar
```

### 2. Configurar o ambiente do Laravel

No PowerShell, a partir da raiz do projeto:

```powershell
Copy-Item .\backend\.env.example .\backend\.env
```

O arquivo `backend/.env.example` contém a configuração de referência para os serviços do Docker Compose.

### 3. Iniciar os containers

```powershell
docker compose up -d --build
```

### 4. Gerar a chave da aplicação

```powershell
docker compose exec backend php artisan key:generate
```

### 5. Executar as migrations

```powershell
docker compose exec backend php artisan migrate --force
```

### 6. Verificar os serviços

```powershell
docker compose ps
```

Para consultar os logs:

```powershell
docker compose logs --tail=100 backend
docker compose logs --tail=100 queue-worker
```

## Acessos locais

- **Frontend Angular:** http://localhost:4200
- **API Laravel:** http://localhost:8000/api
- **MySQL:** localhost:3307
- **S3Mock:** http://localhost:9090

O backend deve utilizar o nome do serviço `mysql` para acessar o banco dentro da rede Docker. O frontend acessa a API pela configuração definida no projeto.

## Funcionalidades

- Listagem de agendas por perfil.
- Cadastro de agendas com validação.
- Envio de respostas dos alunos com anexos.
- Listagem das respostas de uma agenda.
- Solicitação de relatório resumido do DSA por meio de processamento assíncrono.
- Processamento de tarefas com Redis e Queue Worker.

## Fila de processamento

O serviço `queue-worker` processa as tarefas enfileiradas pelo Laravel. Para acompanhar seu funcionamento:

```powershell
docker compose logs -f queue-worker
```

## Encerrar a aplicação

```powershell
docker compose down
```

Para encerrar os containers e também apagar os dados persistidos do banco de dados:

```powershell
docker compose down -v
```

**Atenção:** o segundo comando remove os volumes do Docker e pode apagar os dados do banco.

## Observações

- Não versionar o arquivo `backend/.env`, pois ele contém configurações locais.
- O arquivo `backend/.env.example` deve permanecer versionado.
- O S3Mock é utilizado para simular o armazenamento de objetos localmente.
