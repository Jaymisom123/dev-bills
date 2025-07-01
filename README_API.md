# 📚 API Documentation - Dev Bills

## 🚀 Base URL
```
http://localhost:3333/api
```

## 📋 Índice
- [Health Check](#health-check)
- [Categories](#categories)
- [Transactions](#transactions)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Data Types](#data-types)

---

## 🔍 Health Check

### GET /health
Verifica se a API está funcionando.

**Response:**
```json
{
  "status": "ok",
  "message": "API is running"
}
```

---

## 📁 Categories

### GET /categories
Lista todas as categorias disponíveis.

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "string",
      "name": "Alimentação",
      "color": "#FF5733",
      "type": "EXPENSE",
      "createdAt": "2025-01-20T10:00:00.000Z",
      "updatedAt": "2025-01-20T10:00:00.000Z"
    }
  ]
}
```

### GET /categories/:id
Busca uma categoria específica por ID.

**Parameters:**
- `id` (string, required): ID da categoria

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "685ef35d08481a596080a4b5",
    "name": "Alimentação",
    "color": "#FF5733",
    "type": "EXPENSE",
    "createdAt": "2025-01-20T10:00:00.000Z",
    "updatedAt": "2025-01-20T10:00:00.000Z"
  }
}
```

### POST /categories
Cria uma nova categoria.

**Request Body:**
```json
{
  "name": "Nova Categoria",
  "color": "#FF5733",
  "type": "expense"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "685ef35d08481a596080a4b5",
    "name": "Nova Categoria",
    "color": "#FF5733",
    "type": "EXPENSE",
    "createdAt": "2025-01-20T10:00:00.000Z",
    "updatedAt": "2025-01-20T10:00:00.000Z"
  }
}
```

### PUT /categories/:id
Atualiza uma categoria existente.

**Parameters:**
- `id` (string, required): ID da categoria

**Request Body:**
```json
{
  "name": "Categoria Atualizada",
  "color": "#00FF00",
  "type": "income"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "685ef35d08481a596080a4b5",
    "name": "Categoria Atualizada",
    "color": "#00FF00",
    "type": "INCOME",
    "createdAt": "2025-01-20T10:00:00.000Z",
    "updatedAt": "2025-01-20T10:30:00.000Z"
  }
}
```

### DELETE /categories/:id
Remove uma categoria.

**Parameters:**
- `id` (string, required): ID da categoria

**Response:** `204 No Content`

**⚠️ Nota:** Só é possível deletar categorias que não possuem transações associadas.

---

## 💰 Transactions

### GET /transactions
Lista transações com filtros e paginação.

**Query Parameters:**
- `userId` (string, optional): ID do usuário
- `categoryId` (string, optional): ID da categoria
- `type` (string, optional): "income" ou "expense"
- `startDate` (string, optional): Data inicial (ISO 8601)
- `endDate` (string, optional): Data final (ISO 8601)
- `page` (number, optional): Número da página (default: 1)
- `limit` (number, optional): Itens por página (default: 10)

**Example Request:**
```
GET /transactions?userId=user123&type=expense&page=1&limit=5
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "transactions": [
      {
        "id": "string",
        "description": "Compras no supermercado",
        "amount": 250.50,
        "date": "2025-01-20T10:00:00.000Z",
        "type": "EXPENSE",
        "userId": "user123",
        "categoryId": "685ef35d08481a596080a4b5",
        "createdAt": "2025-01-20T10:00:00.000Z",
        "updatedAt": "2025-01-20T10:00:00.000Z",
        "category": {
          "id": "685ef35d08481a596080a4b5",
          "name": "Alimentação",
          "color": "#FF5733",
          "type": "EXPENSE"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 25,
      "totalPages": 5
    }
  }
}
```

### GET /transactions/:id
Busca uma transação específica por ID.

