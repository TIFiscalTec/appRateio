import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import DiscountIcon from '@mui/icons-material/Discount';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import AdicionarImovel from './components/AdicionarImovel';
import './App.css';
import EditarImovel from './components/EditarImovel';
import CircularProgress from '@mui/material/CircularProgress';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: "#B91C56",
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}));

export default function App() {

	const [openAdicionarImovel, setOpenAdicionarImovel] = useState(false);
	const [openEditarImovel, setOpenEditarImovel] = useState(false);
	const [imoveis, setImoveis] = useState([]);
	const [idImovel, setIdImovel] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getImoveis = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/listarImoveis`);
				const data = await response.json();
				console.log('Imóveis do backend:', data);
				setImoveis(data);
			} catch (error) {
				console.error('Erro ao buscar imóveis:', error);
			}
		};

		getImoveis();
	}, [openAdicionarImovel, setOpenAdicionarImovel, openEditarImovel, setOpenEditarImovel]);

	const handleSendEmailWithDiscount = async (id) => {
		try {
			setLoading(true);
			const response = await fetch(`${process.env.REACT_APP_API_URL}/enviarEmailComDesconto/${id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				}
			});

			if (response.ok) {
				alert('E-mail com desconto enviado com sucesso!');
			} else {
				alert('Erro ao enviar e-mail com desconto.');
			}
		} catch (error) {
			console.error('Erro ao enviar e-mail com desconto:', error);
			alert('Erro ao enviar e-mail com desconto.');
		} finally {
			setLoading(false);
		}
	};


	const handleSendEmailWithoutDiscount = async (id) => {
		try {
			setLoading(true);
			const response = await fetch(`${process.env.REACT_APP_API_URL}/enviarEmailSemDesconto/${id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				}
			});

			if (response.ok) {
				alert('E-mail sem desconto enviado com sucesso!');
			} else {
				alert('Erro ao enviar e-mail sem desconto.');
			}
		} catch (error) {
			console.error('Erro ao enviar e-mail sem desconto:', error);
			alert('Erro ao enviar e-mail sem desconto.');
		} finally {
			setLoading(false);
		}
	};

	return (

		<>
			<div style={{
				width: "95%",
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				borderBottom: "2px solid #f0f0f0",
				padding: "20px 0",
				margin: "20px auto"
			}}>
				<div>
					<h1 style={{
						margin: "0",
						fontSize: "2rem",
						fontWeight: "600",
					}}>
						Listagem de Imóveis
					</h1>
					<p style={{
						margin: "10px 0",
						fontSize: "1rem",
					}}>
						Aqui você pode visualizar todos os imóveis cadastrados.
					</p>
				</div>

				<div>
					<button style={{
						padding: "12px 24px",
						backgroundColor: "#B91C56",
						color: "#fff",
						border: "none",
						borderRadius: "50px",
						cursor: "pointer",
						fontSize: "1rem",
						transition: "background-color 0.3s ease",
						boxShadow: "0px 4px 10px rgba(185, 28, 86, 0.2)"
					}}
						onClick={() => setOpenAdicionarImovel(true)}
						onMouseOver={(e) => e.target.style.backgroundColor = "#B91C56"}
						onMouseOut={(e) => e.target.style.backgroundColor = "#B91C56"}
					>
						Adicionar Imóvel
					</button>
				</div>
			</div>

			<div style={{ width: "95%", height: "1000px", margin: "0 auto" }}>
				<TableContainer>
					<Table aria-label="customized table">
						<TableHead>
							<TableRow>
								<StyledTableCell align="left">COD</StyledTableCell>
								<StyledTableCell align="center">Proprietário</StyledTableCell>
								{/* <StyledTableCell align="center">COD gás</StyledTableCell> */}
								<StyledTableCell align="center">Imóvel</StyledTableCell>
								<StyledTableCell align="center">Inquilino</StyledTableCell>
								<StyledTableCell align="center">E-mail</StyledTableCell>
								<StyledTableCell align="center">Aluguel Bruto</StyledTableCell>
								<StyledTableCell align="center">Vencimento dia</StyledTableCell>
								<StyledTableCell align="center">Moradores</StyledTableCell>
								<StyledTableCell align="center">Desconto</StyledTableCell>
								<StyledTableCell align="center">Seguro</StyledTableCell>
								<StyledTableCell align="right">Ação</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{imoveis.map((row) => (
								<StyledTableRow key={row.name}>
									<StyledTableCell align="left">{row.cod}</StyledTableCell>
									<StyledTableCell align="center">{row.proprietario}</StyledTableCell>
									{/* <StyledTableCell align="center">{row.codGas}</StyledTableCell> */}
									<StyledTableCell align="center">{row.imovel}</StyledTableCell>
									<StyledTableCell align="center">{row.inquilino}</StyledTableCell>
									<StyledTableCell align="center">{row.email}</StyledTableCell>
									<StyledTableCell align="center">{row.aluguelBruto}</StyledTableCell>
									<StyledTableCell align="center">{row.vencimentoDia}</StyledTableCell>
									<StyledTableCell align="center">{row.moradores}</StyledTableCell>
									<StyledTableCell align="center">{row.desconto}</StyledTableCell>
									<StyledTableCell align="center">{row.seguro}</StyledTableCell>
									<StyledTableCell align="right" style={{ cursor: 'pointer', display: 'flex', gap: '20px' }}>
										{!loading && (
											<>
												<Tooltip title="Enviar fatura com desconto">
													<DiscountIcon style={{ color: "#B91C56" }} onClick={() => handleSendEmailWithDiscount(row._id)} />
												</Tooltip>
												<Tooltip title="Enviar fatura sem desconto">
													<RequestQuoteIcon style={{ color: "#B91C56" }} onClick={() => handleSendEmailWithoutDiscount(row._id)} />
												</Tooltip>
												<Tooltip title="Editar Imóvel">
													<EditIcon style={{ color: "#B91C56" }} onClick={() => { setOpenEditarImovel(true); setIdImovel(row._id); }} />
												</Tooltip>
											</>
										)}
										{loading && <CircularProgress style={{ color: "#B91C56" }} />}
									</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
			<AdicionarImovel openAdicionarImovel={openAdicionarImovel} setOpenAdicionarImovel={setOpenAdicionarImovel} />
			<EditarImovel openEditarImovel={openEditarImovel} setOpenEditarImovel={setOpenEditarImovel} idImovel={idImovel} />
		</>
	);
}
