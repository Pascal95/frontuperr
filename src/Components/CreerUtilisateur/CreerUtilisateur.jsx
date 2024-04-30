import React, { useState } from 'react';
import './CreerUtilisateur.css';
import { TextField, Button } from '@mui/material';


function CreerUtilisateur(props) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');

    // Validation de l'email
    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    // Gestion des changements dans le champ email
    const handleChange = (event) => {
        const newEmail = event.target.value;
        setEmail(newEmail);
        if (!isValidEmail(newEmail)) {
            setError('Adresse email non valide.');
        } else {
            setError('');
        }
    };

    // Fonction pour envoyer l'email à l'API
    const handleSubmit = async () => {
        if (!isValidEmail(email)) {
            setError('Adresse email non valide.');
            return;
        }

        setError('');
        try {
            const response = await fetch(`${apiUrl}/api/users/createtaxi`, {  // Remplacez 'API_ENDPOINT' par votre endpoint
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error('Échec de la demande');
            }

            const data = await response.json();
            console.log('Réponse de l\'API:', data);
            // Traitez la réponse ici
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
        }
    };

    return (
        <div className="CreerUtilisateur">
            <h2 className="CreerUtilisateur__title">Créer un utilisateur</h2>
            <TextField
                label="Adresse Email"
                variant="outlined"
                value={email}
                onChange={handleChange}
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
                Envoyer
            </Button>
        </div>
    );
}

export default CreerUtilisateur;
