import React, { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';



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
        <Box 
        component="form" 
        sx={{
            backgroundColor: "#F5F5F5",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '400px', 
            margin: 'auto',
            borderRadius: '7px'}}>
            <Typography variant="h3" gutterBottom>
                Information de l'utilisateur
            </Typography>
            <Box sx={{paddingBottom:"10px"}}>
                <TextField 
                    id="standard-basic" 
                    name="nom" 
                    label="Nom"     
                    onChange={props.onInputChange}
                    value={props.data.nom} 
                    variant="standard" />
            </Box>
            <Box sx={{paddingBottom:"10px"}}>
                <TextField 
                    id="standard-basic" 
                    name="prenom" 
                    label="Prenom"  
                    variant="standard" 
                    onChange={props.onInputChange}
                    value={props.data.prenom} 
                />
            </Box>
            <Box sx={{paddingBottom:"10px"}}>
                <TextField 
                    id="standard-basic" 
                    name="adresse" 
                    label="Adresse"  
                    variant="standard" 
                    onChange={props.onInputChange}
                    value={props.data.adresse} 
                />
            </Box>
            <Box sx={{paddingBottom:"10px"}}>
                <TextField 
                    id="standard-basic" 
                    name="ville" 
                    label="Ville"  
                    variant="standard" 
                    onChange={props.onInputChange}
                    value={props.data.ville} 
                />
            </Box>
            <Box sx={{paddingBottom:"10px"}}>
                <TextField 
                    id="standard-basic" 
                    name="codepostal" 
                    label="Code postal"  
                    variant="standard"
                    onChange={props.onInputChange}
                    value={props.data.codepostal}  
                />
            </Box>
            <Box sx={{paddingBottom:"10px"}}>
                <TextField 
                    id="standard-basic" 
                    name="mailcontact" 
                    label="Mail de contact"  
                    variant="standard" 
                    onChange={props.onInputChange}
                    value={props.data.mailcontact}  
                />
                </Box>
            <Box sx={{paddingBottom:"10px"}}>
                <TextField 
                    id="standard-basic" 
                    name="telephone" 
                    label="Telephone"  
                    variant="standard" 
                    onChange={props.onInputChange}
                    value={props.data.telephone} 
                />
            </Box>
            <FormControl variant="standard" sx={{m: 1, width: '22ch'}}>
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
            {erreurs.length > 0 && (
                <Box sx={{ color: 'error.main' }}>
                    {erreurs.map((erreur, index) => (
                        <Typography key={index} color="error">{erreur}</Typography>
                    ))}
                </Box>
            )}
            <Button variant="contained" onClick={validerFormulaire} endIcon={<SendIcon />}>
                Suivant
            </Button>
        </Box>
    );
}

export default InscriptionEtape2;