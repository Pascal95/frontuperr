import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

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
        <Box component="form" >
            <Typography variant="h3" gutterBottom>
                Information sur le véhicule
            </Typography>
            <Box sx={{paddingBottom:"10px"}}>
                <TextField 
                    id="standard-basic" 
                    label="Marque du véhicule" 
                    variant="standard" 
                    name="Marque"
                    onChange={props.onInputChange}
                    value={props.data.Marque} 
                />
            </Box>
            <Box sx={{paddingBottom:"10px"}}>
                <TextField 
                    id="standard-basic" 
                    label="Modele du véhicule" 
                    variant="standard" 
                    name="Modele"
                    onChange={props.onInputChange}
                    value={props.data.Modele} 
                />
            </Box>
            <Box sx={{paddingBottom:"10px"}}>
                <TextField 
                    id="standard-basic" 
                    label="Année" 
                    variant="standard" 
                    name="Annee"
                    onChange={props.onInputChange}
                    value={props.data.Annee} 
                />
            </Box>
            <Box sx={{paddingBottom:"10px"}}>
                <TextField 
                    id="standard-basic" 
                    label="Numero d'immatriculation'" 
                    variant="standard" 
                    name="numImmatriculation"
                    onChange={props.onInputChange}
                    value={props.data.numImmatriculation} 
                />
            </Box>
            <Box sx={{paddingBottom:"10px"}}>
                <TextField 
                    id="standard-basic" 
                    label="Numero de série" 
                    variant="standard" 
                    name="numSerie"
                    onChange={props.onInputChange}
                    value={props.data.numSerie} 
                />
            </Box>
            <Box sx={{paddingBottom:"10px"}}>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                    Scan permis
                    <VisuallyHiddenInput type="file" onChange={props.handleFileChangeVehicule}/>
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
                Valider
            </Button>
        </Box>
    );
}

export default InscriptionTaxiVehicule;