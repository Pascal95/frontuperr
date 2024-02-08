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
            <Box sx={{ p: 5, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Information de l'utilisateur
                </Typography>
                <form autoComplete="off">
                    <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField 
                            name="nom" 
                            label="Nom"   
                            fullWidth  
                            margin="normal"
                            onChange={props.onInputChange}
                            value={props.data.nom}  
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            name="prenom" 
                            label="Prenom"  
                            fullWidth  
                            margin="normal"
                            onChange={props.onInputChange}
                            value={props.data.prenom} 
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            name="adresse" 
                            label="Adresse"  
                            fullWidth  
                            margin="normal"
                            onChange={props.onInputChange}
                            value={props.data.adresse} 
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            name="ville" 
                            label="Ville"  
                            fullWidth  
                            margin="normal"
                            onChange={props.onInputChange}
                            value={props.data.ville} 
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            name="codepostal" 
                            label="Code postal"  
                            fullWidth  
                            margin="normal"
                            onChange={props.onInputChange}
                            value={props.data.codepostal}  
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            name="mailcontact" 
                            label="Mail de contact"  
                            fullWidth  
                            margin="normal"
                            type='email'
                            onChange={props.onInputChange}
                            value={props.data.mailcontact}  
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            name="telephone" 
                            label="Telephone"  
                            fullWidth  
                            margin="normal"
                            onChange={props.onInputChange}
                            value={props.data.telephone} 
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth >
                            <InputLabel id="demo-simple-select-label">Role</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="role"
                                value={props.data.role}
                                label="Role"
                                onChange={props.onInputChange}
                            >
                                <MenuItem value={3}>Taxi</MenuItem>
                                <MenuItem value={4}>Medecin</MenuItem>
                                <MenuItem value={5}>Utilisateur</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
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
                        <Button variant="contained" onClick={validerFormulaire} endIcon={<SendIcon />}>
                            Suivant
                        </Button>
                    </Grid>
                </Grid>
                </form>
        </Box>
        
    );
}

export default InscriptionEtape2;