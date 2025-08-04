# SaborBit 🍽️

**SaborBit** é um SaaS dedicado a ajudar restaurantes a terem seu próprio cardápio online através de QR Codes e facilitar pedidos via WhatsApp.

**O projeto está no ar,** acesse:  https://saborbit-1.onrender.com/

## ✨ Funcionalidades

- **Cardápio Digital**
  - 🖥️ Página web personalizada para cada restaurante
  - 📲 Acesso via QR Code sem necessidade de login
  - 🖼️ Suporte a fotos e descrições dos produtos

- **Pedidos Integrados**
  - 💬 Integração direta com WhatsApp
  - 📊 Dashboard de pedidos para o restaurante

- **Pagamentos**
  - 💳 Processamento via API do Mercado Pago
  - 📊 Relatórios financeiros

## 🚀 Tecnologias

**Frontend:**
- ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white) + ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)

**Backend:**
- ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) + ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white)
- ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white)

**Integrações:**
- ![Mercado Pago](https://img.shields.io/badge/-Mercado_Pago-00B1EA)
- ![WhatsApp](https://img.shields.io/badge/-WhatsApp-25D366?logo=whatsapp&logoColor=white)

## 🛠️ Instalação na máquina

```bash
# Clone o repositório
git clone https://github.com/GabrielDoSaaS/saborbit.git

# Instale as dependências do Front-end
cd Client
npm install

# Inicie o Front-end em localhost
npm run dev

# Instale as dependências do Back-end
cd Server
npm install

# Inicie o servidor em localhost
node index.js

```

## 📡 API Reference

### Autenticação
`POST /api/loginChef`
```json
// Request
{
  "email": "restaurante@exemplo.com",
  "password": "senha123"
}

// Response (200)
{
 "message": "Login successful",
  "chef": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "restaurantName": "string",
    "planoAtivo": "boolean",
    "dataExpiracaoPlano":"Date",
    "createdAt": "Date",
    "profilePicture"?: "string" | "undefined",
    "qrCodeUrl"?: "string" | "undefined",
    "_id": Types.ObjectId
  }
}

// Response (500)
{
  "message": "Internal server error"
}

```
`POST /api/beAChef`
```json
// Request
{
  "name": "your name",
  "email": "restaurante@exemplo.com",
  "password": "senha123",
  "phone": "your phone",
  "address": "your address"
}

// Response (200)
{
 "message": "Chef registered successfully",
  "chef": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "restaurantName": "string",
    "planoAtivo": "boolean",
    "dataExpiracaoPlano":"Date",
    "createdAt": "Date",
    "profilePicture"?: "string" | "undefined",
    "qrCodeUrl"?: "string" | "undefined",
    "_id": Types.ObjectId
  }
}

// Response (500)
{
  "message": "Internal server error"
}

```
### Rotas que geram links de checkout para pagamento de planos recorrentes
`POST /api/planMensal`

```json
// Request
{
  "emailChef": "your-email@gmail.com",
}

// Response (200)
{
  "linkCheckout": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=123456789-9876-4321-abcd-efg123456789"
}

// Response (500)
{
  "message": "Internal server error"
}

```

`POST /api/planAnual`

```json
// Request
{
  "emailChef": "your-email@gmail.com",
}

// Response (200)
{
  "linkCheckout": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=123456789-9876-4321-abcd-efg123456789"
}

// Response (500)
{
  "message": "Internal server error"
}

```

### Rotas que operam diretamente com o modelo de Chef
`GET /chefs/:chefId`
```json

// Response (200)
{
  "chef": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "restaurantName": "string",
    "planoAtivo": "boolean",
    "dataExpiracaoPlano":"Date",
    "createdAt": "Date",
    "profilePicture"?: "string" | "undefined",
    "qrCodeUrl"?: "string" | "undefined",
    "_id": Types.ObjectId
  }
}

// Response (500)

{
  "message": "Erro ao buscar chef",
  "error": "error.message"
}

```
`PUT /chefs/:chefId`
```json
// Request
{
  "email": "your-email@gmail.com",
  "password": "your-password",
  "updateData": {
      "name": "your name",
      "email": "restaurante@exemplo.com",
      "password": "senha123",
      "phone": "your phone",
      "address": "your address"
  }
}

// Response (200)
{
  "message": "Informações do chef atualizadas com sucesso!",
  {
      "name": "your name",
      "email": "restaurante@exemplo.com",
      "phone": "your phone",
      "address": "your address"
  }
 }

```








