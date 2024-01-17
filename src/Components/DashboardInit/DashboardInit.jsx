import React from 'react';
import { useState, useRef, useEffect } from 'react';
import './DashboardInit.css'
import { Box } from '@mui/system';
import { Button, Skeleton, CircularProgress, Backdrop, Snackbar, Alert } from '@mui/material';
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import moment from 'moment';

function DashboardInit(props) {
    const ApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const [map,setMap] = useState(/** @type google.maps.Map */ (null))
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
    const [isTypingOrigin, setIsTypingOrigin] = useState(false);
    const [isTypingDestination, setIsTypingDestination] = useState(false);
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL;
    const [formData, setFormData] = useState({
        patient: '',
        numSecu: '',
        depart: '',
        arrivee: '',
        dateTime: '',
        heureDepart: '',
        DureeConsult: '',
        DureeTrajet: '',    
        allerRetour: '',
        Distance: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef()
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destinationRef = useRef()

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: ApiKey,
        libraries: ['places']
    });
    if (isLoaded) { // Assurez-vous que l'API Google Maps est chargée
        const autocompleteOrigin = new google.maps.places.Autocomplete(originRef.current);
        const autocompleteDestination = new google.maps.places.Autocomplete(destinationRef.current);
    
        autocompleteOrigin.setComponentRestrictions({
            country: "fr",
        });
    
        autocompleteDestination.setComponentRestrictions({
            country: "fr",
        });
    }
    async function calculateRoute() {
        if (!originRef.current?.value || !destinationRef.current?.value) {
            return;
        }
        const directionsService = new google.maps.DirectionsService();
        const result = directionsService.route({
            origin: {
                query: originRef.current.value
            },
            destination: {
                query: destinationRef.current.value
            },
            travelMode: google.maps.TravelMode.DRIVING
        }, (response, status) => {
            if(status === google.maps.DirectionsStatus.OK) {
                setDirectionsResponse(response)
                setDistance(response.routes[0].legs[0].distance.text)
                setDuration(response.routes[0].legs[0].duration.text)
            } else {
                console.log(response)
            }
        })  
    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    function clearRoute() {
        setDirectionsResponse(null)
        setDistance('')
        setDuration('')
        originRef.current.value = ''
        destinationRef.current.value = ''
    }
    const handleSelectOrigin = () => {
        const place = originAutocomplete.getPlace();
        if (place.formatted_address) {
            setFormData(prevState => ({
                ...prevState,
                depart: place.formatted_address
            }));
        }
    };
    
    const handleSelectDestination = () => {
        const place = destinationAutocomplete.getPlace();
        if (place.formatted_address) {
            setFormData(prevState => ({
                ...prevState,
                arrivee: place.formatted_address
            }));
        }
    };
    
    const handleOriginChange = (e) => {
        setIsTypingOrigin(true);
        setDirectionsResponse(null); // Réinitialise l'itinéraire
        setFormData(prevState => ({
            ...prevState,
            depart: e.target.value // Mise à jour de formData.depart
        }));
    };

    const handleDestinationChange = (e) => {
        setIsTypingDestination(true);
        setDirectionsResponse(null); // Réinitialise l'itinéraire
        setFormData(prevState => ({
            ...prevState,
            arrivee: e.target.value // Mise à jour de formData.arrivee
        }));
    };

    const handleBlur = () => {
        setIsTypingOrigin(false);
        setIsTypingDestination(false);
    };

    const sendReservationData = async () => {
        setIsLoading(true);
        const url = `${apiUrl}/api/reservation/newreservation`;
        const formattedHeureDepart = moment(formData.heureDepart).format('YYYY-MM-DD HH:mm:ss');
        const formattedHeureConsult = moment(formData.HeureConsult).format('YYYY-MM-DD HH:mm:ss');
        const distanceValue = parseFloat(distance);
        const durationParts = duration.match(/(\d+)\s*min/);
        const durationValue = durationParts ? `00:${durationParts[1].padStart(2, '0')}:00` : '00:00:00';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                AdresseDepart: formData.depart,
                AdresseArrive: formData.arrivee,
                Distance: distanceValue, // Assurez-vous que cette valeur est correcte
                DureeTrajet: durationValue,
                HeureConsult: formattedHeureConsult,
                HeureDepart: formattedHeureDepart,
                AllerRetour: formData.AllerRetour,
                DureeConsult: formData.DureeConsult
            })
        };

        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const responseData = await response.json();
            console.log(responseData); // Traiter les données reçues
            setSnackbar({ open: true, message: 'Réservation réussie!', severity: 'success' });
        } catch (error) {
            console.error('There was an error!', error);
            setSnackbar({ open: true, message: 'Échec de la réservation.', severity: 'error' });
        } finally{
            setIsLoading(false);
        
        }
    };

    useEffect(() => {
        if (!isTypingOrigin && !isTypingDestination && originRef.current?.value && destinationRef.current?.value) {
            calculateRoute();
            
        }
    }, [originRef.current?.value, destinationRef.current?.value, isTypingOrigin, isTypingDestination]);

    useEffect(() => {
        // Vérifie si les deux champs sont remplis
        if (originRef.current?.value && destinationRef.current?.value) {
            calculateRoute();
        }
    }, [originRef.current?.value, destinationRef.current?.value]);


    const convertDurationToMinutes = (durationStr) => {
        const hoursMatch = durationStr.match(/(\d+)\s*hour/);
        const minutesMatch = durationStr.match(/(\d+)\s*min/);

        const hours = hoursMatch ? parseInt(hoursMatch[1], 10) * 60 : 0;
        const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

        return hours + minutes;
    };

    const handleConsultationDateTimeChange = (e) => {
        console.log("Nouvelle valeur:", e.target.value);
        const consultationDateTimeValue = e.target.value;
        const consultationDateTime = moment(consultationDateTimeValue);
    
        if (!consultationDateTime.isValid()) {
            console.error('Date et heure de consultation non valides:', consultationDateTimeValue);
            return;
        }
    
        if (!duration) {
            console.error('Durée non définie');
            return;
        }
    
        const trajetMinutes = convertDurationToMinutes(duration);
        const totalDurationInMinutes = trajetMinutes + 15; // Ajouter 15 minutes
    
        // Calculer la nouvelle heure de départ
        const departureTime = consultationDateTime.clone().subtract(totalDurationInMinutes, 'minutes');
    
        setFormData(prevState => ({
            ...prevState,
            heureDepart: departureTime.format("YYYY-MM-DDTHH:mm")
        }));
    };

    // Configuration de la carte
    const mapContainerStyle = {
        width: '100%',
        height: '400px',
        marginTop: '20px',
    };
    const center = {
        lat: 48.8566, // Coordonnées de Paris, par exemple
        lng: 2.3522
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Pour empêcher le rechargement de la page
        console.log(formData);
        // Ici, vous pouvez effectuer d'autres actions avec formData
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        if (isLoaded) {
            // Autocomplete pour le lieu de départ
            const originAutocomplete = new google.maps.places.Autocomplete(originRef.current);
            originAutocomplete.setComponentRestrictions({ country: "fr" });
            originAutocomplete.addListener("place_changed", handleSelectOrigin);
    
            // Autocomplete pour le lieu d'arrivée
            const destinationAutocomplete = new google.maps.places.Autocomplete(destinationRef.current);
            destinationAutocomplete.setComponentRestrictions({ country: "fr" });
            destinationAutocomplete.addListener("place_changed", handleSelectDestination);
        }
    }, [isLoaded]);
    
    
        
    
    if (!isLoaded) return <Skeleton variant="rectangular" width="100%" height="400px" />;


    return (
        <div className="DashboardInit">
            <h2 className="dashboard__title">Reserver un taxi</h2>

            <form onSubmit={handleSubmit}>
                <div className="form__group">
                    <div>
                        <label>Lieu de départ</label>
                        <Autocomplete>
                            <input 
                                type="text" 
                                placeholder="6 rue des fossettes 95330 Domont" 
                                ref={originRef} 
                                name='depart' 
                                onChange={handleOriginChange}
                                onBlur={handleBlur}
                            />
                        </Autocomplete>
                    </div>
                    <div>
                        <label>Lieu d'arrivé</label>
                        <Autocomplete>
                            <input 
                                type="text" 
                                placeholder="Hopital d'Eaubonne" 
                                ref={destinationRef} 
                                name='arrivee' 
                                onChange={handleDestinationChange} 
                                onBlur={handleBlur}
                            />
                        </Autocomplete>
                    </div>
                </div>
                <div className="form__group">
                    <div>
                        <label for="HeureConsult">Date et heure de consultation</label>
                        <input
                            id="HeureConsult"
                            type="datetime-local"
                            name="HeureConsult"
                            onChange={handleConsultationDateTimeChange}
                        />
                    </div>
                    <div>
                        <label for="HeureDepart">Heure de depart suggéré</label>
                        <input
                            id="HeureDepart"
                            type="datetime-local"
                            name="HeureDepart"
                            value={formData.heureDepart}
                            onChange={handleInputChange} 
                        />
                    </div>
                </div>
                <div className="form__group">
                    <div>
                        <label htmlFor="">Durée de la consultation</label>
                        <input type="time" name="DureeConsult" id="DureeConsult" onChange={handleInputChange} />
                    </div>
                    <div>
                        <label htmlFor="">Souhaitez vous faire l'aller retour</label>
                        <select name="AllerRetour" id="AllerRetour" onChange={handleInputChange}  >
                            <option value="1">Oui</option>
                            <option value="0">Non</option>
                        </select>
                    </div>
                </div>
                <button onClick={sendReservationData} className="btn-validate">Envoyer la réservation</button>
                <Backdrop 
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            </form>

            <Box sx={mapContainerStyle}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={10}
                    onLoad={map => setMap(map)} 
                >
                    <Marker position={center} />
                    {directionsResponse && (
                        <DirectionsRenderer
                            options={{
                                directions: directionsResponse
                            }}
                        />
                    )}
                </GoogleMap>
            </Box>
        </div>
    );
}

export default DashboardInit;