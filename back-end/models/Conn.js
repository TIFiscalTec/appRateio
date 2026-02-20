const mongoose = require('mongoose');

// String de conexão com o banco de dados correto
const connectionString = process.env.CONNECTION_STRING;

// Conectar ao MongoDB Atlas
mongoose.connect(connectionString)
  .then(() => {
    console.log('Conectado ao MongoDB Atlas no banco appRateio!');
  })
  .catch((err) => {
    console.error('Erro ao conectar:', err);
  });