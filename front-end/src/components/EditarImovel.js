import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function EditarImovel(props) {

    const handleClose = () => {
        props.setOpenEditarImovel(false);
    };

    // Criando um tema customizado com fundo preto
    const theme = createTheme({
        palette: {
            mode: 'dark', // Define o tema como escuro
            background: {
                default: '#121212', // Cor de fundo do modal
                paper: '#1D1D1D', // Cor do papel (diálogo)
            },
            text: {
                primary: '#fff', // Cor do texto principal (branco)
                secondary: '#bbb', // Cor do texto secundário
            },
        },
        components: {
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        backgroundColor: '#1D1D1D', // Cor de fundo do Dialog
                    },
                },
            },
            MuiDialogTitle: {
                styleOverrides: {
                    root: {
                        color: '#fff', // Cor do título do Dialog
                    },
                },
            },
            MuiDialogContent: {
                styleOverrides: {
                    root: {
                        color: '#bbb', // Cor do conteúdo do Dialog
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        color: '#fff', // Cor do texto dos botões
                    },
                },
            },
        },
    });


    const [cod, setCod] = useState('');
    const [proprietario, setProprietario] = useState('');
    const [imovel, setImovel] = useState('');
    const [inquilino, setInquilino] = useState('');
    const [email, setEmail] = useState('');
    const [aluguelBruto, setAluguelBruto] = useState('');
    const [vencimentoDia, setVencimentoDia] = useState('');
    const [moradores, setMoradores] = useState('');
    const [desconto, setDesconto] = useState('');
    const [seguro, setSeguro] = useState('');


    useEffect(() => {
        const getImovel = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/imovel/${props.idImovel}`);
                const data = await response.json();
                console.log('Dados do imóvel:', data);
                // Aqui você pode preencher os campos do formulário com os dados do imóvel
                setCod(data.cod);
                setProprietario(data.proprietario);
                setImovel(data.imovel);
                setInquilino(data.inquilino);
                setEmail(data.email);
                setAluguelBruto(data.aluguelBruto);
                setVencimentoDia(data.vencimentoDia);
                setMoradores(data.moradores);
                setDesconto(data.desconto);
                setSeguro(data.seguro || ''); // Preenche o campo seguro, ou deixa vazio se não existir
            } catch (error) {
                console.error('Erro ao buscar imóvel:', error);
            }
        };

        if (props.idImovel) {
            getImovel();
        }
    }, [props.idImovel]);

    const handleEdit = async () => {
        const updatedImovel = {
            cod,
            proprietario,
            imovel,
            inquilino,
            email,
            aluguelBruto,
            vencimentoDia,
            moradores,
            desconto,
            seguro: seguro ? Number(seguro) : 0, // Convertendo seguro para número, ou definindo como 0 se estiver vazio
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/editarImovel/${props.idImovel}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedImovel),
            });
            const data = await response.json();
            console.log('Imóvel atualizado:', data);
            // Aqui você pode adicionar lógica para atualizar a lista de imóveis ou fechar o modal
            props.setOpenEditarImovel(false);
        } catch (error) {
            console.error('Erro ao atualizar imóvel:', error);
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Dialog open={props.openEditarImovel} onClose={handleClose}>
                <DialogTitle>Editar Imóvel {props.idImovel}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Para editar um imóvel existente, por favor preencha os campos abaixo.
                    </DialogContentText>
                    <div style={{ width: "100%", display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <TextField sx={{ width: "30%" }} autoFocus required margin="dense" label="COD" fullWidth variant="outlined"
                            value={cod}
                            onChange={(e) => setCod(e.target.value)}
                            InputLabelProps={{
                                style: { color: '#bbb' }, // Cor da label do TextField
                            }}
                            InputProps={{
                                style: { color: '#fff' }, // Cor do texto do TextField
                            }}
                        />
                        <TextField sx={{ width: "65%" }} required margin="dense" label="Proprietário" fullWidth variant="outlined"
                            value={proprietario}
                            onChange={(e) => setProprietario(e.target.value)}
                            InputLabelProps={{
                                style: { color: '#bbb' }, // Cor da label do TextField
                            }}
                            InputProps={{
                                style: { color: '#fff' }, // Cor do texto do TextField
                            }}
                        />
                    </div>
                    <div style={{ width: "100%", display: 'flex', justifyContent: 'space-between' }}>
                        <TextField sx={{ width: "45%" }} autoFocus required margin="dense" label="Valor seguro" fullWidth variant="outlined"
                            value={seguro}
                            onChange={(e) => setSeguro(e.target.value)}
                            InputLabelProps={{
                                style: { color: '#bbb' }, // Cor da label do TextField
                            }}
                            InputProps={{
                                style: { color: '#fff' }, // Cor do texto do TextField
                            }}
                        />
                        <TextField sx={{ width: "45%" }} required margin="dense" label="Imóvel" fullWidth variant="outlined"
                            value={imovel}
                            onChange={(e) => setImovel(e.target.value)}
                            InputLabelProps={{
                                style: { color: '#bbb' }, // Cor da label do TextField
                            }}
                            InputProps={{
                                style: { color: '#fff' }, // Cor do texto do TextField
                            }}
                        />
                    </div>
                    <div style={{ width: "100%", display: 'flex', justifyContent: 'space-between' }}>
                        <TextField sx={{ width: "100%" }} autoFocus required margin="dense" label="Inquilino" fullWidth variant="outlined"
                            value={inquilino}
                            onChange={(e) => setInquilino(e.target.value)}
                            InputLabelProps={{
                                style: { color: '#bbb' }, // Cor da label do TextField
                            }}
                            InputProps={{
                                style: { color: '#fff' }, // Cor do texto do TextField
                            }}
                        />
                    </div>
                    <div style={{ width: "100%", display: 'flex', justifyContent: 'space-between' }}>
                        <TextField sx={{ width: "100%" }} autoFocus required margin="dense" label="E-mail Inquilino" fullWidth variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputLabelProps={{
                                style: { color: '#bbb' }, // Cor da label do TextField
                            }}
                            InputProps={{
                                style: { color: '#fff' }, // Cor do texto do TextField
                            }}
                        />
                    </div>
                    <div style={{ width: "100%", display: 'flex', justifyContent: 'space-between' }}>
                        <TextField sx={{ width: "47%" }} autoFocus required margin="dense" label="Aluguel Bruto" fullWidth variant="outlined"
                            value={aluguelBruto}
                            onChange={(e) => setAluguelBruto(e.target.value)}
                            InputLabelProps={{
                                style: { color: '#bbb' }, // Cor da label do TextField
                            }}
                            InputProps={{
                                style: { color: '#fff' }, // Cor do texto do TextField
                            }}
                        />
                        <TextField sx={{ width: "47%" }} required margin="dense" label="Dia vencimento" fullWidth variant="outlined"
                            value={vencimentoDia}
                            onChange={(e) => setVencimentoDia(e.target.value)}
                            InputLabelProps={{
                                style: { color: '#bbb' }, // Cor da label do TextField
                            }}
                            InputProps={{
                                style: { color: '#fff' }, // Cor do texto do TextField
                            }}
                        />
                    </div>
                    <div style={{ width: "100%", display: 'flex', justifyContent: 'space-between' }}>
                        <TextField sx={{ width: "47%" }} autoFocus required margin="dense" label="Qtd moradores" fullWidth variant="outlined"
                            value={moradores}
                            onChange={(e) => setMoradores(e.target.value)}
                            InputLabelProps={{
                                style: { color: '#bbb' }, // Cor da label do TextField
                            }}
                            InputProps={{
                                style: { color: '#fff' }, // Cor do texto do TextField
                            }}
                        />
                        <TextField sx={{ width: "47%" }} required margin="dense" label="Desconto" fullWidth variant="outlined"
                            value={desconto}
                            onChange={(e) => setDesconto(e.target.value)}
                            InputLabelProps={{
                                style: { color: '#bbb' }, // Cor da label do TextField
                            }}
                            InputProps={{
                                style: { color: '#fff' }, // Cor do texto do TextField
                            }}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <button style={{
                        padding: "12px 24px",
                        backgroundColor: "#460c21",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50px",
                        cursor: "pointer",
                        fontSize: "1rem",
                        transition: "background-color 0.3s ease",
                        boxShadow: "0px 4px 10px rgba(185, 28, 86, 0.2)"
                    }}
                        onClick={handleClose}
                    >
                        Cancelar
                    </button>
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
                        onMouseOver={(e) => e.target.style.backgroundColor = "#B91C56"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#B91C56"}
                        onClick={handleEdit}
                    >
                        Editar Imóvel
                    </button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}
