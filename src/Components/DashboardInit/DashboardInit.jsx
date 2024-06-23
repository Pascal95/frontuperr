import React, { useState, useEffect, useRef } from 'react';
import './DashboardInit.css';
import { Box } from '@mui/system';
import { TextField, Button, CircularProgress, Snackbar, Alert, Switch, FormControlLabel, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useJsApiLoader, GoogleMap, Marker, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import moment from 'moment';
import 'dayjs/locale/fr'; // Importer la locale française
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  components: {
    MuiSvgIcon: { // Cible toutes les icônes SVG dans le thème
      styleOverrides: {
        root: {
          color: 'red', // Définissez la couleur désirée ici
        }
      }
    }
  }
});
dayjs.locale('fr'); 

function DashboardInit(props) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    });
    const [formData, setFormData] = useState({
        idFicheUser: '',
        AdresseDepart: '',
        AdresseArrive: '',
        HeureConsult: '',
        AllerRetour: false,
        DureeConsult: '',
        pecPMR: 0
    });
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    const originRef = useRef();
    const destinationRef = useRef();
    const medicalAppointments = [
        { name: "Dialyse", duration: "04:00:00" },
        { name: "Chimiothérapie", duration: "01:00:00" },
        { name: "Consultation spécialisée", duration: "01:00:00" },
        { name: "Radiologie/Imagerie", duration: "01:00:00" },
        { name: "Thérapie physique", duration: "01:00:00" },
        { name: "Consultation pré/post opératoire", duration: "01:00:00" },
        { name: "Suivi de grossesse", duration: "00:30:00" },
        { name: "Soins de longue durée", duration: "01:00:00" },
        { name: "Traitements ophtalmologiques", duration: "01:00:00" },
        { name: "Psychothérapie", duration: "01:00:00" }
    ];

    useEffect(() => {
        if (formData.AdresseDepart && formData.AdresseArrive) {
            calculateRoute();
        }
    }, [formData.AdresseDepart, formData.AdresseArrive]);
    

    useEffect(() => {
        if (isLoaded) {
            const originAutocomplete = new window.google.maps.places.Autocomplete(originRef.current);
            const destinationAutocomplete = new window.google.maps.places.Autocomplete(destinationRef.current);

            originAutocomplete.addListener('place_changed', () => {
                const place = originAutocomplete.getPlace();
                if (place && place.formatted_address) {
                    handleSelectOrigin(place);
                }
            });

            destinationAutocomplete.addListener('place_changed', () => {
                const place = destinationAutocomplete.getPlace();
                if (place && place.formatted_address) {
                    handleSelectDestination(place);
                }
            });
        }
    }, [isLoaded]);

    const handleSelectOrigin = (place) => {
        setFormData(prevState => ({
            ...prevState,
            AdresseDepart: place.formatted_address
        }));
    };

    const handleSelectDestination = (place) => {
        setFormData(prevState => ({
            ...prevState,
            AdresseArrive: place.formatted_address
        }));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target || { name: event.name, value: event };
        console.log(`Name: ${name}, Value: ${value}`);
    
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDateChange = (newValue) => {
        setFormData(prevState => ({
            ...prevState,
            HeureConsult: newValue.format('YYYY-MM-DDTHH:mm:ss')
        }));
    };

    const handleSwitchChange = (event) => {
        setFormData(prevState => ({
            ...prevState,
            AllerRetour: event.target.checked
        }));
    };

    const calculateRoute = async () => {
        if (!formData.AdresseDepart || !formData.AdresseArrive) return;
        const directionsService = new window.google.maps.DirectionsService();
        const result = await directionsService.route({
            origin: formData.AdresseDepart,
            destination: formData.AdresseArrive,
            travelMode: window.google.maps.TravelMode.DRIVING
        });

        if (result.status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
        } else {
            setDirectionsResponse(null);
            // Vous pouvez également afficher une notification d'erreur ici
        }
    };

    const calculateHeureDepart = () => {
        if (!formData.HeureConsult || !directionsResponse || !directionsResponse.routes[0]) {
            return null; // Vérifiez également si directionsResponse.routes[0] existe
        }
    
        const durationInSeconds = directionsResponse.routes[0].legs[0].duration.value;
        const heureDepart = moment(formData.HeureConsult).subtract(durationInSeconds + 15 * 60, 'seconds').format('YYYY-MM-DDTHH:mm:ss');
    
        return heureDepart;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (!directionsResponse) {
            setSnackbar({ open: true, message: "Itinéraire non disponible", severity: 'error' });
            setIsLoading(false);
            return;
        }
        const heureDepart = calculateHeureDepart();
        const DureeTrajet = moment.utc(directionsResponse.routes[0].legs[0].duration.value * 1000).format('HH:mm:ss');
        const distanceMatch = directionsResponse.routes[0].legs[0].distance.text.match(/(\d+\.?\d*)/);
        const distanceValue = distanceMatch ? parseFloat(distanceMatch[0]) : 0;

        if (distanceValue < 15){
            setSnackbar({ open: true, message: "La distance est inférieure à 15 km", severity: 'error' });
            setIsLoading(false);
            return;
        }

        // Extract duration from the value
        const selectedAppointment = formData.DureeConsult.split('-');
        const dureeConsult = selectedAppointment[1];

        const reservationData = {
            ...formData,
            HeureDepart: heureDepart,
            DureeTrajet: DureeTrajet,
            Distance: distanceValue,
            DureeConsult: dureeConsult,
            AllerRetour: formData.AllerRetour ? 1 : 0
        };

        try {
            const response = await fetch(`${apiUrl}/api/reservation/newreservation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reservationData)
            });
            if (response.status === 401 || response.status === 403) {
                // Token is invalid or expired
                localStorage.removeItem('token');
                navigate('/');  // Redirect to login page
                throw new Error('Token is invalid or expired');
            }
            const data = await response.json();

            if (!response.ok) {
                // Ici, utilisez data.errorCode pour accéder au code d'erreur retourné par votre API
                if (data.errorCode === "NOT_ENOUGH_TRANSPORTS") {
                    setSnackbar({ open: true, message: "Vous n'avez pas assez de bons de transport disponibles.", severity: 'warning' });
                } else if (data.errorCode === "TAXI_PENDING") {
                    setSnackbar({ open: true, message: "Réservation en attente d'attribution d'un taxi.", severity: 'info' });
                } else {
                    // Gestion des autres erreurs
                    setSnackbar({ open: true, message: data.message || 'Erreur lors de la réservation.', severity: 'error' });
                }
            } else {
                // Réservation réussie
                setSnackbar({ open: true, message: 'Réservation réussie!', severity: 'success' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: error.message, severity: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchPatients = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${apiUrl}/api/users/mesusers`, {
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
                setPatients(data.listeUser);
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatients();
    }, [apiUrl]);
    
    if (!isLoaded) {
        return <CircularProgress />;
    }

    return (
        <div className="DashboardInit">
            <h2 className="dashboard__title">Réserver un taxi</h2>
            <form onSubmit={handleSubmit}>

                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Patient</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="idFicheUser"
                        value={formData.idFicheUser}
                        label="Patient"
                        onChange={handleInputChange}
                    >
                        {patients.map((patient) => (
                            <MenuItem key={patient.idFiche} value={patient.idFiche}>{patient.nom} {patient.prenom}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            <Autocomplete
                onLoad={(autocomplete) => { originRef.current = autocomplete; }}
                onPlaceChanged={() => {
                    if (originRef.current.getPlace()) {
                        handleSelectOrigin(originRef.current.getPlace());
                    }
                }}
            >
                <TextField
                    label="Adresse de départ"
                    fullWidth
                    margin="normal"
                    inputRef={originRef}
                />
            </Autocomplete>
            <Autocomplete
                onLoad={(autocomplete) => { destinationRef.current = autocomplete; }}
                onPlaceChanged={() => {
                    if (destinationRef.current.getPlace()) {
                        handleSelectDestination(destinationRef.current.getPlace());
                    }
                }}
            >
                <TextField
                    label="Adresse d'arrivée"
                    fullWidth
                    margin="normal"
                    inputRef={destinationRef}
                />
            </Autocomplete>
            
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
            <DateTimePicker
                label="Date heure de consultation"
                value={formData.HeureConsult}
                onChange={handleDateChange}  // Utilisation de handleDateChange au lieu de handleInputChange
                renderInput={(params) => <TextField {...params} />}
                ampm={false}
                inputFormat="DD/MM/YYYY HH:mm"
                fullWidth
                margin="normal"
            />
            </LocalizationProvider>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="demo-simple-select-label">Type de consultation</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="DureeConsult"
                        value={formData.DureeConsult}
                        label="Type de consultation"
                        onChange={handleInputChange}
                    >
                        {medicalAppointments.map((appointment, index) => (
                            <MenuItem key={index} value={`${appointment.name}-${appointment.duration}`}>
                                {appointment.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Prise en charge PMR</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="pecPMR"
                    value={formData.pecPMR}
                    label="Prise en charge PMR"
                    onChange={handleInputChange}
                >
                    <MenuItem value={0}>Non</MenuItem>
                    <MenuItem value={1}>Oui</MenuItem>
                </Select>
                </FormControl>
                <FormControlLabel
                    control={
                        <Switch
                            checked={formData.AllerRetour}
                            onChange={handleSwitchChange}
                            name="AllerRetour"
                        />
                    }
                    label="Aller/Retour"
                />
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isLoading}
                >
                    Envoyer la réservation
                </Button>
            </form>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
            {isLoaded && (
                <Box sx={{ height: 400, width: '100%', marginTop: 2 }}>
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={{ lat: 48.8566, lng: 2.3522 }}
                        zoom={12}
                    >
                        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
                    </GoogleMap>
                </Box>
            )}
        </div>
    );
}

export default DashboardInit;
