import React, { useState } from 'react';
import { Box } from '@mui/system';
import {Grid, Input, FormControl, InputLabel, InputAdornment, IconButton, Typography, Button, Link, CircularProgress, Backdrop, Snackbar, TextField } from '@mui/material';
import {AccountCircle, Visibility, VisibilityOff} from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';

function ChampsLogin(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [error, setError] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();

    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    }
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.erreur || 'Une erreur est survenue lors de la connexion');
            }
            localStorage.setItem('token', data.token);
            navigate('/Dashboard');
            console.log("Token: ", data.token); 

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ p: 5, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h5" component="h1" gutterBottom>
                    Connexion
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                    <FormControl variant="standard" sx={{ m: 1, width: '25ch' }}>
                    <InputLabel htmlFor="input-with-icon-adornment">
                        Email
                    </InputLabel>
                    <Input
                    id="input-with-icon-adornment"
                    value={email}
                    onChange={handleEmailChange}
                    startAdornment={
                        <InputAdornment position="start">
                        <AccountCircle />
                        </InputAdornment>
                    }
                    />
                </FormControl>
                    </Grid>
                </Grid>

                <Grid item xs={12}>                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-password">Mot de passe</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={handlePasswordChange}
                        startAdornment={
                            <InputAdornment position="start">
                                <LockIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            </InputAdornment>
                        }
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        }
                    />
                </FormControl>
                </Grid>
                <Grid item xs={12}>
            <Link href="/Inscription">S'inscrire</Link>
            </Grid>
            <Grid item xs={12}>
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>Se connecter</Button>
            </Grid>
            <Backdrop 
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {error && <p>Erreur : {error}</p>} {/* Afficher les erreurs ici */}
        </Box>
    );
}

export default ChampsLogin;