**Parameters:**
- `id` (string, required): ID da transação

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "string",
    "description": "Salário mensal",
    "amount": 5000.00,
    "date": "2025-01-20T10:00:00.000Z",
    "type": "INCOME",
    "userId": "user123",
    "categoryId": "685ef35d08481a596080a4b5",
    "createdAt": "2025-01-20T10:00:00.000Z",
    "updatedAt": "2025-01-20T10:00:00.000Z",
    "category": {
      "id": "685ef35d08481a596080a4b5",
      "name": "Salário",
      "color": "#33FF57",
      "type": "INCOME"
    }
  }
}
```

### POST /transactions
Cria uma nova transação.

**Request Body:**
```json
{
  "description": "Compras no supermercado",
  "amount": 250.50,
  "categoryId": "685ef35d08481a596080a4b5",
  "type": "expense",
  "date": "2025-01-20T10:00:00.000Z",
  "userId": "user123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "string",
    "description": "Compras no supermercado",
    "amount": 250.50,
    "date": "2025-01-20T10:00:00.000Z",
    "type": "EXPENSE",
    "userId": "user123",
    "categoryId": "685ef35d08481a596080a4b5",
    "createdAt": "2025-01-20T10:00:00.000Z",
    "updatedAt": "2025-01-20T10:00:00.000Z",
    "category": {
      "id": "685ef35d08481a596080a4b5",
      "name": "Alimentação",
      "color": "#FF5733",
      "type": "EXPENSE"
    }
  }
}
```

### PUT /transactions/:id
Atualiza uma transação existente.

**Parameters:**
- `id` (string, required): ID da transação

**Request Body:**
```json
{
  "description": "Compras atualizadas",
  "amount": 300.00,
  "categoryId": "685ef35d08481a596080a4b5",
  "type": "expense",
  "date": "2025-01-20T15:00:00.000Z",
  "userId": "user123"
}
```

### DELETE /transactions/:id
Remove uma transação.

**Parameters:**
- `id` (string, required): ID da transação

**Response:** `204 No Content`

### GET /transactions/balance
Calcula o saldo (receitas - despesas) do usuário.

**Query Parameters:**
- `userId` (string, required): ID do usuário

**Example Request:**
```
GET /transactions/balance?userId=user123
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "income": 5000.00,
    "expense": 2500.00,
    "balance": 2500.00
  }
}
```

---

## 🔐 Authentication

A API possui middleware de autenticação Firebase (opcional). Para usar:

**Headers:**
```
Authorization: Bearer <firebase_token>
```

---

## ❌ Error Handling

### Formato de Erro
```json
{
  "status": "error",
  "message": "Descrição do erro"
}
```

### Códigos de Status HTTP
- `200` - Sucesso
- `201` - Criado com sucesso
- `204` - Sem conteúdo (delete bem-sucedido)
- `400` - Requisição inválida
- `401` - Não autorizado
- `404` - Não encontrado
- `500` - Erro interno do servidor

---

## 📊 Data Types

### Category
```typescript
interface Category {
  id: string;
  name: string;
  color: string; // Hex color (#FF5733)
  type: "INCOME" | "EXPENSE";
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Transaction
```typescript
interface Transaction {
  id: string;
  description: string;
  amount: number; // Sempre positivo
  date: string; // ISO 8601
  type: "INCOME" | "EXPENSE";
  userId: string;
  categoryId: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  category: Category;
}
```

---

## 🎨 Categorias Padrão

### Despesas (EXPENSE)
- 🍔 Alimentação (#FF5733)
- 🚗 Transporte (#33A8FF)
- 🏠 Moradia (#33FF57)
- 🏥 Saúde (#F033FF)
- 📚 Educação (#FF3366)
- 🎮 Lazer (#FFBA33)
- 🛍️ Compras (#33FFF6)
- 📦 Outros (#B033FF)

### Receitas (INCOME)
- 💼 Salário (#33FF57)
- 💻 Freelance (#33A8FF)
- 📈 Investimentos (#FFBA33)
- 📦 Outros (#B033FF)

---

## 🔧 Exemplo de Uso com JavaScript

```javascript
// Configuração base
const API_BASE_URL = 'http://localhost:3333/api';

// Buscar categorias
async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  const data = await response.json();
  return data.data;
}

// Criar transação
async function createTransaction(transactionData) {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transactionData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  const data = await response.json();
  return data.data;
}

// Buscar transações com filtros
async function getTransactions(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE_URL}/transactions?${params}`);
  const data = await response.json();
  return data.data;
}

// Buscar saldo
async function getBalance(userId) {
  const response = await fetch(`${API_BASE_URL}/transactions/balance?userId=${userId}`);
  const data = await response.json();
  return data.data;
}
``` 