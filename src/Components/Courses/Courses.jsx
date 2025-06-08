import React, { useState, useEffect } from 'react';
import './Courses.css';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import moment from 'moment';
import 'moment/locale/fr';

function Courses(props) {
    const [reservations, setReservations] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [isTooLate, setIsTooLate] = useState(false);
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        fetchReservations();
    }, []);

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

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                navigate('/');
                throw new Error('Token is invalid or expired');
            }

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            setReservations(data.reservations);
        } catch (error) {
            console.error("Erreur lors de la récupération des réservations:", error);
        }
    };

    const handleOpenDialog = (reservation) => {
        const heureDepart = moment(reservation.HeureDepart);
        const maintenant = moment();
        const diffMinutes = heureDepart.diff(maintenant, 'minutes');
        setIsTooLate(diffMinutes <= 45);
        setSelectedReservation(reservation);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedReservation(null);
        setIsTooLate(false);
    };

    const handleConfirmCancel = async () => {
        if (!selectedReservation) return;

        try {
            const response = await fetch(`${apiUrl}/api/reservation/annulerreservation`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idReservation: selectedReservation.idReservation })
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            await response.json();
            fetchReservations();
            handleCloseDialog();
        } catch (error) {
            console.error("Erreur lors de l'annulation de la réservation:", error);
        }
    };

    const formatDate = (dateString) => {
        return moment(dateString).locale('fr').format('DD/MM/YYYY HH:mm');
    };

    return (
        <div className='CoursesInit'>
            <h2 className="courses__title">Mes prochaines courses</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Réservation</TableCell>
                            <TableCell>Taxi</TableCell>
                            <TableCell>Adresse de Départ</TableCell>
                            <TableCell>Adresse d'Arrivée</TableCell>
                            <TableCell>Heure de Départ</TableCell>
                            <TableCell>Aller/Retour</TableCell>
                            <TableCell>Annuler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations.map(reservation => (
                            <TableRow key={reservation.idReservation}>
                                <TableCell>{reservation.idReservation}</TableCell>
                                <TableCell>{reservation.TaxiNom} {reservation.TaxiPrenom}</TableCell>
                                <TableCell>{reservation.AdresseDepart}</TableCell>
                                <TableCell>{reservation.AdresseArrive}</TableCell>
                                <TableCell>{formatDate(reservation.HeureDepart)}</TableCell>
                                <TableCell>{reservation.AllerRetour ? 'Oui' : 'Non'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenDialog(reservation)}>
                                        <ClearIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirmation d'annulation</DialogTitle>
                <DialogContent>
                    {isTooLate ? (
                        <Typography color="error">
                            La course est prévue dans moins de 45 minutes. Vous ne pouvez pas l’annuler en ligne.
                            Merci de contacter un opérateur au 01 46 44 99 29.
                        </Typography>
                    ) : (
                        <Typography>
                            Êtes-vous sûr de vouloir annuler cette course ?
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Annuler</Button>
                    {!isTooLate && (
                        <Button onClick={handleConfirmCancel} color="error">
                            Confirmer
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Courses;