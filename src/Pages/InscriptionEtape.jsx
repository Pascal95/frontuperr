import React ,{useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InscriptionEtape2 from '../Components/InscriptionEtape2';
import InscriptPaiement from '../Components/InscriptPaiement';
import InscriptionTaxiPermis from '../Components/InscriptionTaxiPermis';
import InscriptionTaxiVehicule from '../Components/InscriptionTaxiVehicule';
import exampleImage from '../image/taxi.jpg';
import SendIcon from '@mui/icons-material/Send';


import { Box, Grid, Typography, Button, CircularProgress } from '@mui/material';
import VoitureMickael from '../assets/img/mercedes.jpeg';



function InscriptionEtape(props) {
    const { info } = useParams();
    const heureDemande = info.substring(0,14)
    const idUSR = info.substring(14)
    const [etape, setEtape] = useState(1);
    const [idFiiche, setidFiiche] = useState(0);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [nomFichierPermis, setNomFichierPermis] = useState('');
    const [nomFichierVehicule, setNomFichierVehicule] = useState('');
    const navigate = useNavigate();
    const [formFiche, setformFiche] =useState({
        nom: '',
        prenom: '',
        adresse: '',
        ville: '',
        datenaissance: '',
        codepostal: '',
        mailcontact: '',
        telephone: '',
        role:5,
        idCNX:idUSR,
        signature:'',
        idFicheMere:0,
        numSS:'',
        IdStripe:''
    })

    const allerAEtapeSuivante = async () => {
        console.log("etape", etape)
        try {
            if (etape === 2) {
                await soumettreFormFiche();
            }
            // Passer à l'étape suivante si tout va bien
            setEtape(etape + 1); // Utilisez etape + 1 au lieu de etape++
            console.log("etape", etape)
        } catch (err) {
            console.error("Erreur lors de la soumission du formulaire", err);
            // Gérer l'erreur ici (par exemple, afficher un message d'erreur)
        }
    };
    const allerAEtapePrecedente = () => setEtape(etape - 1);

    const soumettreFormFiche = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/users/ficheuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formFiche)
            });
    
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.erreur || 'Erreur lors de la soumission du formulaire');
            }
            console.log("FormFiche soumis avec succès", data);
            
            // Logique pour passer à l'étape suivante ou terminer le processus d'inscription
        } catch (err) {
            console.error("Erreur lors de la soumission de formFiche", err);
            // Gérer l'erreur ici
        }
    };

    

    const handleInputFiche = (e) => {
        setformFiche({
            ...formFiche,
            [e.target.name]: e.target.value
        })
    }
    
    

    switch (etape) {
        case 1:
            return (        
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <InscriptionEtape2 
                            data={formFiche} 
                            onInputChange={handleInputFiche} 
                            allerAEtapeSuivante={allerAEtapeSuivante}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                backgroundImage: `url(${VoitureMickael})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                height: '100vh', // ajustez selon vos besoins
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>);
        case 2:
            return (
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <InscriptPaiement
                                idFiche={idFiiche}
                                data={formFiche} 
                                allerAEtapeSuivante={allerAEtapeSuivante}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    backgroundImage: `url(${VoitureMickael})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    height: '100vh', // ajustez selon vos besoins
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>
            );
        case 3:
            return (
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            
                        </Grid>
                        <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        backgroundImage: `url(${VoitureMickael})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        height: '100vh', // ajustez selon vos besoins
                                    }}
                                />
                        </Grid>
                    </Grid>
                </Box>
                );
        default:
            return (
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 5, bgcolor: 'background.paper', borderRadius: 2 }}>
                            <Typography variant="h4" gutterBottom>
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4 }}>

                               Vous pouvez maintenant vous connecter à la plateforme.
                        </Typography>
                        <Button variant="contained" href="/" endIcon={<SendIcon />}>
                            Aller à la page de connexion
                        </Button>
                        </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        backgroundImage: `url(${VoitureMickael})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        height: '100vh', // ajustez selon vos besoins
                                    }}
                                />
                        </Grid>
                    </Grid>
                </Box>
                );
    }
}

export default InscriptionEtape;