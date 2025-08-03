require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 3000; 

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});