import React, { useState, useEffect } from 'react';
import "./CourseSup.css";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import moment from 'moment';
import 'moment/locale/fr';


function CourseSup(props) {
    const [reservations, setReservations] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editReservation, setEditReservation] = useState(null);
    const [taxis, setTaxis] = useState([]);
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchReservations = async () => {
            const url = `${apiUrl}/api/reservation/nextresa`;
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const data = await response.json();
                setReservations(data.reservations);
            } catch (error) {
                console.error("Erreur lors de la récupération des réservations:", error);
            }
        };

        fetchReservations();
    }, []);


    useEffect(() => {
        const fetchTaxis = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/users/taxis`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch taxis');
                }
                const data = await response.json();
                setTaxis(data.taxis);
            } catch (error) {
                console.error("Erreur lors de la récupération des taxis:", error);
            }
        };
    
        if (openDialog) {
            fetchTaxis();
        }
    }, [openDialog]);
    
    const formatDate = (dateString) => {
        return moment(dateString).locale('fr').format('DD/MM/YYYY HH:mm');
    };

    const handleEditClick = (reservation) => {
        setEditReservation(reservation);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditReservation(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEditReservation({ ...editReservation, [name]: value });
    };

    const handleSubmitEdit = async () => {
        if (!editReservation || !editReservation.idReservation || !editReservation.idTaxi) {
            console.error("ID de réservation ou ID de taxi manquant pour la mise à jour.");
            // Vous pouvez éventuellement définir ici un état pour afficher un message d'erreur à l'utilisateur
            return;
        }
    
        try {
            const response = await fetch(`${apiUrl}/api/reservation/modiftaxi`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idReservation: editReservation.idReservation,
                    idTaxi: editReservation.idTaxi,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Échec de la mise à jour du taxi de la réservation. ' + (await response.json()).error);
            }
    
            // En supposant que la réponse contient les données de la réservation mise à jour
            const updatedReservation = await response.json();
    
            console.log("Réservation mise à jour :", updatedReservation);
            
            // Mettre à jour l'état local ou récupérer à nouveau la liste des réservations selon les besoins
            // Fermer le dialogue et réinitialiser l'état editReservation
            setOpenDialog(false);
            setEditReservation(null);
            // Rafraîchir la liste des réservations pour refléter la mise à jour
            // fetchReservations(); // Décommentez si vous avez une fonction pour récupérer à nouveau les réservations
    
            // Vous pouvez éventuellement définir ici un état pour afficher un message de succès à l'utilisateur
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la réservation :", error);
            // Vous pouvez éventuellement définir ici un état pour afficher un message d'erreur à l'utilisateur
        }
    };
    

    return (
        <div className="CourseSup">
            <h2 className='CourseSup__title'>CourseSup</h2>
            <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID Course</TableCell>
                        <TableCell>Adresse de Départ</TableCell>
                        <TableCell>Adresse d'Arrivée</TableCell>
                        <TableCell>Taxi</TableCell>
                        <TableCell>Heure de Départ</TableCell>
                        
                        <TableCell>Aller/Retour</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reservations.map(reservation => (
                        <TableRow key={reservation.idReservation}>
                            <TableCell>{reservation.idReservation}</TableCell>
                            <TableCell>{reservation.AdresseDepart}</TableCell>
                            <TableCell>{reservation.AdresseArrive}</TableCell>
                            <TableCell>{reservation.TaxiNom} {reservation.TaxiPrenom}</TableCell>
                            <TableCell>{formatDate(reservation.HeureDepart)}</TableCell>
                            <TableCell>{reservation.AllerRetour ? 'Oui' : 'Non'}</TableCell>
                            <TableCell>
                                <IconButton >
                                    <EditIcon onClick={() => handleEditClick(reservation)} />
                                </IconButton>
                            </TableCell>
                            
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Modifier la réservation</DialogTitle>
            <DialogContent>
                {/* Les champs existants */}
                <FormControl fullWidth margin="dense">
                <InputLabel id="select-taxi-label">Taxi</InputLabel>
<Select
    labelId="select-taxi-label"
    id="select-taxi"
    value={editReservation?.idTaxi || ''}
    label="Taxi"
    onChange={(e) => setEditReservation({ ...editReservation, idTaxi: e.target.value })}
>
    {Array.isArray(taxis) && taxis.map((taxi) => (
        <MenuItem key={taxi.idFiche} value={taxi.idFiche}>
            {taxi.nom} {taxi.prenom}
        </MenuItem>
    ))}
</Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>Annuler</Button>
                <Button onClick={handleSubmitEdit}>Enregistrer</Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}

export default CourseSup;