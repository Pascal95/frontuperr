import React, { useState, useEffect } from 'react';
import './CreerUtilisateur.css';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, CircularProgress, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';


function CreerUtilisateur(props) {
    const [email, setEmail] = useState('');
    const [idFicheSelected, setIdFicheSelected] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [patients, setPatients] = useState([]);
    const [taxis, setTaxis] = useState([]);
    const [products, setProducts] = useState([]); // Nouvel état pour les produits
    const [productSelected, setProductSelected] = useState(''); // État pour le produit sélectionné
    const [productInfo, setProductInfo] = useState(null); // Nouvel état pour les informations du produit
    const [priceInfo, setPriceInfo] = useState(null); // Nouvel état pour les informations du prix
    const navigate = useNavigate();
    

    // Validation de l'email
    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    // Gestion des changements dans le champ email
    const handleChangeMail = (event) => {
        const newEmail = event.target.value;
        setEmail(newEmail);
        if (!isValidEmail(newEmail)) {
            setError('Adresse email non valide.');
        } else {
            setError('');
        }
    };

    const handleChangeUser = async (event) => {
        const selectedValue = event.target.value;
        setIdFicheSelected(selectedValue);
    
        if (selectedValue === '0') { // Si "Indépendant" est sélectionné
            try {
                setIsLoading(true);
                const response = await fetch(`${apiUrl}/api/products`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                if (response.status === 401 || response.status === 403) {
                    // Token is invalid or expired
                    localStorage.removeItem('token');
                    navigate('/');  // Redirect to login page
                    throw new Error('Token is invalid or expired');
                }

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des produits');
                }
    
                const data = await response.json();
                setProducts(data.data); // Assurez-vous que cette ligne correspond à la structure de votre réponse API
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setProducts([]); // Réinitialise les produits si une autre option est sélectionnée
        }
    };
    
    const handleChangeProduct = (event) => {
        setProductSelected(event.target.value);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };


    // Fonction pour envoyer l'email à l'API
    const handleSubmit = async () => {
        if (!isValidEmail(email)) {
            setError('Adresse email non valide.');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${apiUrl}/api/users/createtaxi`, {  // Remplacez 'API_ENDPOINT' par votre endpoint
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email,idFicheSelected, productSelected })
            });

            if (response.status === 401 || response.status === 403) {
                // Token is invalid or expired
                localStorage.removeItem('token');
                navigate('/');  // Redirect to login page
                throw new Error('Token is invalid or expired');
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Échec de la demande');
            }

            const data = await response.json();
            console.log('Réponse de l\'API:', data);
            setSnackbarMessage('Utilisateur créé avec succès');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            // Traitez la réponse ici
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
            const errorMessage = error.message || "Une erreur est survenue lors de l'envoi de l'email";
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchTaxis = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${apiUrl}/api/users/taxis`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });

                if (response.status === 401 || response.status === 403) {
                    // Token is invalid or expired
                    localStorage.removeItem('token');
                    navigate('/');  // Redirect to login page
                    throw new Error('Token is invalid or expired');
                }

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des données');
                }

                const data = await response.json();
                setTaxis(data.taxis);
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTaxis();
    }, [apiUrl]);

    return (
        <div className="CreerUtilisateur">
            <h2 className="CreerUtilisateur__title">Créer un utilisateur</h2>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Taxi</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="idFicheUser"
                    value={idFicheSelected}
                    label="Taxi"
                    onChange={handleChangeUser}
                >
                    <MenuItem value="0">Indépendant</MenuItem>
                    {taxis.map((taxi) => (
                        <MenuItem key={taxi.idFiche} value={taxi.idFiche}>{taxi.nom} {taxi.prenom}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            { idFicheSelected === '0' && (
                <FormControl fullWidth margin="normal">
                    <InputLabel id="product-select-label">Produit</InputLabel>
                    <Select
                        labelId="product-select-label"
                        id="product-select"
                        value={productSelected}
                        onChange={handleChangeProduct}
                        label="Produit"
                    >
                        {products.map((product) => (
                            <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            <TextField
                label="Adresse Email"
                variant="outlined"
                value={email}
                onChange={handleChangeMail}
                error={!!error}
                helperText={error}
                fullWidth
                margin="normal"
            />
            <Button 
                variant="contained" 
                onClick={handleSubmit}
                disabled={!!error || !email}
                style={{ marginTop: '20px' }}
            >
                {isLoading ? <CircularProgress size={24} /> : 'Envoyer'}
            </Button>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default CreerUtilisateur;
