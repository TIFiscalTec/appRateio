const mongoose = require('mongoose');

// String de conexão com o banco de dados correto
const connectionString = 'mongodb+srv://ti_db_user:DPGNGSYtYzDbEa5O@cluster0.wprtkbs.mongodb.net/appRateio?retryWrites=true&w=majority';

// Conectar ao MongoDB Atlas
mongoose.connect(connectionString)
  .then(() => {
    console.log('Conectado ao MongoDB Atlas no banco appRateio!');
  })
  .catch((err) => {
    console.error('Erro ao conectar:', err);
  });