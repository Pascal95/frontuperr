import React, { useState, useEffect } from 'react';
import './AjoutFichier.css';
import { Button, TextField, Snackbar, Alert, CircularProgress, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AjoutFichier() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [taxis, setTaxis] = useState([]);
    const [selectedTaxi, setSelectedTaxi] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleIdFicheChange = (event) => {
        setIdFiche(event.target.value);
    };


    const fetchUtilisateurs = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/users/listeusers`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            if (response.status === 401 || response.status === 403) {
                // Token is invalid or expired
                localStorage.removeItem('token');
                navigate('/');  // Redirect to login page
                throw new Error('Token is invalid or expired');
            }

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données');
            }

            const data = await response.json();
            // Filtrer les utilisateurs ayant le rôle de taxi (rôle = 3)
            const taxis = data.listeUser.filter(user => user.role === 3);
            setTaxis(taxis);
        } catch (error) {
            console.error('Erreur:', error);
            setSnackbarMessage('Erreur lors de la récupération des données');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUtilisateurs();
    }, []);

    const handleTaxiChange = (event) => {
        setSelectedTaxi(event.target.value);
        console.log('Taxi sélectionné:', event.target.value)
    };

    const handleSubmit = async () => {
        if (!file || !selectedTaxi) {
            setSnackbarMessage('Veuillez sélectionner un fichier et un taxi.');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            return;
        }

        setIsLoading(true);

        try {
            // Step 1: Get the user's key
            const keyResponse = await fetch(`${apiUrl}/api/users/key/${selectedTaxi}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!keyResponse.ok) {
                throw new Error('Erreur lors de la récupération de la clé utilisateur');
            }

            const keyData = await keyResponse.json();
            const userKey = keyData.key;

            // Step 2: Upload the file using the user's key
            const formData = new FormData();
            formData.append('superviseurFile', file);
            formData.append('key', userKey);

            const uploadResponse = await fetch(`${apiUrl}/api/users/superviseur/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!uploadResponse.ok) {
                throw new Error('Une erreur est survenue lors de l\'upload du fichier');
            }

            setSnackbarMessage('Fichier ajouté avec succès');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Erreur lors de l\'upload du fichier:', error);
            setSnackbarMessage('Erreur lors de l\'upload du fichier');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <div className='AjoutFichier'>
            <h2 className='AjoutFichier__title'>Ajouter un fichier</h2>
            {isLoading ? (
                <CircularProgress />
            ) : (
                <FormControl fullWidth>
                    <InputLabel id="select-taxi-label">Sélectionner un Taxi</InputLabel>
                    <Select
                        labelId="select-taxi-label"
                        id="select-taxi"
                        value={selectedTaxi}
                        label="Sélectionner un Taxi"
                        onChange={handleTaxiChange}
                    >
                        {taxis.map(taxi => (
                            <MenuItem key={taxi.idFiche} value={taxi.idFiche}>
                                {taxi.nom} {taxi.prenom}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Button variant="contained" component="label" sx={{ marginTop: '20px' }}>
                Sélectionner un fichier
                <input type="file" name="fichier" hidden onChange={handleFileChange} />
            </Button>
            {file && <Typography variant="body2">{file.name}</Typography>}
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isLoading}
                sx={{ marginTop: '20px' }}
            >
                {isLoading ? <CircularProgress size={24} /> : 'Uploader'}
            </Button>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default AjoutFichier;