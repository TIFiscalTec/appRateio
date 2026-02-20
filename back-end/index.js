const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors'); // Importa o middleware CORS
const nodemailer = require('nodemailer');
require('dotenv').config();

const conn = require('./models/Conn.js'); // Importa a conexão com o MongoDB
const Imoveis = require('./models/Imoveis.js'); // Importa o modelo de imóveis

app.use(express.json());

const corsOptions = {
	origin: 'http://localhost:3000', // Permite apenas requisições do frontend local
	methods: ['GET', 'POST', 'PUT'], // Permite os métodos GET, POST e PUT
	allowedHeaders: ['Content-Type', 'Authorization'], // Permite cabeçalhos específicos
};

app.use(cors(corsOptions));


app.post('/cadastrarImovel', (req, res) => {

	// Inserindo o novo imóvel no banco de dados
	Imoveis.create(req.body)
		.then((imovel) => {
			console.log('Imóvel criado:', imovel);
			res.status(201).json(imovel); // Enviando o imóvel criado como resposta JSON
		})
		.catch((err) => {
			console.error('Erro ao inserir:', err);
			res.status(500).json({ error: 'Erro ao cadastrar imóvel' });
		});
});

app.get('/listarImoveis', (req, res) => {
	// Listando todos os imóveis do banco de dados
	Imoveis.find()
		.then((imoveis) => {
			console.log('Imóveis encontrados:', imoveis);
			res.json(imoveis); // Enviando os imóveis como resposta JSON
		})
		.catch((err) => {
			console.error('Erro ao listar:', err);
			res.status(500).json({ error: 'Erro ao listar imóveis' });
		});
});

app.get('/imovel/:id', (req, res) => {
	const imovelId = req.params.id; // Obtém o ID do imóvel a partir dos parâmetros da URL
	Imoveis.findById(imovelId)
		.then((imovel) => {
			if (!imovel) {
				return res.status(404).json({ error: 'Imóvel não encontrado' });
			}
			console.log('Imóvel encontrado:', imovel);
			res.json(imovel); // Enviando o imóvel encontrado como resposta JSON
		})
		.catch((err) => {
			console.error('Erro ao buscar imóvel:', err);
			res.status(500).json({ error: 'Erro ao buscar imóvel' });
		});
});

app.put('/editarImovel/:id', (req, res) => {
	const imovelId = req.params.id; // Obtém o ID do imóvel a partir dos parâmetros da URL
	Imoveis.findByIdAndUpdate(imovelId, req.body, { new: true })
		.then((imovel) => {
			if (!imovel) {
				return res.status(404).json({ error: 'Imóvel não encontrado' });
			}
			console.log('Imóvel atualizado:', imovel);
			res.json(imovel); // Enviando o imóvel atualizado como resposta JSON
		})
		.catch((err) => {
			console.error('Erro ao atualizar imóvel:', err);
			res.status(500).json({ error: 'Erro ao atualizar imóvel' });
		});
});

app.post('/enviarEmailComDesconto/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const imovel = await Imoveis.findById(id);
		if (!imovel) {
			return res.status(404).json({ message: "Imóvel não encontrado!" });
		}

		// Calculando o valor total com o desconto
		const valorComDesconto = (imovel.aluguelBruto + imovel.seguro) - imovel.desconto;

		// Detalhes do inquilino
		const { inquilino, email: emailInquilino } = imovel;
		const { aluguelBruto, seguro, desconto, imovel: imovelDescricao, vencimentoDia } = imovel;
		let mesAtual = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
		let anoAtual = new Date().getFullYear();
		mesAtual = mesAtual.charAt(0).toUpperCase() + mesAtual.slice(1); // Capitaliza o nome do mês

		// Configuração do transporte para o Nodemailer
		const transporter = nodemailer.createTransport({
			host: "mail.contblack.com.br",
			port: 465,
			secure: true,
			auth: {
				user: "contblack@contblack.com.br",
				pass: process.env.EMAIL_PASS, // Use a variável de ambiente para a senha
			},
		});

		// Criando o e-mail com os detalhes
		const mailOptions = {
			from: 'contblack@contblack.com.br',
			to: emailInquilino,
			subject: `Detalhamento de Pagamento do Aluguel - Imóvel ${imovelDescricao}`,
			html: `
                <p>Prezado(a) ${inquilino},</p>
                <p>Segue abaixo o detalhamento do valor do aluguel referente ao imóvel <strong>${imovelDescricao}</strong>, com as informações de pagamento para o mês de <strong>${mesAtual}</strong>, conforme acordado:</p>
                
                <table>
                    <tr>
                        <td><strong>Valor do Aluguel Bruto:</strong></td>
                        <td>R$ ${aluguelBruto.toFixed(2).replace('.', ',')}</td>
                    </tr>
                    <tr>
                        <td><strong>Seguro do Imóvel:</strong></td>
                        <td>R$ ${seguro.toFixed(2).replace('.', ',')}</td>
                    </tr>
                    <tr>
                        <td><strong>Desconto Aplicado:</strong></td>
                        <td>R$ ${desconto.toFixed(2).replace('.', ',')}</td>
                    </tr>
                    <tr>
                        <td><strong>Total a Pagar:</strong></td>
                        <td><strong>R$ ${valorComDesconto.toFixed(2).replace('.', ',')}</strong></td>
                    </tr>
                </table>
                
                <p><strong>Data de Vencimento:</strong> ${vencimentoDia}/${mesAtual}</p>
                
                <p>Por favor, efetue o pagamento até a data de vencimento para evitar encargos adicionais.</p>
                
                <p>Você pode realizar o pagamento via <strong>PIX</strong> utilizando a chave abaixo:</p>
                <p><strong>Chave PIX:</strong> ${process.env.CHAVE_PIX}</p>

                <p>Caso tenha qualquer dúvida ou precise de mais informações, estou à disposição para ajudá-lo.</p>

                <p>Atenciosamente,<br>Felipe<br>
            `
		};

		// Enviando o e-mail
		await transporter.sendMail(mailOptions);

		// Respondendo ao cliente
		res.json({ message: `E-mail enviado para ${emailInquilino} com sucesso!` });

	} catch (error) {
		console.error('Erro ao enviar o e-mail:', error);
		res.status(500).json({ message: 'Ocorreu um erro ao enviar o e-mail.' });
	}
});

