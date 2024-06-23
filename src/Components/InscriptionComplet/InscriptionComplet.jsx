import React, { useState, useEffect } from 'react';
import { Box, Grid, List, ListItem, ListItemText, Typography, Paper, TextField, Button, styled } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import './InscriptionComplet.css';

function InscriptionComplet(props) {
    const [selectedSection, setSelectedSection] = useState('identite');
    const [permisFile, setPermisFile] = useState(null);
    const [vehiculeFile, setVehiculeFile] = useState(null);
    const navigate = useNavigate();

    // Exemple de données, à remplacer par vos données dynamiques
    const sections = {
        identite: {
            nom: '',
            prenom: '',
            adresse: '',
            ville: '',
            codepostal: '',
            mailcontact: '',
            telephone: '',
        },
        permis: {
            numPermis: '',
            dateDel: '',
            dateExpi: '',
        },
        vehicule: {
            Marque: '',
            Modele: '',
            Annee: '',
            numImmatriculation: '',
        },
    };
    const Input = styled('input')({
        display: 'none',
    });

    const handleListItemClick = (sectionName) => {
        setSelectedSection(sectionName);
    };

    const handleFileChange = (e, setFileFunc) => {
        const file = e.target.files[0];
        if (file) {
            setFileFunc(file);
        }
    };

    const renderDetailFields = (section) => {
        const fields = Object.entries(sections[section]).map(([key, value]) => (
            <TextField
                key={key}
                label={key}
                variant="outlined"
                fullWidth
                margin="normal"
                value={value}
                onChange={(e) => console.log(e.target.value)} // Remplacer par votre gestion des changements
            />
        ));

        if (section === 'permis' || section === 'vehicule') {
            fields.push(
                <Box key="file-upload" sx={{ mt: 2 }}>
                    <Typography variant="body1">{section === 'permis' ? 'Scan du permis:' : 'Carte Grise:'}</Typography>
                    <label htmlFor={`contained-button-file-${section}`}>
                        <Input accept="image/*" id={`contained-button-file-${section}`} multiple type="file" onChange={(e) => handleFileChange(e, section === 'permis' ? setPermisFile : setVehiculeFile)} />
                        <Button variant="contained" component="span">
                            Upload
                        </Button>
                    </label>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        {section === 'permis' && permisFile ? permisFile.name : vehiculeFile ? vehiculeFile.name : 'Aucun fichier sélectionné'}
                    </Typography>
                </Box>
            );
        }

        return fields;
    };

    return (
<div className="InscriptionComplet">
            <Typography variant="h4" gutterBottom color="white">Inscription à compléter</Typography>
            <Box sx={{ flexGrow: 1, overflow: 'hidden', p: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Paper elevation={3}>
                            <List component="nav">
                                <ListItem
                                    button
                                    selected={selectedSection === 'identite'}
                                    onClick={() => handleListItemClick('identite')}
                                >
                                    <ListItemText primary="Informations d'identité" />
                                </ListItem>
                                <ListItem
                                    button
                                    selected={selectedSection === 'permis'}
                                    onClick={() => handleListItemClick('permis')}
                                >
                                    <ListItemText primary="Permis" />
                                </ListItem>
                                <ListItem
                                    button
                                    selected={selectedSection === 'vehicule'}
                                    onClick={() => handleListItemClick('vehicule')}
                                >
                                    <ListItemText primary="Véhicule" />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={8}>
                    <Paper elevation={3} sx={{paddingLeft:"10px", paddingRight:"10px"}}>
                        <Box component="form" noValidate autoComplete="off">
                            {renderDetailFields(selectedSection)}
                            <Button variant="contained" color="primary" sx={{ mt: 3 }}>
                                Enregistrer
                            </Button>
                        </Box>
                    </Paper>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

export default InscriptionComplet;