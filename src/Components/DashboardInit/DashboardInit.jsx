import React from 'react';
import { useState, useRef, useEffect } from 'react';
import './DashboardInit.css'
import { Box } from '@mui/system';
import { Button, Skeleton } from '@mui/material';
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';

function DashboardInit(props) {
    const ApiKey = "AIzaSyD5_kKrwRWSXq1lh9UI_-5tONjU1BeQSII"
    const [map,setMap] = useState(/** @type google.maps.Map */ (null))
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')

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
        if(originRef.current.value === '' || destinationRef.current.value === '') {
            return
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
    // Configuration de la carte
    const mapContainerStyle = {
        width: '100%',
        height: '400px'
    };
    const center = {
        lat: 48.8566, // Coordonnées de Paris, par exemple
        lng: 2.3522
    };

    if (!isLoaded) return <Skeleton variant="rectangular" width="100%" height="400px" />;


    return (
        <div className="DashboardInit">
            <h2 className="dashboard__title">Reserver un taxi</h2>

            <form>
                <div className="form__group">
                    <div>
                        <label>Patient</label>
                        <select name="patient" id="patient">
                            <option value="Tom">Tom</option>
                            <option value="René">René</option>
                        </select>
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
                            <input type="text" placeholder="6 rue des fossettes 95330 Domont" ref={originRef} />
                        </Autocomplete>
                    </div>
                    <div>
                        <label>Lieu d'arrivé</label>
                        <Autocomplete>
                            <input type="text" placeholder="Hopital d'Eaubonne" ref={destinationRef} />
                        </Autocomplete>
                    </div>
                </div>
                <div className="form__group">
                    <div>
                        <label for="party">Date et heure de consultation</label>
                        <input
                        id="party"
                        type="datetime-local"
                        name="partydate"
                        value="2017-06-01T08:30" />
                    </div>
                    <div>
                        <label for="party">Heure de depart suggéré</label>
                        <input
                        id="party"
                        type="time"
                        name="partydate"/>
                    </div>
                </div>
                <div className="form__group">
                    <div>
                        <label htmlFor="">Durée de la consultation</label>
                        <input type="time" name="dureeconsult" id="dureeconsult" />
                    </div>
                    <div>
                        <label htmlFor="">Souhaitez vous faire l'aller retour</label>
                        <select name="AllerRetour" id="AllerRetour">
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