import React ,{useState} from 'react';
import { useParams } from 'react-router-dom';
import InscriptionEtape2 from '../Components/InscriptionEtape2';
import InscriptionTaxiPermis from '../Components/InscriptionTaxiPermis';
import InscriptionTaxiVehicule from '../Components/InscriptionTaxiVehicule';
import exampleImage from '../image/taxi.jpg';
import { Box, Grid } from '@mui/material';


function InscriptionEtape(props) {
    const { info } = useParams();
    const heureDemande = info.substring(0,14)
    const idUSR = info.substring(14)
    const [etape, setEtape] = useState(1);
    const [formFiche, setformFiche] =useState({
        nom: '',
        prenom: '',
        adresse: '',
        ville: '',
        codepostal: '',
        mailcontact: '',
        telephone: '',
        role:'',
        idCNX:idUSR
    })

    const [formPermis, setformPermis] = useState({
        numPermis:'',
        dateDelivrance:'',
        dateExpiration:'',
        scanPermis:''
    })

    const [formVehicule, setformVehicule] = useState({
        marqu:'',
        modele:'',
        annee:'',
        numImmatriculation:'',
        numSerie:''
    })


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

    const handleInputFiche = (e) => {
        setformFiche({
            ...formFiche,
            [e.target.name]: e.target.value
        })
    }
    const handleInputPermis = (e) => {
        setformPermis({
            ...formPermis,
            [e.target.name]: e.target.value
        })
    }
    const handleInputVehicule = (e) => {
        setformVehicule({
            ...formVehicule,
            [e.target.name]: e.target.value
        })
    }


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
                        <InscriptionEtape2 data={formFiche} onInputChange={handleInputFiche} allerAEtapeSuivante={allerAEtapeSuivante} />
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
            return formData.role === 3 ? 
                (
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <InscriptionTaxiPermis data={formPermis} onInputChange={handleInputPermis} allerAEtapeSuivante={allerAEtapeSuivante} allerAEtapePrecedente={allerAEtapePrecedente} />
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
                            <InscriptionTaxiVehicule data={formVehicule} onInputChange={handleInputVehicule} allerAEtapeSuivante={allerAEtapeSuivante} allerAEtapePrecedente={allerAEtapePrecedente} />
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