import React, { useState, useEffect } from 'react';
import "./ListeUtilisateur.css";
import { Button, InputLabel, MenuItem, Select, CircularProgress, Snackbar, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

function ListeUtilisateur(props) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [role, setRole] = useState(5); // Par défaut, on sélectionne les Utilisateurs
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const fetchUtilisateurs = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/users/listeusers`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
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
            setUtilisateurs(data.listeUser);
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

    const handleChange = (event) => {
        setRole(event.target.value);
    };

    const handleOpenEditDialog = (user) => {
        // Logique pour ouvrir un dialogue de modification
        console.log('Ouvrir le dialogue pour modifier l\'utilisateur:', user);
    };

    // Filtrer les utilisateurs en fonction du rôle sélectionné
    const filteredUtilisateurs = utilisateurs.filter(user => user.role === role);

    return (
        <div className='ListeUtilisateur'>
            <h2 className="ListeUtilisateur__title">Liste des utilisateurs</h2>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={role}
                onChange={handleChange}
                style={{ marginBottom: '20px' }}
            >
                <MenuItem value={5}>Utilisateur</MenuItem>
                <MenuItem value={3}>Taxi</MenuItem>
            </Select>
            {isLoading ? (
                <CircularProgress />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nom</TableCell>
                                <TableCell>Prénom</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Téléphone</TableCell>
                                {role === 3 && (
                                    <>
                                        <TableCell>Marque</TableCell>
                                        <TableCell>Modèle</TableCell>
                                        <TableCell>Année</TableCell>
                                        <TableCell>Prise en Charge PMR</TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUtilisateurs.map((user) => (
                                <TableRow key={user.idFiche}>
                                    <TableCell>{user.nom}</TableCell>
                                    <TableCell>{user.prenom}</TableCell>
                                    <TableCell>{user.mailcontact}</TableCell>
                                    <TableCell>{user.telephone}</TableCell>
                                    {role === 3 && (
                                        <>
                                            <TableCell>{user.vehicule ? user.vehicule.Marque : 'Non renseigné'}</TableCell>
                                            <TableCell>{user.vehicule ? user.vehicule.Modele : 'Non renseigné'}</TableCell>
                                            <TableCell>{user.vehicule ? user.vehicule.Annee : 'Non renseigné'}</TableCell>
                                            <TableCell>{user.vehicule ? user.vehicule.pecPMR : 'Non renseigné'}</TableCell>
                                        </>
                                    )}

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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
        </div>
    );
}

export default ListeUtilisateur;