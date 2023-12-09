import React from 'react';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';

function InscriptionTaxiVehicule(props) {
    return (
        <Box component="form" >
            <Typography variant="h3" gutterBottom>
                Information sur le véhicule
            </Typography>
            <Box sx={{paddingBottom:"10px"}}><TextField id="standard-basic" label="Marque du véhicule" variant="standard" /></Box>
            <Box sx={{paddingBottom:"10px"}}><TextField id="standard-basic" label="Modele du véhicule" variant="standard" /></Box>
            <Box sx={{paddingBottom:"10px"}}><TextField id="standard-basic" label="Année" variant="standard" /></Box>
            <Box sx={{paddingBottom:"10px"}}><TextField id="standard-basic" label="Numero d'immatriculation'" variant="standard" /></Box>
            <Box sx={{paddingBottom:"10px"}}><TextField id="standard-basic" label="Numero de série" variant="standard" /></Box>
        </Box>
    );
}

export default InscriptionTaxiVehicule;