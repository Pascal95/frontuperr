import React from 'react';
import ChampsLogin from '../Components/ChampsLogin';
import { Box, Grid } from '@mui/material';
import exampleImage from '../image/taxi.jpg';

function Login(props) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <ChampsLogin />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            backgroundImage: `url(${exampleImage})`,
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

export default Login;