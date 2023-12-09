import React ,{useState} from 'react';
import { useParams } from 'react-router-dom';
import InscriptionEtape2 from '../Components/InscriptionEtape2';
import InscriptionTaxiPermis from '../Components/InscriptionTaxiPermis';
import InscriptionTaxiVehicule from '../Components/InscriptionTaxiVehicule';
import exampleImage from '../image/taxi.jpg';


function InscriptionEtape(props) {
    const { info } = useParams();
    const [etape, setEtape] = useState(1);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        adresse: '',
        ville: '',
        email: '',
        telephone: '',
        role: '', // 'utilisateur' ou 'taxi'
        // Données spécifiques pour les taxis
        permis: '',
        vehicule: ''
    });
    const allerAEtapeSuivante = () => setEtape(etape + 1);
    const allerAEtapePrecedente = () => setEtape(etape - 1);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    switch (etape) {
        case 1:
            return (        
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <InscriptionEtape2 data={formData} onInputChange={handleInputChange} allerAEtapeSuivante={allerAEtapeSuivante} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                backgroundImage: `url(${exampleImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                height: '100vh', // ajustez selon vos besoins
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>);
        case 2:
            return formData.role === 'taxi' ? 
                (
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <InscriptionTaxiPermis data={formData} onInputChange={handleInputChange} allerAEtapeSuivante={allerAEtapeSuivante} allerAEtapePrecedente={allerAEtapePrecedente} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        backgroundImage: `url(${exampleImage})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        height: '100vh', // ajustez selon vos besoins
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                
                ) : 
                'Inscription Complète pour Utilisateur';
        case 3:
            return (
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <InscriptionTaxiVehicule data={formData} onInputChange={handleInputChange} allerAEtapeSuivante={allerAEtapeSuivante} allerAEtapePrecedente={allerAEtapePrecedente} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        backgroundImage: `url(${exampleImage})`,
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
            return 'Étape inconnue';
    }
}

export default InscriptionEtape;