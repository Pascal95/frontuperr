import React, { useState } from 'react';
import { Box } from '@mui/system';
import Input from '@mui/material/Input';
import AccountCircle from '@mui/icons-material/AccountCircle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';

function ChampsLogin(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    }

    const handleSubmit = async () => {
        try {
            const response = await fetch("https://backupper.onrender.com/api/users/login", {
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
        }
    };

    return (
        <Box sx={{
            backgroundColor: "#F5F5F5",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '400px', 
            margin: 'auto',
            borderRadius: '7px',
            marginTop: '40%'
        }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
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
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
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
            </Box>
            <Link href="/Inscription">S'inscrire</Link>
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>Se connecter</Button>
            {error && <p>Erreur : {error}</p>} {/* Afficher les erreurs ici */}
        </Box>
    );
}

export default ChampsLogin;