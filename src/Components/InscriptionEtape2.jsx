import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';


function InscriptionEtape2(props) {
    return (
        <Box component="form" >
      <Typography variant="h3" gutterBottom>
        Information de l'utilisateur
      </Typography>
            <Box sx={{paddingBottom:"10px"}}><TextField id="standard-basic" label="Nom" variant="standard" /></Box>
            <Box sx={{paddingBottom:"10px"}}><TextField id="standard-basic" label="Prenom" variant="standard" /></Box>
            <Box sx={{paddingBottom:"10px"}}><TextField id="standard-basic" label="Adresse" variant="standard" /></Box>
            <Box sx={{paddingBottom:"10px"}}><TextField id="standard-basic" label="Ville" variant="standard" /></Box>
            <Box sx={{paddingBottom:"10px"}}><TextField id="standard-basic" label="Code postal" variant="standard" /></Box>
            <Box sx={{paddingBottom:"10px"}}><TextField id="standard-basic" label="Mail de contact" variant="standard" /></Box>
            <Box sx={{paddingBottom:"10px"}}><TextField id="standard-basic" label="Telephone" variant="standard" /></Box>
            <FormControl variant="standard" sx={{m: 1, width: '22ch'}}>

            
                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={props.data.role}
                    label="Role"
                    onChange={props.onInputChange}
                >
                    <MenuItem value={3}>Taxi</MenuItem>
                    <MenuItem value={4}>Medecin</MenuItem>
                    <MenuItem value={5}>Utilisateur</MenuItem>
                </Select>
            </FormControl>





            <div>        
            {/* Champs du formulaire pour nom, prenom, etc. */}
            {/* Select pour le rôle */}
            <select name="role" value={props.data.role} onChange={props.onInputChange}>
                <option value="utilisateur">Utilisateur</option>
                <option value="taxi">Taxi</option>
            </select>
            </div>
            <button type="button" onClick={props.allerAEtapeSuivante}>Suivant</button>
        
        </Box>
    );
}

export default InscriptionEtape2;