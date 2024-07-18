import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Box } from '@mui/system';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

function InscriptionEtape1(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();


    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);
    const handleConfirmPasswordChange = (event) => setConfirmPassword(event.target.value);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    };

    const handleInscription = async () => {
        let validationErrors = {};

        if (!validateEmail(email)) {
            validationErrors.email = "L'adresse email n'est pas valide.";
        }

        if (!validatePassword(password)) {
            validationErrors.password = "Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial.";
        }

        if (password !== confirmPassword) {
            validationErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
        }

        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            try {
                console.log(apiUrl)
                const response = await fetch(`${apiUrl}/api/users/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email, password: password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Une erreur est survenue lors de l'inscription");
                }

                // Gérer le succès de l'inscription ici
                console.log("Inscription réussie", data);
                // Redirection ou mise à jour de l'état de l'application
                setIsLoading(false);
                navigate('/');
            } catch (err) {
                console.log(err)
                const errorMessage = err.message || "Une erreur est survenue lors de l'inscription";
                setErrors({ api: errorMessage });
                setAlertMessage(errorMessage);
                setAlertOpen(true);
                setIsLoading(false);
            }
        }
    };
    const handleAlertClose = () => {
        setAlertOpen(false);
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
            padding: '20px',
            borderRadius: '7px',
            marginTop: '40%'
        }}>
            <Typography variant="h5" component="h1" gutterBottom>Inscription</Typography>
            <FormControl variant="standard" sx={{ m: 1, width: '25ch' }}>
                <InputLabel htmlFor="input-with-icon-adornment">
                    Email
                </InputLabel>
                <Input
                id="input-with-icon-adornment"
                value={email}
                onChange={handleEmailChange}
                />
            </FormControl>
            <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">Mot de passe</InputLabel>
                <Input
                    id="standard-adornment-password"
                    value={password}
                    onChange={handlePasswordChange}
                    type={showPassword ? 'text' : 'password'}
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
            <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">Confirmez le mot de passe</InputLabel>
                <Input
                    id="standard-adornment-password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    type={showPassword ? 'text' : 'password'}
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
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleInscription} disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} /> : 'Inscription'}
            </Button>
            {errors.email && <p>{errors.email}</p>}
            {errors.password && <p>{errors.password}</p>}
            {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
            {errors.api && <p>{errors.api}</p>}
            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity="error" sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default InscriptionEtape1;