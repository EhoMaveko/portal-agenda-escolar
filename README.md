# Portal da Agenda Escolar

Aplicação web desenvolvida como avaliação técnica, com Laravel, Angular, MySQL, Redis e Docker Compose.

## Tecnologias

- **Backend:** Laravel e PHP
- **Frontend:** Angular e TypeScript
- **Estilização:** Tailwind CSS
- **Banco de dados:** MySQL 8.4
- **Fila de processamento:** Redis e Laravel Queue Worker
- **Armazenamento de arquivos:** MinIO, compatível com a API S3
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

O arquivo `backend/.env.example` contém a configuração de referência para o ambiente local. Confira se as variáveis estão compatíveis com o `docker-compose.yml`.

### 3. Iniciar os containers

```powershell
docker compose up -d --build
```

### 4. Gerar a chave da aplicação

```powershell
docker compose exec backend php artisan key:generate
```

### 5. Executar as migrations e criar os perfis iniciais

```powershell
docker compose exec backend php artisan migrate --seed --force
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
- **Console MinIO:** http://localhost:9002
- **API de armazenamento MinIO:** http://localhost:9000

Dentro da rede Docker, o backend utiliza o serviço `mysql` para acessar o banco de dados e `minio:9000` para acessar o armazenamento de arquivos.

## Funcionalidades

- Listagem de agendas por perfil.
- Cadastro de agendas com validação.
- Envio de respostas dos alunos com anexos.
- Armazenamento de arquivos no MinIO.
- Listagem das respostas de uma agenda.
- Solicitação de relatório resumido do DSA por meio de processamento assíncrono.
- Processamento de tarefas com Redis e Laravel Queue Worker.
- Interface responsiva para diferentes tamanhos de tela.

## Fila de processamento

O serviço `queue-worker` processa as tarefas enfileiradas pelo Laravel. Para acompanhar seu funcionamento:

```powershell
docker compose logs -f queue-worker
```

## Encerrar a aplicação

```powershell
docker compose down
```

Para encerrar os containers e também apagar os dados persistidos nos volumes do Docker:

```powershell
docker compose down -v
```

**Atenção:** o segundo comando remove os volumes e pode apagar os dados persistidos do banco de dados e de outros serviços.

## Observações

- Não versionar o arquivo `backend/.env`, pois ele contém configurações locais.
- O arquivo `backend/.env.example` deve permanecer versionado, sem credenciais sensíveis.
- O MinIO é utilizado para simular localmente um armazenamento de objetos compatível com a API S3.
- As credenciais de desenvolvimento não devem ser utilizadas em produção.