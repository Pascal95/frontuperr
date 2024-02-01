import React, { useState, useEffect, useRef } from 'react';
import './DashboardInit.css'
import { Box } from '@mui/system';
import { TextField, Button, CircularProgress, Snackbar, Alert, Switch, FormControlLabel, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useJsApiLoader, GoogleMap, Marker, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import moment from 'moment';

function DashboardInit(props) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    const [patients, setPatients] = useState([]);
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
    });
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    const originRef = useRef();
    const destinationRef = useRef();

    useEffect(() => {
        if (formData.AdresseDepart && formData.AdresseArrive) {
            calculateRoute();
        }
    }, [formData.AdresseDepart, formData.AdresseArrive]);
    

    useEffect(() => {
        if (isLoaded) {
            const originAutocomplete = new google.maps.places.Autocomplete(originRef.current);
            const destinationAutocomplete = new google.maps.places.Autocomplete(destinationRef.current);

            originAutocomplete.addListener('place_changed', () => {
                setFormData({ ...formData, AdresseDepart: originAutocomplete.getPlace().formatted_address });
                calculateRoute();
            });

            destinationAutocomplete.addListener('place_changed', () => {
                setFormData({ ...formData, AdresseArrive: destinationAutocomplete.getPlace().formatted_address });
                calculateRoute();
            });
        }
    }, [isLoaded]);


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSwitchChange = (event) => {
        setFormData({ ...formData, AllerRetour: event.target.checked });
    };

    const handleSelectOrigin = (place) => {
        setFormData(formData => ({ ...formData, AdresseDepart: place.formatted_address }));
    };
    
    const handleSelectDestination = (place) => {
        setFormData(formData => ({ ...formData, AdresseArrive: place.formatted_address }));
    };

    const calculateRoute = async () => {
        if (!formData.AdresseDepart || !formData.AdresseArrive) return;
        if (formData.AdresseDepart && formData.AdresseArrive) {
            const directionsService = new google.maps.DirectionsService();
            const result = await directionsService.route({
                origin: formData.AdresseDepart,
                destination: formData.AdresseArrive,
                travelMode: google.maps.TravelMode.DRIVING
            });
    
            if (result.status === google.maps.DirectionsStatus.OK) {
                setDirectionsResponse(result);
            } else {
                setDirectionsResponse(null);
                // Vous pouvez également afficher une notification d'erreur ici
            }
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

        const reservationData = {
            ...formData,
            HeureDepart: heureDepart,
            DureeTrajet: DureeTrajet,
            Distance: distanceValue,
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
    }, []);
    if (!isLoaded) {
        return <CircularProgress />;
    }
        
    
    if (!isLoaded) return <Skeleton variant="rectangular" width="100%" height="400px" />;


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
                    <MenuItem value={patient.idFiche}>{patient.nom} {patient.prenom}</MenuItem>
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
                <TextField
                    type="datetime-local"
                    label="Heure de consultation"
                    name="HeureConsult"
                    value={formData.HeureConsult}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    type="time"
                    label="Durée de la consultation"
                    name="DureeConsult"
                    value={formData.DureeConsult}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
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