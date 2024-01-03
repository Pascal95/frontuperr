import React, { useState, useRef, useEffect } from 'react';
import './Courses.css';
import moment from 'moment';
import 'moment/locale/fr';

function Courses( props ) {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            const url = "https://backupper.onrender.com/api/reservation/nextresa";
            const token = localStorage.getItem('token');
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
            <table className="Tableau">
                <thead className='TableauTitle'>
                    <tr>
                        <th>Adresse de Départ</th>
                        <th>Adresse d'Arrivée</th>
                        <th>Heure de Départ</th>
                        <th>Aller/Retour</th>
                    </tr>
                </thead>
                <tbody className='TableauBody'>
                    {reservations.map(reservation => (
                        <tr key={reservation.idReservation}>
                            <td>{reservation.AdresseDepart}</td>
                            <td>{reservation.AdresseArrive}</td>
                            <td>{formatDate(reservation.HeureDepart)}</td>
                            <td>{reservation.AllerRetour ? 'Oui' : 'Non'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
     );
}

export default Courses;