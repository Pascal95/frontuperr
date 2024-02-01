import React, { useState, useEffect } from 'react';
import './Patient.css';
import { TextField, Button, FormControlLabel, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress, TableContainer } from '@mui/material';



function Patient(props) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [patientData, setPatientData] = useState({
        nom: '',
        prenom: '',
        adresse: '',
        ville: '',
        codepostal: '',
        mailcontact: '',
        telephone: '',
        numSS: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPatientData({ ...patientData, [name]: value });
    };

    const handleCheckboxChange = (event) => {
        setPatientData({ ...patientData, valide: event.target.checked });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataToSend = {
            ...patientData,
            role: 6, // Patient role
            idCNX: 0, // Pas d'ID de connexion
            TransportDispo: 0, // Transport disponible initialisé à 0
            valide: true,
            signature: '',
        };

        try {
            const response = await fetch(`${apiUrl}/api/users/ficheuser`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' ,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend)
            });
            if (!response.ok) {
                throw new Error("Erreur lors de l'ajout du patient");
            }
            // Traitement en cas de succès
        } catch (error) {
            console.error(error.message);
            // Gérer l'erreur ici
        }
    };

    useEffect(() => {
        const fetchPatients = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${apiUrl}/api/users/mesusers`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des données');
                }

                const data = await response.json();
                setPatients(data.listeUser);
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatients();
    }, []);

    if (isLoading) {
        return <CircularProgress />;
    }
    return (
        <div className='Patient'>
            <h2 className="Patient__title">Mes patients</h2>
            <h2 className="Patient__title">Ajouter un patient</h2>
            <form onSubmit={handleSubmit}>
                {/* Les champs du formulaire */}
                <TextField label="Nom" name="nom" onChange={handleInputChange} fullWidth margin="normal" />
                <TextField label="Prénom" name="prenom" onChange={handleInputChange} fullWidth margin="normal" />
                <TextField label="Adresse" name="adresse" onChange={handleInputChange} fullWidth margin="normal" />
                <TextField label="Ville" name="ville" onChange={handleInputChange} fullWidth margin="normal" />
                <TextField label="Code Postal" name="codepostal" onChange={handleInputChange} fullWidth margin="normal" />
                <TextField label="Email" name="mailcontact" onChange={handleInputChange} fullWidth margin="normal" />
                <TextField label="Téléphone" name="telephone" onChange={handleInputChange} fullWidth margin="normal" />
                <TextField label="Numéro de Sécurité Sociale" name="numSS" onChange={handleInputChange} fullWidth margin="normal" />
                <Button type="submit" variant="contained" color="primary">Ajouter</Button>
            </form>
            <h2 className="Patient__title">Liste des patients</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nom</TableCell>
                            <TableCell>Prénom</TableCell>
                            <TableCell>Adresse</TableCell>
                            <TableCell>Ville</TableCell>
                            <TableCell>Code Postal</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Téléphone</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((patient) => (
                            <TableRow key={patient.idFiche}>
                                <TableCell>{patient.nom}</TableCell>
                                <TableCell>{patient.prenom}</TableCell>
                                <TableCell>{patient.adresse}</TableCell>
                                <TableCell>{patient.ville}</TableCell>
                                <TableCell>{patient.codepostal}</TableCell>
                                <TableCell>{patient.mailcontact}</TableCell>
                                <TableCell>{patient.telephone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Patient;