import React, { useState, useEffect } from 'react';
import "./EnvoiMessage.css";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, CircularProgress, Snackbar, Alert } from '@mui/material';


function EnvoiMessage(props) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        idFiche: '',
        objet: '',
        contenu: '',
    });

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${apiUrl}/api/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l’envoi du message');
            }

            setSnackbar({ open: true, message: 'Message envoyé avec succès!', severity: 'success' });
            // Réinitialiser le formulaire après l'envoi réussi
            setFormData({
                idFiche: '',
                objet: '',
                message: '',
            });
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: error.message, severity: 'error' });
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        const fetchPatients = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${apiUrl}/api/users/mesusers`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
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



    return (
        <div className='EnvoiMessage'>
            <h2 className="EnvoiMessage__title">Message</h2>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Patient</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="idFiche"
                        value={formData.idFiche}
                        label="Patient"
                        onChange={handleInputChange}
                    >
                        {patients.map((patient) => (
                            <MenuItem value={patient.idFiche}>{patient.nom} {patient.prenom}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                        label="Objet"
                        name="objet"
                        value={formData.objet}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Message"
                        name="contenu"
                        value={formData.contenu}
                        onChange={handleInputChange}
                        multiline
                        rows={4}
                        fullWidth
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                        Envoyer
                    </Button>

            </form>
        </div>
    );
}

export default EnvoiMessage;