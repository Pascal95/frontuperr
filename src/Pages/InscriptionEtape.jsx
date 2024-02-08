import React ,{useState} from 'react';
import { useParams } from 'react-router-dom';
import InscriptionEtape2 from '../Components/InscriptionEtape2';
import InscriptionTaxiPermis from '../Components/InscriptionTaxiPermis';
import InscriptionTaxiVehicule from '../Components/InscriptionTaxiVehicule';
import exampleImage from '../image/taxi.jpg';
import SendIcon from '@mui/icons-material/Send';

import { Box, Grid, Typography, Button } from '@mui/material';
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
        permis:'',
        idFiche:idFiiche
    })
    
    const [formVehicule, setformVehicule] = useState({
        Marque:'',
        Modele:'',
        Annee:'',
        numImmatriculation:'',
        numSerie:'',
        carteGrise:'',
        idFiche:idFiiche
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

            if(data.ficheId) {
                setformPermis(prevState => ({
                    ...prevState,
                    idFiche: data.ficheId
                }));

                setformVehicule(prevState => ({
                    ...prevState,
                    idFiche: data.ficheId
                }));
            }

            
            // Logique pour passer à l'étape suivante ou terminer le processus d'inscription
        } catch (err) {
            console.error("Erreur lors de la soumission de formFiche", err);
            // Gérer l'erreur ici
        }
    };
    
    const soumettreFormPermis = async () => {
        const formData = new FormData();
    
        // Ajoutez les champs de formulaire et le fichier à l'objet FormData
        formData.append('numPermis', formPermis.numPermis);
        formData.append('dateDel', formPermis.dateDel);
        formData.append('dateExpi', formPermis.dateExpi);
        formData.append('idFiche', formPermis.idFiche);
    
        // Ajoutez le fichier permis si disponible
        if (formPermis.permis) {
            formData.append('permis', formPermis.permis);
        }
    
        try {
            const response = await fetch(`${apiUrl}/api/users/fichepermis`, {
                method: 'POST',
                body: formData, // Ici, envoyez formData au lieu d'un JSON
                // Ne définissez pas l'en-tête 'Content-Type' ; il sera automatiquement défini par le navigateur
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
            const formData = new FormData();

            formData.append('Marque', formVehicule.Marque);
            formData.append('Modele', formVehicule.Modele);
            formData.append('Annee', formVehicule.Annee);
            formData.append('numImmatriculation', formVehicule.numImmatriculation);
            formData.append('numSerie', formVehicule.numSerie);
            formData.append('idFiche', formVehicule.idFiche);

        
            // Ajoutez le fichier permis si disponible
            if (formVehicule.carteGrise) {
                formData.append('carteGrise', formVehicule.carteGrise);
            }
            const response = await fetch(`${apiUrl}/api/users/fichevehicule`, {
                method: 'POST',
                body: formData,
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
    

    const handleInputPermis = (e) => {
        setformPermis({
            ...formPermis,
            [e.target.name]: e.target.value
        })
        console.log(formPermis)
    }

    const handleInputVehicule = (e) => {
        setformVehicule({
            ...formVehicule,
            [e.target.name]: e.target.value
        })
    }

    const handleFileChangePermis = (e) => {
        if (e.target.files && e.target.files[0]) {
            setformPermis({
                ...formPermis,
                permis: e.target.files[0]
            });
            setNomFichierPermis(e.target.files[0].name);
        }
    };

    const handleFileChangeVehicule = (e) => {
        if (e.target.files && e.target.files[0]) {
            setformVehicule({
                ...formVehicule,
                carteGrise: e.target.files[0]
            });
            setNomFichierVehicule(e.target.files[0].name);
        }
    };
    

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
            return formFiche.role === 3 ? 
                (
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <InscriptionTaxiPermis 
                                    data={formPermis} 
                                    onInputChange={handleInputPermis} 
                                    onFileChangePermis={handleFileChangePermis}
                                    allerAEtapeSuivante={allerAEtapeSuivante} 
                                    allerAEtapePrecedente={allerAEtapePrecedente} 
                                    nomFichierPermis={nomFichierPermis}
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
                
                ) : 
                'Inscription terminé';
        case 3:
            return (
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <InscriptionTaxiVehicule 
                                data={formVehicule} 
                                onInputChange={handleInputVehicule} 
                                onFileChangeVehicule={handleFileChangeVehicule}
                                allerAEtapeSuivante={allerAEtapeSuivante} 
                                allerAEtapePrecedente={allerAEtapePrecedente} 
                                nomFichierVehicule={nomFichierVehicule}
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
        default:
            return (
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 5, bgcolor: 'background.paper', borderRadius: 2 }}>
                            <Typography variant="h4" gutterBottom>
                            {formFiche.role === 3 ? 'Merci pour votre inscription en tant que Taxi!' : 'Inscription réussie!'}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4 }}>
                            {formFiche.role === 3 
                                ? 'Vous recevrez un email une fois que votre compte et vos documents seront confirmés.'
                                : 'Vous pouvez maintenant vous connecter à la plateforme.'}
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