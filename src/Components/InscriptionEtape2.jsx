import React, { useState } from 'react';
import { Grid, InputLabel, MenuItem, FormControl, Select, TextField, Typography, Button } from '@mui/material';
import { Box } from '@mui/system';
import SendIcon from '@mui/icons-material/Send';

import { ThemeProvider, createTheme } from '@mui/material/styles';

function InscriptionEtape2(props) {
    const [erreurs, setErreurs] = useState([]);

    const validerFormulaire = () => {
        let erreursTemp = [];

        // Validation des champs
        if (!props.data.nom.trim()) erreursTemp.push('Le nom ne peut pas être vide.');
        if (!props.data.prenom.trim()) erreursTemp.push('Le prénom ne peut pas être vide.');
        if (!props.data.ville.trim()) erreursTemp.push('La ville ne peut pas être vide.');
        if (!props.data.adresse.trim()) erreursTemp.push('L\'adresse ne peut pas être vide.');
        if (!/^\d{5}$/.test(props.data.codepostal)) erreursTemp.push('Le code postal doit contenir 5 chiffres.');
        if (!/^\S+@\S+\.\S+$/.test(props.data.mailcontact)) erreursTemp.push('L\'adresse mail n\'est pas valide.');
        if (!/^\d{10}$/.test(props.data.telephone)) erreursTemp.push('Le téléphone doit contenir 10 chiffres.');
        if (!props.data.role) erreursTemp.push('Le rôle ne peut pas être vide.');

        setErreurs(erreursTemp);

        // Si tout est valide, aller à l'étape suivante
        if (erreursTemp.length === 0) {
            props.allerAEtapeSuivante();
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
            padding: '20px',
            borderRadius: '7px',
            marginTop: '10%'
        }}>
            <Typography variant="h4" gutterBottom align="center">
                Information de l'utilisateur
            </Typography>
            <FormControl variant="standard" sx={{ m: 1, width: '25ch' }}>
                <TextField 
                    name="nom" 
                    label="Nom"   
                    fullWidth  
                    margin="normal"
                    onChange={props.onInputChange}
                    value={props.data.nom}  
                />
            </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, width: '25ch' }}>
                        <TextField 
                            name="prenom" 
                            label="Prenom"  
                            fullWidth  
                            margin="normal"
                            onChange={props.onInputChange}
                            value={props.data.prenom} 
                        />
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, width: '25ch' }}>
                        <TextField 
                            name="adresse" 
                            label="Adresse"  
                            fullWidth  
                            margin="normal"
                            onChange={props.onInputChange}
                            value={props.data.adresse} 
                        />
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, width: '25ch' }}>
                        <TextField 
                            name="ville" 
                            label="Ville"  
                            fullWidth  
                            margin="normal"
                            onChange={props.onInputChange}
                            value={props.data.ville} 
                        />
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, width: '25ch' }}>
                        <TextField 
                            name="codepostal" 
                            label="Code postal"  
                            fullWidth  
                            margin="normal"
                            onChange={props.onInputChange}
                            value={props.data.codepostal}  
                        />
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, width: '25ch' }}>
                        <TextField 
                            name="mailcontact" 
                            label="Mail de contact"  
                            fullWidth  
                            margin="normal"
                            type='email'
                            onChange={props.onInputChange}
                            value={props.data.mailcontact}  
                        />
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, width: '25ch' }}>
                        <TextField 
                            name="telephone" 
                            label="Telephone"  
                            fullWidth  
                            margin="normal"
                            onChange={props.onInputChange}
                            value={props.data.telephone} 
                        />
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, width: '25ch' }}>
                        <TextField 
                            name="numSS" 
                            label="Numéro de sécurité sociale"  
                            fullWidth  
                            margin="normal"
                            onChange={props.onInputChange}
                            value={props.data.numSS} 
                        />
                    </FormControl>

                    {erreurs.length > 0 && (
                        <Grid item xs={12}>
                            <Box sx={{ color: 'error.main' }}>
                                {erreurs.map((erreur, index) => (
                                    <Typography key={index} color="error">{erreur}</Typography>
                                ))}
                            </Box>
                        </Grid>
                    )}
                    <Grid item xs={12} container justifyContent="center">
                        <Button 
                            variant="contained" 
                            onClick={validerFormulaire} 
                            endIcon={<SendIcon />} 
                            sx={{ mt: 2 }}
                        >
                            Suivant
                        </Button>
                    </Grid>
        </Box>
    );
}

export default InscriptionEtape2;
