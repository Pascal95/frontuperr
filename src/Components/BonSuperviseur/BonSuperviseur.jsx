import React, {useState, useEffect} from 'react';
import './BonSuperviseur.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';

function BonSuperviseur(props) {
    const [bons, setBons] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    const [openDialog, setOpenDialog] = useState(false);
    const [transportCount, setTransportCount] = useState(1);
    const [selectedBonId, setSelectedBonId] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [openRefuseDialog, setOpenRefuseDialog] = useState(false);
    const [refuseMessage, setRefuseMessage] = useState('');



    useEffect(() => {
        fetch(`${apiUrl}/api/bon`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => setBons(data.bons))
        .catch(error => console.error('Erreur lors de la récupération des bons:', error));
    }, []);

    const handleViewPdf = (ficBon) => {
        window.open(`${apiUrl}/files/${ficBon}`, '_blank');
    };
    const handleValidate = async (transportCount,idBon) => {
        
        try {
            const response = await fetch(`${apiUrl}/api/bon/validateBon`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idFiche: selectedUserId,
                    idBonTransport: idBon,
                    nombreTransports: transportCount
                })
            });
    
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la validation du bon');
            }
    
            // Mettre à jour l'état ou la UI pour refléter la validation du bon
            console.log("Bon validé avec succès", data.message);
            // Vous pouvez également recharger les bons ici pour mettre à jour les données affichées
        } catch (error) {
            console.error('Erreur lors de la validation du bon:', error);
            // Gérer l'erreur ici (par exemple, afficher un message d'erreur)
        }
    };
    

    const handleRefuse = async (idBon) => {
        try {
            const response = await fetch(`${apiUrl}/api/bon/refuseBon`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idFiche: selectedUserId,
                    idBonTransport: idBon,
                    messageRefus: refuseMessage
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la validation du bon');
            }
    
            // ... gestion de la réponse et des erreurs
            setOpenRefuseDialog(false);
        } catch (error) {
            // ... gestion des erreurs
        }
    };
    
    const handleClickOpen = (bon) => {
        setSelectedBonId(bon.idBon);
        setSelectedUserId(bon.ficheuser.idFiche);
        setTransportCount(1); // Réinitialiser à une valeur par défaut
        setOpenDialog(true);
    };
    

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleConfirm = () => {
        const transportCountNumber = parseInt(transportCount, 10);
        if (!isNaN(transportCountNumber) && transportCountNumber > 0) {
            handleValidate(transportCountNumber, selectedBonId);
        } else {
            // Gérer l'erreur de valeur invalide
        }
        setOpenDialog(false);
    };
    

    const handleRefuseClick = (bon) => {
        setSelectedBonId(bon.idBon);
        setSelectedUserId(bon.ficheuser.idFiche);
        setOpenRefuseDialog(true);
    };

    return (
        <div className="BonSuperviseur">
            <Dialog open={openDialog} onClose={handleClose}>
                <DialogTitle>Valider le Bon de Transport</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Combien de transports souhaitez-vous ajouter?
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="transportCount"
                        label="Nombre de Transports"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={transportCount}
                        onChange={(e) => setTransportCount(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                    <Button onClick={handleConfirm}>Confirmer</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openRefuseDialog} onClose={() => setOpenRefuseDialog(false)}>
                <DialogTitle>Refuser le Bon de Transport</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Veuillez fournir une raison pour le refus du bon.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="refuseMessage"
                        label="Message de Refus"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={refuseMessage}
                        onChange={(e) => setRefuseMessage(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRefuseDialog(false)}>Annuler</Button>
                    <Button onClick={() => handleRefuse(selectedBonId)}>Confirmer</Button>
                </DialogActions>
            </Dialog>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                        <TableCell>Id Bon</TableCell>
                        <TableCell>Nom du Patient</TableCell>
                        <TableCell>Prénom du Patient</TableCell>
                        <TableCell>Dr Prescripteur</TableCell>
                        <TableCell>Date Émission</TableCell>
                        <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bons.map((bon) => (
                            <TableRow key={bon.idBon}>
                                <TableCell>{bon.idBon}</TableCell>
                                <TableCell>{bon.ficheuser?.nom}</TableCell>
                                <TableCell>{bon.ficheuser?.prenom}</TableCell>
                                <TableCell>{bon.drPrescripteur}</TableCell>
                                <TableCell>{bon.dateEmission}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleViewPdf(bon.ficBon)}>
                                        <i className = "ri-eye-line" color='green'></i>
                                    </IconButton>
                                    <IconButton onClick={() => handleClickOpen(bon)}>
                                        <i className = "ri-check-line" color='green'></i>
                                        
                                    </IconButton>
                                    <IconButton onClick={() => handleRefuseClick(bon)}>
                                        <i className = "ri-close-line" color='red'></i>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default BonSuperviseur;