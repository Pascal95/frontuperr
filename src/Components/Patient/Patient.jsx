import React, { useState, useEffect } from 'react';
import './Patient.css';
import { TextField, Button, FormControlLabel, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TableContainer} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';


function Patient(props) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editPatientData, setEditPatientData] = useState(null);
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

    const handleOpenEditDialog = (patient) => {
        setEditPatientData(patient);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditPatientData(null); // Réinitialiser les données de l'utilisateur en cours de modification
    };
    const handleSubmitEdit = async () => {
        // Assurez-vous que toutes les données nécessaires sont présentes
        if (!editPatientData || !editPatientData.idFiche) {
            console.error("Données du patient manquantes pour la mise à jour.");
            return;
        }
    
        const url = `${apiUrl}/api/users/ficheuser/${editPatientData.idFiche}`;
        const dataToSend = {
            nom: editPatientData.nom,
            prenom: editPatientData.prenom,
            adresse: editPatientData.adresse,
            ville: editPatientData.ville,
            codepostal: editPatientData.codepostal,
            mailcontact: editPatientData.mailcontact,
            telephone: editPatientData.telephone,
            numSS: editPatientData.numSS,
            // Ajoutez ici les autres champs si nécessaire
        };
    
        try {
            const response = await fetch(url, {
                method: 'PUT', // Utilisation de la méthode HTTP PUT pour la mise à jour
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Assurez-vous que le token est inclus si nécessaire
                },
                body: JSON.stringify(dataToSend)
            });
    
            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour du patient");
            }
    
            const result = await response.json();
            console.log("Mise à jour réussie :", result);
            setOpenDialog(false); // Ferme le dialogue après la mise à jour réussie
            fetchPatients(); // Recharge la liste des patients pour refléter les modifications
            setSnackbar({ open: true, message: 'Patient mis à jour avec succès.', severity: 'success' });
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
            setSnackbar({ open: true, message: error.message, severity: 'error' });
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
                            <TableCell>Modifier</TableCell>
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
                                <TableCell>
                                    <IconButton onClick={() => handleOpenEditDialog(patient)}>
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Modifier Patient</DialogTitle>
                <DialogContent>
                    <DialogContent>
        <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nom"
            type="text"
            fullWidth
            variant="standard"
            name="nom"
            value={editPatientData?.nom || ''}
            onChange={(e) => setEditPatientData({ ...editPatientData, nom: e.target.value })}
        />
        <TextField
            margin="dense"
            id="prenom"
            label="Prénom"
            type="text"
            fullWidth
            variant="standard"
            name="prenom"
            value={editPatientData?.prenom || ''}
            onChange={(e) => setEditPatientData({ ...editPatientData, prenom: e.target.value })}
        />
        <TextField
            margin="dense"
            id="adresse"
            label="Adresse"
            type="text"
            fullWidth
            variant="standard"
            name="adresse"
            value={editPatientData?.adresse || ''}
            onChange={(e) => setEditPatientData({ ...editPatientData, adresse: e.target.value })}
        /> 
                <TextField
            margin="dense"
            id="ville"
            label="Ville"
            type="text"
            fullWidth
            variant="standard"
            name="ville"
            value={editPatientData?.ville || ''}
            onChange={(e) => setEditPatientData({ ...editPatientData, ville: e.target.value })}
        />
                <TextField
            margin="dense"
            id="codepostal"
            label="Code postal"
            type="text"
            fullWidth
            variant="standard"
            name="codepostal"
            value={editPatientData?.codepostal || ''}
            onChange={(e) => setEditPatientData({ ...editPatientData, codepostal: e.target.value })}
        />
                <TextField
            margin="dense"
            id="mailcontact"
            label="Mail de contact"
            type="text"
            fullWidth
            variant="standard"
            name="mailcontact"
            value={editPatientData?.mailcontact || ''}
            onChange={(e) => setEditPatientData({ ...editPatientData, mailcontact: e.target.value })}
        />
                <TextField
            margin="dense"
            id="telephone"
            label="Téléphone"
            type="text"
            fullWidth
            variant="standard"
            name="telephone"
            value={editPatientData?.telephone || ''}
            onChange={(e) => setEditPatientData({ ...editPatientData, telephone: e.target.value })}
        />
        {/* Répétez le processus pour les autres champs */}
    </DialogContent>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleSubmitEdit} color="primary">
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default Patient;