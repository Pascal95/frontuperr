import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
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

    // Vérifier que numPermis est un entier
    if (!/^\d+$/.test(props.data.numPermis)) {
        erreursTemp.push('Le numéro de permis doit contenir uniquement des chiffres.');
    }

    // Vérifier que les dates ne sont pas vides et que la date d'expiration est valide
    if (!props.data.dateDel) {
        erreursTemp.push('La date de délivrance ne peut pas être vide.');
    }
    if (!props.data.dateExpi) {
        erreursTemp.push('La date d\'expiration ne peut pas être vide.');
    } else if (new Date(props.data.dateExpi) <= dateActuelle) {
        erreursTemp.push('La date d\'expiration doit être supérieure à la date actuelle.');
    }

    setErreurs(erreursTemp);

    // Si tout est valide, aller à l'étape suivante
    if (erreursTemp.length === 0) {
        props.allerAEtapeSuivante();
    }
    };


    return (
        <Box component="form" >
            <Typography variant="h3" gutterBottom>
                Information sur le permis
            </Typography>
            <Box sx={{paddingBottom:"10px"}}>
                <TextField 
                    id="standard-basic" 
                    name="numPermis"
                    label="Numero de permis" 
                    variant="standard" 
                    
                    onChange={props.onInputChange}
                    value={props.data.numPermis}
                />
                
            </Box>
            <Box sx={{paddingBottom:"10px"}}>
            <label>Date de délivrance</label>
            <input type="date" name="dateDel" value={props.data.dateDel} onChange={props.onInputChange} />

            </Box>
            <Box sx={{paddingBottom:"10px"}}>
                <label>Date d'expiration</label>
                <input type="date" name="dateExpi" value={props.data.dateExpi} onChange={props.onInputChange} />
            </Box>
            <Box sx={{paddingBottom:"10px"}}>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                    Scan permis
                    <VisuallyHiddenInput name="permis" type="file" onChange={props.onFileChangePermis}/>
                </Button>
            </Box>

            {erreurs.length > 0 && (
                <Box sx={{ color: 'error.main' }}>
                    {erreurs.map((erreur, index) => (
                        <Typography key={index} color="error">{erreur}</Typography>
                    ))}
                </Box>
            )}

            <Button variant="contained" onClick={validerFormulaire} endIcon={<SendIcon />}>
                Suivant
            </Button>

        </Box>
    );
}

export default InscriptionTaxiPermis;