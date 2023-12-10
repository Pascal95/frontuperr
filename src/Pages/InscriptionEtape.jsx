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
    const [idFiche, setidFiche] = useState(0);
    const [formFiche, setformFiche] =useState({
        nom: '',
        prenom: '',
        adresse: '',
        ville: '',
        codepostal: '',
        mailcontact: '',
        telephone: '',
        role:'',
        idCNX:idUSR,
        signature:'',
        idFicheMere:0,
        numSS:''
    })

    const [formPermis, setformPermis] = useState({
        numPermis:'',
        dateDel:'',
        dateExpi:'',
        ficPermis:'',
        idFiche:idFiche
    })

    const [formVehicule, setformVehicule] = useState({
        marqu:'',
        modele:'',
        annee:'',
        numImmatriculation:'',
        numSerie:'',
        idFiche:idFiche
    })

    const allerAEtapeSuivante = async () => {
        try {
            if (etape === 1) {
                await soumettreFormFiche(); // Soumettre le formulaire de l'étape 1
            } else if (etape === 2 && formFiche.role === 3) {
                await soumettreFormPermis(); // Soumettre le formulaire de permis si role est taxi
            } else if (etape === 3 && formFiche.role === 3) {
                await soumettreFormVehicule(); // Soumettre le formulaire de véhicule si role est taxi
            }
            // Passer à l'étape suivante si tout va bien
            setEtape(etapeActuelle => etapeActuelle + 1);
        } catch (err) {
            console.error("Erreur lors de la soumission du formulaire", err);
            // Gérer l'erreur ici (par exemple, afficher un message d'erreur)
        }
    };
    const allerAEtapePrecedente = () => setEtape(etape - 1);

    const soumettreFormFiche = async () => {
        try {
            const response = await fetch("https://backupper.onrender.com/api/users/ficheuser", {
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
            setidFiche(data.ficheId)
            console.log("FormFiche soumis avec succès", data);
            // Logique pour passer à l'étape suivante ou terminer le processus d'inscription
        } catch (err) {
            console.error("Erreur lors de la soumission de formFiche", err);
            // Gérer l'erreur ici
        }
    };
    
    const soumettreFormPermis = async () => {
        try {
            const response = await fetch("https://backupper.onrender.com/api/users/fichepermis", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formPermis)
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

    const soumettreFormVehicule = async () => {
        try {
            const response = await fetch("https://backupper.onrender.com/api/users/fichevehicule", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formVehicule)
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
        console.log(formFiche)
    }
    const handleInputPermis = (name, value) => {
        setformPermis(prevFormPermis => ({
            ...prevFormPermis,
            [name]: value
        }));
    };

/*    const handleInputPermis = (e) => {
        setformPermis({
            ...formPermis,
            [e.target.name]: e.target.value
        })
    }*/
    const handleInputVehicule = (e) => {
        setformVehicule({
            ...formVehicule,
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
            return formFiche.role === 3 ? 
                (
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <InscriptionTaxiPermis 
                                    data={formPermis} 
                                    onInputChange={handleInputPermis} 
                                    allerAEtapeSuivante={allerAEtapeSuivante} 
                                    allerAEtapePrecedente={allerAEtapePrecedente} 
                                />
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
                            <InscriptionTaxiVehicule 
                                data={formVehicule} 
                                onInputChange={handleInputVehicule} 
                                allerAEtapeSuivante={allerAEtapeSuivante} 
                                allerAEtapePrecedente={allerAEtapePrecedente} 
                            />
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