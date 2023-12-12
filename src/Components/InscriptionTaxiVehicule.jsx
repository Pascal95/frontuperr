import React from 'react';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

function InscriptionTaxiVehicule(props) {
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
            <Button variant="contained" onClick={props.allerAEtapeSuivante} endIcon={<SendIcon />}>
                Valider
            </Button>
        </Box>
    );
}

export default InscriptionTaxiVehicule;