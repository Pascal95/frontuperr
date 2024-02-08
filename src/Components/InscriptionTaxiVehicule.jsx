import React, { useState } from 'react';
import {TextField, Typography, Button, styled, Grid} from '@mui/material';
import { Box } from '@mui/system';
import SendIcon from '@mui/icons-material/Send';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/fr';

function InscriptionTaxiVehicule(props) {
    
    const [erreurs, setErreurs] = useState([]);
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const validerFormulaire = () => {
        let erreursTemp = [];

        // Validation des champs
        if (!props.data.Marque.trim()) erreursTemp.push('La marque du véhicule ne peut pas être vide.');
        if (!props.data.Modele.trim()) erreursTemp.push('Le modèle du véhicule ne peut pas être vide.');
        if (!/^\d{4}$/.test(props.data.Annee)) erreursTemp.push('L\'année doit contenir 4 chiffres.');
        if (!props.data.numImmatriculation.trim()) erreursTemp.push('Le numéro d\'immatriculation ne peut pas être vide.');
        if (!/^.{17}$/.test(props.data.numSerie)) erreursTemp.push('Le numéro de série doit contenir exactement 17 caractères.');

        setErreurs(erreursTemp);

        // Si tout est valide, aller à l'étape suivante
        if (erreursTemp.length === 0) {
            props.allerAEtapeSuivante();
        }
    };
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} locale="fr">
            <Box 
                sx={{ 
                    p: 3, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 2,
                    bgcolor: 'background.paper', 
                    borderRadius: 2,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Typography variant="h5" component="h1" gutterBottom>
                        Information sur le véhicule
                </Typography>
                <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField 
                        label="Marque du véhicule" 
                        name="Marque"
                        fullWidth
                        variant="outlined"
                        onChange={props.onInputChange}
                        value={props.data.Marque} 
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        label="Modele du véhicule" 
                        name="Modele"
                        fullWidth
                        variant="outlined"
                        onChange={props.onInputChange}
                        value={props.data.Modele} 
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        label="Année" 
                        name="Annee"
                        fullWidth
                        variant="outlined"
                        onChange={props.onInputChange}
                        value={props.data.Annee} 
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        label="Numero d'immatriculation" 
                        name="numImmatriculation"
                        fullWidth
                        variant="outlined"
                        onChange={props.onInputChange}
                        value={props.data.numImmatriculation} 
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        label="Numero de série" 
                        name="numSerie"
                        fullWidth
                        variant="outlined"
                        onChange={props.onInputChange}
                        value={props.data.numSerie} 
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                        Scan carte grise
                        <input hidden type="file" name="carteGrise" onChange={props.onFileChangeVehicule} />
                    </Button>
                    {props.nomFichierVehicule && ( // Utilisez la prop pour afficher le nom du fichier
                            <Typography variant="body2" sx={{ marginTop: 2 }}>
                                Fichier sélectionné : {props.nomFichierVehicule}
                            </Typography>
                        )}
                </Grid>
                {erreurs.length > 0 && (
                    <Grid item xs={12}>
                        {erreurs.map((erreur, index) => (
                            <Typography key={index} color="error">{erreur}</Typography>
                        ))}
                    </Grid>
                )}
                <Grid item xs={12} container justifyContent="center">
                    <Button variant="contained" onClick={validerFormulaire} endIcon={<SendIcon />}>
                        Valider
                    </Button>
                </Grid>
                </Grid>
            </Box>
        </LocalizationProvider>
    );
}

export default InscriptionTaxiVehicule;