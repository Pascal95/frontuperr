import React, { useState, useRef, useEffect } from 'react';
import './Courses.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import moment from 'moment';
import 'moment/locale/fr';

function Courses( props ) {
    const [reservations, setReservations] = useState([]);
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
                        <TableCell>Adresse de Départ</TableCell>
                        <TableCell>Adresse d'Arrivée</TableCell>
                        <TableCell>Heure de Départ</TableCell>
                        <TableCell>Aller/Retour</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reservations.map(reservation => (
                        <TableRow key={reservation.idReservation}>
                            <TableCell>{reservation.AdresseDepart}</TableCell>
                            <TableCell>{reservation.AdresseArrive}</TableCell>
                            <TableCell>{formatDate(reservation.HeureDepart)}</TableCell>
                            <TableCell>{reservation.AllerRetour ? 'Oui' : 'Non'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </div>
     );
}

export default Courses;