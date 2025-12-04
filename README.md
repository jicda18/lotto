# Lotto

## ⚙️ Requisitos

- Node.js **v24.11**
- Yarn
- Docker

## 🚀 Instalación

### 1. Clona el repositorio:

```bash
git clone https://github.com/jicda18/lotto.git
cd lotto
```

### 2. Copia y configura el archivo de entorno:

#### 2.1. Production

```
cp ./.env.example ./.env
```

#### 2.2 Development

```
cp ./frontend/.env.example ./frontend/.env
cp ./imaker/.env.example ./imaker/.env
cp ./oapi/.env.example ./oapi/.env
cp ./scrapper/.env.example ./scrapper/.env
cp ./snpublisher/.env.example ./snpublisher/.env
```

### 3. Create user:

> **Nota:** only required for production environment

```
addgroup --gid 2020 lottogroup && adduser --uid 2020 --gid 2020 --disabled-password --gecos "" lottouser
```

### 4. Up Services

#### 4.1. Production

```
make up
```

#### 4.2. Development

```
docker compose up -d

cd ./oapi/ && npx prisma migrate deploy && yarn install && yarn dev
cd ./scrapper/ && yarn install && yarn dev
cd ./imaker/ && yarn install && yarn dev
cd ./snpublisher/ && yarn install && yarn dev
cd ./oapi/ && yarn install && yarn dev
cd ./frontend/ && VITE_OAPI_URL=http://localhost:3000 node scripts/GetCollectionsLogo.js && yarn install && yarn dev
```
