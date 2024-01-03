import React from 'react';
import { Box, Grid } from '@mui/material';
import exampleImage from '../image/taxi.jpg';
import InscriptionEtape1 from '../Components/InscriptionEtape1';
import VoitureMickael from '../assets/img/mercedes.jpeg';

function Inscription(props) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <InscriptionEtape1 />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            backgroundImage: `url(${VoitureMickael})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: '100vh', // ajustez selon vos besoins
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default Inscription;