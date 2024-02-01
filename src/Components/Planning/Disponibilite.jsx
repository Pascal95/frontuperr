import React, {useState, useEffect} from 'react';
import './Disponibilite.css';
import { Button, TextField, MenuItem, Grid, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';

function Disponibilite(props) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    const jours = [
        { id: 1, nom: "Lundi" },
        { id: 2, nom: "Mardi" },
        { id: 3, nom: "Mercredi" },
        { id: 4, nom: "Jeudi" },
        { id: 5, nom: "Vendredi" },
        { id: 6, nom: "Samedi" },
        { id: 7, nom: "Dimanche" }
    ];

    const [disponibilite, setDisponibilite] = useState({
        idJour: '',
        HeureDebutMatin: '',
        HeureFinMatin: '',
        HeureDebutApresMidi: '',
        HeureFinApresMidi: ''
    });

    const [disponibilites, setDisponibilites] = useState([]);


    const handleChange = (event) => {
        const { name, value } = event.target;
        setDisponibilite({ ...disponibilite, [name]: value });
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Récupération du token de l'utilisateur

        const apiUrl = import.meta.env.VITE_API_URL;
        // Préparation des en-têtes de la requête
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);
    
        // Préparation du corps de la requête
        const body = JSON.stringify(disponibilite);
    
        try {
            // Envoi de la requête à l'API
            const response = await fetch(`${apiUrl}/api/taxi/disponibilite`, {
                method: 'POST',
                headers: headers,
                body: body
            });
    
            if (!response.ok) {
                throw new Error('Erreur lors de la soumission des disponibilités');
            }
    
            // Traitement de la réponse de l'API
            const data = await response.json();
            console.log('Disponibilité ajoutée avec succès:', data);
    
            // Réinitialisation du formulaire après succès
            setDisponibilite({
                idJour: '',
                HeureDebutMatin: '',
                HeureFinMatin: '',
                HeureDebutApresMidi: '',
                HeureFinApresMidi: ''
            });
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la disponibilité:', error);
            // Ici, vous pouvez gérer l'affichage des messages d'erreur à l'utilisateur
        }
    };

    useEffect(() => {
        const fetchDisponibilites = async () => {
            const response = await fetch(`${apiUrl}/api/disponibilites/taxi`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setDisponibilites(data); // Stockez les disponibilités dans l'état
            } else {
                // Gérez l'erreur (par exemple, en affichant un message)
                console.error('Erreur lors de la récupération des disponibilités');
            }
        };
    
        fetchDisponibilites();
    }, []);
    

    return (
        <div className='Disponibilite'>
            <form onSubmit={handleSubmit}>
            <h2 className="Disponibilite__title">Ajouter un bon de transport</h2>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        select
                        fullWidth
                        label="Jour"
                        name="idJour"
                        value={disponibilite.idJour}
                        onChange={handleChange}
                    >
                        {jours.map((jour) => (
                            <MenuItem key={jour.id} value={jour.id}>
                                {jour.nom}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Début Matin"
                        type="time"
                        name="HeureDebutMatin"
                        value={disponibilite.HeureDebutMatin}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Fin Matin"
                        type="time"
                        name="HeureFinMatin"
                        value={disponibilite.HeureFinMatin}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Début Après-midi"
                        type="time"
                        name="HeureDebutApresMidi"
                        value={disponibilite.HeureDebutApresMidi}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Fin Après-midi"
                        type="time"
                        name="HeureFinApresMidi"
                        value={disponibilite.HeureFinApresMidi}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                        Ajouter Disponibilité
                    </Button>
                </Grid>
            </Grid>
        </form>
        <Paper>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Jour</TableCell>
                        <TableCell>Début Matin</TableCell>
                        <TableCell>Fin Matin</TableCell>
                        <TableCell>Début Après-Midi</TableCell>
                        <TableCell>Fin Après-Midi</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {disponibilites.map((dispo) => (
                        <TableRow key={dispo.idDisponibilite}>
                            <TableCell>{dispo.Jour.nomJour}</TableCell> {/* Assurez-vous que l'API renvoie le nom du jour */}
                            <TableCell>{dispo.HeureDebutMatin}</TableCell>
                            <TableCell>{dispo.HeureFinMatin}</TableCell>
                            <TableCell>{dispo.HeureDebutApresMidi}</TableCell>
                            <TableCell>{dispo.HeureFinApresMidi}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
        </div>
    );
}

export default Disponibilite;