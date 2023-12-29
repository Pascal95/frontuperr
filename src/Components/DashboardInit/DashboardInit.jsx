import React from 'react';
import { useState, useRef, useEffect } from 'react';
import './DashboardInit.css'
import { Box } from '@mui/system';
import { Button, Skeleton } from '@mui/material';
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import moment from 'moment';

function DashboardInit(props) {
    const ApiKey = "AIzaSyD5_kKrwRWSXq1lh9UI_-5tONjU1BeQSII"
    const [map,setMap] = useState(/** @type google.maps.Map */ (null))
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
    const [isTypingOrigin, setIsTypingOrigin] = useState(false);
    const [isTypingDestination, setIsTypingDestination] = useState(false);
    const [formData, setFormData] = useState({
        patient: '',
        numSecu: '',
        depart: '',
        arrivee: '',
        dateTime: '',
        heureDepart: '',
        dureeConsult: '',
        DureeTrajet: '',    
        allerRetour: '',
        Distance: '',
    });

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

    function clearRoute() {
        setDirectionsResponse(null)
        setDistance('')
        setDuration('')
        originRef.current.value = ''
        destinationRef.current.value = ''
    }

    const handleOriginChange = (e) => {
        setIsTypingOrigin(true);
        setDirectionsResponse(null); // Réinitialise l'itinéraire lors de la modification de l'adresse
        handleInputChange(e); // Mise à jour de l'état formData pour le champ de départ
    };

    const handleDestinationChange = (e) => {
        setIsTypingDestination(true);
        setDirectionsResponse(null); // Réinitialise l'itinéraire lors de la modification de l'adresse
        handleInputChange(e); // Mise à jour de l'état formData pour le champ d'arrivée
    };

    const handleBlur = () => {
        setIsTypingOrigin(false);
        setIsTypingDestination(false);
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
        const consultationDateTime = moment(e.target.value);
        if (!duration || !consultationDateTime.isValid()) return;

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
        height: '400px'
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
        console.log(directionsResponse)
    };

    if (!isLoaded) return <Skeleton variant="rectangular" width="100%" height="400px" />;


    return (
        <div className="DashboardInit">
            <h2 className="dashboard__title">Reserver un taxi</h2>

            <form onSubmit={handleSubmit}>
                <div className="form__group">
                    <div>
                        <label>Patient</label>
                        <input 
                            type="text" 
                            name="patient"
                            placeholder="Nom du patient"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Numéro de sécurité social</label>
                        <input type="text" placeholder="10093072074" />
                    </div>
                </div>
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
                        <input type="time" name="dureeconsult" id="dureeconsult" />
                    </div>
                    <div>
                        <label htmlFor="">Durée de la consultation</label>
                        <input type="time" name="DureeTrajet" id="DureeTrajet" />
                    </div>
                    
                </div>
                <div className="form__group">
                <div>
                        <label htmlFor="">Souhaitez vous faire l'aller retour</label>
                        <select name="AllerRetour" id="AllerRetour" onChange={handleInputChange} >
                            <option value="1">Oui</option>
                            <option value="0">Non</option>
                        </select>
                    </div>
                </div>
                <button className="btn-validate">Valider</button>
            </form>
            <Button 
                variant="contained" 
                sx={{ mt: 2 }} 
                onClick={() => map.panTo(center)}>Recentrer</Button>
            <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={calculateRoute}>Calculer</Button>
            <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={clearRoute}>Effacer</Button>
            <p>Distance: {distance}</p>
            <p>Durée: {duration}</p>

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