import React, { useState } from 'react';
import {TextField, Typography, styled, Button, Stack, Grid} from '@mui/material';
import { Box } from '@mui/system';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/fr';
import SendIcon from '@mui/icons-material/Send';

function InscriptionTaxiPermis(props) {
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
        const dateActuelle = new Date();

        if (!/^\d+$/.test(props.data.numPermis)) {
            erreursTemp.push('Le numéro de permis doit contenir uniquement des chiffres.');
        }

        if (!props.data.dateDel) {
            erreursTemp.push('La date de délivrance ne peut pas être vide.');
        }
        if (!props.data.dateExpi) {
            erreursTemp.push('La date d\'expiration ne peut pas être vide.');
        } else if (new Date(props.data.dateExpi) <= dateActuelle) {
            erreursTemp.push('La date d\'expiration doit être supérieure à la date actuelle.');
        }

        setErreurs(erreursTemp);

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
                    Information sur le permis
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            name="numPermis"
                            label="Numéro de permis"
                            variant="outlined"
                            fullWidth
                            onChange={props.onInputChange}
                            value={props.data.numPermis}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <DatePicker
                            label="Date de délivrance"
                            value={props.data.dateDel}
                            onChange={(newValue) => props.onInputChange({ target: { name: 'dateDel', value: newValue } })}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <DatePicker
                            label="Date d'expiration"
                            value={props.data.dateExpi}
                            onChange={(newValue) => props.onInputChange({ target: { name: 'dateExpi', value: newValue } })}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
                            Scan permis
                            <input hidden type="file" name="permis" onChange={props.onFileChangePermis} />
                        </Button>
                        {props.nomFichierPermis && ( // Utilisez la prop pour afficher le nom du fichier
                            <Typography variant="body2" sx={{ marginTop: 2 }}>
                                Fichier sélectionné : {props.nomFichierPermis}
                            </Typography>
                        )}
                    </Grid>
                    <Stack spacing={1}>
                        {erreurs.map((erreur, index) => (
                            <Typography key={index} color="error">{erreur}</Typography>
                        ))}
                    </Stack>
                    <Grid item xs={12} container justifyContent="center">
                        <Button variant="contained" onClick={validerFormulaire} endIcon={<SendIcon />}>
                            Suivant
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </LocalizationProvider>
    );

}

export default InscriptionTaxiPermis;