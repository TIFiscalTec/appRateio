const mongoose = require('mongoose');

// Definindo o schema (estrutura) dos dados
const imovelSchema = new mongoose.Schema({
  cod: { type: String, required: true },
  proprietario: { type: String, required: true },
  imovel: { type: String, required: true },
  inquilino: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  aluguelBruto: { type: Number, required: true },
  vencimentoDia: { type: Number, required: true },
  moradores: { type: Number, required: true },
  desconto: { type: Number, required: true },
  seguro: { type: Number, required: false },
});

// Criando o modelo a partir do schema
const Imoveis = mongoose.model('Imoveis', imovelSchema);

module.exports = Imoveis;