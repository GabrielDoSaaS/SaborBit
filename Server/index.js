// index.js (Atualizado)
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./src/routes/routes');
const connectToDb = require('./src/Db/ConnectToDb'); 
const QRCode = require('qrcode');
const cron = require('node-cron');
const app = express();
const PlanController = require('./src/Controllers/PlansController'); 

connectToDb();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json({
  limit: '50mb'        
}));
app.use('/api', routes);


cron.schedule('0 0 * * *', () => {
    console.log('Executando verificação de planos expirados...');
    PlanController.verificarPlanosExpirados();
});

const port = process.env.PORT || 3000; 

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});