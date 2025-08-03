require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectToDb = require('./src/Db/ConnectToDb');
const cors = require('cors');
const routes = require('./src/routes/routes');
const app = express();

app.use(cors());
app.use(bodyParser.json());
connectToDb( )

app.use(express.json({
  limit: '50mb'        
}));
app.use('/api', routes);

const port = process.env.PORT || 3000; 

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});