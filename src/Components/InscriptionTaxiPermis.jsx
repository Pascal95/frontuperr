import React from 'react';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/fr';
import SendIcon from '@mui/icons-material/Send';

function InscriptionTaxiPermis(props) {
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });
    return (
        <Box component="form" >
            <Typography variant="h3" gutterBottom>
                Information sur le permis
            </Typography>
            <Box sx={{paddingBottom:"10px"}}>
                <TextField 
                    id="standard-basic" 
                    name="numPermis"
                    label="Numero de permis" 
                    variant="standard" 
                    
                    onChange={props.onInputChange}
                    value={props.data.numPermis}
                />
                
            </Box>
            <Box sx={{paddingBottom:"10px"}}>
            <label>Date de délivrance</label>
            <input type="date" name="dateDel" value={props.data.dateDel} onChange={props.onInputChange} />

            </Box>
            <Box sx={{paddingBottom:"10px"}}>
                <label>Date d'expiration</label>
                <input type="date" name="dateExpi" value={props.data.dateExpi} onChange={props.onInputChange} />
            </Box>
            <Box sx={{paddingBottom:"10px"}}>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                    Scan permis
                    <VisuallyHiddenInput type="file" />
                </Button>
            </Box>
            <Button variant="contained" onClick={props.allerAEtapeSuivante} endIcon={<SendIcon />}>
                Suivant
            </Button>

        </Box>
    );
}

export default InscriptionTaxiPermis;