app.post('/enviarEmailSemDesconto/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const imovel = await Imoveis.findById(id);
		if (!imovel) {
			return res.status(404).json({ message: "Imóvel não encontrado!" });
		}

		// Calculando o valor total sem o desconto
		const valorSemDesconto = imovel.aluguelBruto + imovel.seguro;

		// Detalhes do inquilino
		const { inquilino, email: emailInquilino } = imovel;
		const { aluguelBruto, seguro, desconto, imovel: imovelDescricao, vencimentoDia } = imovel;
		let mesAtual = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
		let anoAtual = new Date().getFullYear();
		mesAtual = mesAtual.charAt(0).toUpperCase() + mesAtual.slice(1); // Capitaliza o nome do mês

		// Configuração do transporte para o Nodemailer
		const transporter = nodemailer.createTransport({
			host: "mail.contblack.com.br",
			port: 465,
			secure: true,
			auth: {
				user: "contblack@contblack.com.br",
				pass: process.env.EMAIL_PASS,
			},
		});

		// Criando o e-mail com os detalhes
		const mailOptions = {
			from: 'contblack@contblack.com.br',
			to: emailInquilino,
			subject: `Detalhamento de Pagamento do Aluguel - Imóvel ${imovelDescricao}`,
			html: `
                <p>Prezado(a) ${inquilino},</p>
                <p>Segue abaixo o detalhamento do valor do aluguel referente ao imóvel <strong>${imovelDescricao}</strong>, com as informações de pagamento para o mês de <strong>${mesAtual}</strong>, conforme acordado:</p>
                
                <table>
                    <tr>
                        <td><strong>Valor do Aluguel Bruto:</strong></td>
                        <td>R$ ${aluguelBruto.toFixed(2).replace('.', ',')}</td>
                    </tr>
                    <tr>
                        <td><strong>Seguro do Imóvel:</strong></td>
                        <td>R$ ${seguro.toFixed(2).replace('.', ',')}</td>
                    </tr>
                    <tr>
                        <td><strong>Desconto Aplicado:</strong></td>
                        <td>R$ 0,00</td>
                    </tr>
                    <tr>
                        <td><strong>Total a Pagar:</strong></td>
                        <td><strong>R$ ${valorSemDesconto.toFixed(2).replace('.', ',')}</strong></td>
                    </tr>
                </table>
                   
                <p>Por favor, efetue o pagamento o quanto antes.</p>
                
                <p>Você pode realizar o pagamento via <strong>PIX</strong> utilizando a chave abaixo:</p>
                <p><strong>Chave PIX:</strong> ${process.env.CHAVE_PIX}</p>

                <p>Caso tenha qualquer dúvida ou precise de mais informações, estou à disposição para ajudá-lo.</p>

                <p>Atenciosamente,<br>Felipe<br>
            `
		};

		// Enviando o e-mail
		await transporter.sendMail(mailOptions);

		// Respondendo ao cliente
		res.json({ message: `E-mail enviado para ${emailInquilino} com sucesso!` });

	} catch (error) {
		console.error('Erro ao enviar o e-mail:', error);
		res.status(500).json({ message: 'Ocorreu um erro ao enviar o e-mail.' });
	}
});

// Definindo a porta do servidor
app.listen(port, () => {
	console.log(`Servidor rodando em http://localhost:${port}`);
});