import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/fr';
import { Box } from '@mui/system';

function Test(props) {
    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                <Box sx={{paddingBottom:"10px"}}>
                    <DatePicker 
                        label="Date de délivrance"
                        name="dateDel"
                    />
                </Box>
                <Box sx={{paddingBottom:"10px"}}>
                    <DatePicker 
                        label="Date d'expiration" 
                        name="dateExpi"
                    />
                </Box>
            </LocalizationProvider>
        </div>
    );
}

export default Test;