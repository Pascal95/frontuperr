import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import { Box } from '@mui/system';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Snackbar, Alert, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';


function InscriptionTaxi(props) {
    const [etape, setEtape] = useState(1);
    const { key } = useParams();
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const location = useLocation();
    const [hasFiche, setHasFiche] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [productInfo, setProductInfo] = useState(null); // Nouvel état pour les informations du produit
    const [priceInfo, setPriceInfo] = useState(null); // Nouvel état pour les informations du prix

    const [donneesInscription, setDonneesInscription] = useState({
        key: key,
        etape1: {
            password: '',
            confirmPassword: '',
        },
        etape2: {
            nom: '',
            prenom: '',
            adresse: '',
            codepostal: '',
            ville: '',
            telephone: '',
        }, 
        etape3: {
            marquevehicule: '',
            modele: '',
            annee: '',
            couleurvehicule: '',
            pecPMR: '',
            immatriculation: '',
            numSerie: '',
            controletechnique: null,
        },
        etape4: {
            KBIS: null,
            attestassurance: null,
            autostationnement: null,
            atteststagecontinue: null,
            attestmedicale: null,
            cartepro: null,
            permis: null,
        },
        etape5: {
            numPermis:'',
            dateDel:'',
            dateExpi:'',
        },    
        etape6: {
            paymentMethodId: '',
        },
    });
    const [erreur, setErreur] = useState('');
    const stripe = useStripe();
    const elements = useElements();
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertInfo, setAlertInfo] = useState({ severity: 'info', message: '' });

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const hasFicheParam = queryParams.get('hasFiche');
        console.log('hasFicheParam:', hasFicheParam);
        setHasFiche(hasFicheParam === 'true');
      }, [location.search]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDonneesInscription((prevState) => ({
            ...prevState,
            [`etape${etape}`]: {
                ...prevState[`etape${etape}`],
                [name]: value,
            },
        }));
    };
    

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            const file = files[0];
            setDonneesInscription((prevState) => ({
                ...prevState,
                [`etape${etape}`]: {
                    ...prevState[`etape${etape}`],
                    [name]: file, // Met à jour avec le fichier sélectionné
                },
            }));
        }
    };

    const verifierChampsRemplis = () => {
        // Obtient les données de l'étape actuelle
        const donneesActuelles = donneesInscription[`etape${etape}`];
    
        // Vérifie chaque champ pour s'assurer qu'il n'est ni vide ni undefined
        for (const cle in donneesActuelles) {
            if (donneesActuelles.hasOwnProperty(cle)) {
                const valeur = donneesActuelles[cle];
    
                // Ici, on considère qu'une chaîne vide, undefined, ou null comme non rempli
                // Ajuste cette logique si tes critères sont différents
                if (valeur === '' || valeur === undefined || valeur === null) {
                    return false; // Retourne false dès qu'un champ non rempli est trouvé
                }
            }
        }
    
        return true; // Tous les champs sont remplis
    };

    const etapeSuivante = () => {
        if (etape === 1) {
            const { password, confirmPassword } = donneesInscription[`etape${etape}`];
    
            if (!validatePassword(password)) {
                setErreur('Le mot de passe ne respecte pas les critères requis.');
                return; // Empêche d'aller à l'étape suivante
            } else if (password !== confirmPassword) {
                setErreur('Les mots de passe ne correspondent pas.');
                return; // Empêche d'aller à l'étape suivante
            }
        }
    
        if (verifierChampsRemplis()) {
            // Si tous les champs sont remplis, passe à l'étape suivante
            if (hasFiche) {
                if (etape < 5) {
                    setEtape(etape + 1);
                } else {
                    envoyerInscription(); // Envoyer l'inscription si on est à la dernière étape pour hasFiche = true
                }
            } else {
                if (etape < 6) {
                    setEtape(etape + 1);
                } else {
                    envoyerInscription(); // Envoyer l'inscription si on est à la dernière étape pour hasFiche = false
                }
            }
        } else {
            // Sinon, affiche un message d'erreur ou gère le cas des champs non remplis comme tu le souhaites
            alert("Veuillez remplir tous les champs avant de continuer.");
            return; // Empêche d'aller à l'étape suivante
        }
        setErreur(''); // Réinitialise l'erreur si tout va bien
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    };
    const etapePrecedente = () => {
        setEtape(etape - 1);
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
    };
    
    const showAlert = (severity, message) => {
        setAlertInfo({ severity, message });
        setAlertOpen(true);
    };

    const envoyerInscription = async () => {
        if (!stripe || !elements) {
            console.log("Stripe n'est pas encore prêt");
            return;
        }
    
        const cardElement = elements.getElement(CardNumberElement);
    

        if (!hasFiche) {
            if (!cardElement) {
                console.log("Élément de carte non trouvé");
                return;
            }
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });
            console.log('paymentMethod:', paymentMethod);
    
            if (error) {
                console.log('[error]', error);
                return;
            }
            donneesInscription.etape6.paymentMethodId = paymentMethod.id;
        }

        setIsLoading(true); // Commence le chargement
        // Attends une mise à jour de l'état
        await new Promise(resolve => setTimeout(resolve, 0));

        // Utilisation de FormData pour inclure les fichiers et les données textuelles
        const formData = new FormData();


        // Ajoute les données textuelles
        formData.append('key', donneesInscription.key);

        // Ajout des champs de l'étape 1
        formData.append('etape1[password]', donneesInscription.etape1.password);
        formData.append('etape1[confirmPassword]', donneesInscription.etape1.confirmPassword);
        
        // Ajout des champs de l'étape 2
        formData.append('etape2[nom]', donneesInscription.etape2.nom);
        formData.append('etape2[prenom]', donneesInscription.etape2.prenom);
        formData.append('etape2[adresse]', donneesInscription.etape2.adresse);
        formData.append('etape2[codepostal]', donneesInscription.etape2.codepostal);
        formData.append('etape2[ville]', donneesInscription.etape2.ville);
        formData.append('etape2[telephone]', donneesInscription.etape2.telephone);
        
        // Ajout des champs de l'étape 3 (y compris le fichier si présent)
        formData.append('etape3[marquevehicule]', donneesInscription.etape3.marquevehicule);
        formData.append('etape3[modele]', donneesInscription.etape3.modele);
        formData.append('etape3[annee]', donneesInscription.etape3.annee);
        formData.append('etape3[couleurvehicule]', donneesInscription.etape3.couleurvehicule);
        formData.append('etape3[pecPMR]', donneesInscription.etape3.pecPMR);
        formData.append('etape3[immatriculation]', donneesInscription.etape3.immatriculation);
        formData.append('etape3[numSerie]', donneesInscription.etape3.numSerie);
        if (donneesInscription.etape3.controletechnique instanceof File) {
            formData.append('controletechnique', donneesInscription.etape3.controletechnique);
        }
        // Étape 4 - pour chaque fichier dans l'étape 4
        Object.keys(donneesInscription.etape4).forEach(cle => {
            if (donneesInscription.etape4[cle] instanceof File) {
                formData.append(cle, donneesInscription.etape4[cle]);
            }
        });

        // Ajout des champs de l'étape 5
        formData.append('etape5[numPermis]', donneesInscription.etape5.numPermis);
        formData.append('etape5[dateDel]', donneesInscription.etape5.dateDel);
        formData.append('etape5[dateExpi]', donneesInscription.etape5.dateExpi);

        // Ajout des champs de l'étape 6
        if (!hasFiche) {
            formData.append('etape6[paymentMethodId]', donneesInscription.etape6.paymentMethodId);
        }

        // Ajoute les fichiers



        try {
            const response = await fetch(`${apiUrl}/api/users/completetaxi`, {
                method: 'POST',
                body: formData, // Pas besoin de spécifier 'Content-Type', FormData le fait automatiquement
            });

            if (!response.ok) throw new Error('Réponse du réseau non OK');

            const responseData = await response.json();
            showAlert('success', 'Votre compte a correctement été crée il passe maintenant en statut en attente de validation. Vous allez être redirigé vers la page de connexion. ');
            navigate('/');  // Redirige vers la page d'accueil
        } 
        catch (error) {
            if (error.message.includes('Stripe')) {
                showAlert('error', 'Erreur de paiement Stripe.');
            } else {
                showAlert('error', 'Erreur lors de la communication avec la base de données.');
            }
        } finally {
            setIsLoading(false); // Arrête le chargement
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const hasFicheParam = queryParams.get('hasFiche');
        console.log('hasFicheParam:', hasFicheParam);
        setHasFiche(hasFicheParam === 'true');
    
        // Appel à l'API pour récupérer les informations du produit
        const fetchProductInfo = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${apiUrl}/api/inscription/complete/${key}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
    
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des informations du produit');
                }
    
                const data = await response.json();
                setProductInfo(data.product);
                setPriceInfo(data.price.data[0]); // Assuming you want the first price
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                setIsLoading(false);
            }
        };
        if (!hasFicheParam) {
            fetchProductInfo();
        }
    }, [location.search, apiUrl, key]);


    const renderEtape = () => {
        switch (etape) {
        case 1:
            return <Etape1 donneesInscription={donneesInscription} majDonnees={handleChange} handleFileChange={handleFileChange} />;
        case 2:
            return <Etape2 donneesInscription={donneesInscription} majDonnees={handleChange} handleFileChange={handleFileChange} />;
        case 3:
            return <Etape3 donneesInscription={donneesInscription} majDonnees={handleChange} handleFileChange={handleFileChange} />;
        case 4:
            return <Etape4 donneesInscription={donneesInscription} majDonnees={handleChange} handleFileChange={handleFileChange} />;
       case 5:
            return <Etape5 donneesInscription={donneesInscription} majDonnees={handleChange} handleFileChange={handleFileChange} />;
        case 6:
            if (hasFiche) {
                return null;
            } else {
                return <Etape6 donneesInscription={donneesInscription} majDonnees={handleChange} productInfo={productInfo} priceInfo={priceInfo} />;
                
            }
        default:
            return <Etape1 majDonnees={handleChange} handleFileChange={handleFileChange} />;
        }
    };

    return (
        <Box sx={{
            backgroundColor: "#F5F5F5",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '400px', 
            margin: 'auto',
            padding: '20px',
            borderRadius: '7px',
            marginTop: '10%'
        }}>
            {renderEtape()}
            <p style={{ color: 'red' }}>{erreur}</p>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                {etape > 1 && (
                    <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={etapePrecedente}>
                        Étape Précédente
                    </Button>
                )}
                {(etape < 5 || (!hasFiche && etape < 6)) ? (
                    <Button variant="contained" color="success" onClick={etapeSuivante} endIcon={<ArrowForwardIcon />}>
                        Étape Suivante
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="success"
                        onClick={envoyerInscription}
                        endIcon={isLoading ? <CircularProgress size={24} /> : <SendIcon />}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Envoi en cours...' : "S'inscrire"}
                    </Button>
                )}
            </Box>
            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity={alertInfo.severity} sx={{ width: '100%' }}>
                    {alertInfo.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default InscriptionTaxi;

function Etape1({ donneesInscription, majDonnees }) {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChangePassword = (event) => {
        setPassword(event.target.value);
        majDonnees({ password: event.target.value }, 1);
    };

    const handleChangeConfirmPassword = (event) => {
        setConfirmPassword(event.target.value);
        majDonnees({ confirmPassword: event.target.value }, 1);
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();

    return (
        <div>
            Étape 1: Choisissez votre mot de passe
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-password">Mot de passe</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        onChange={majDonnees}
                        value={donneesInscription.etape1.password}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        }
                    />
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-password">Confirmez le mot de passe</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        name="confirmPassword"
                        onChange={majDonnees}
                        value={donneesInscription.etape1.confirmPassword}
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        }
                    />
                </FormControl>
            </Box>
            <small>Le mot de passe doit contenir au moins : <br/>
            <ul>
                <li>8 caractères</li>
                <li>1 majuscule</li>
                <li>1 minuscule</li>
                <li>1 chiffre</li>
                <li>1 caractère spécial (!@#$%^&*(),.?":{}|<>)</></li>
            </ul>
            </small>
            {/* Ajoute d'autres champs au besoin */}
        </div>
    );
}
  
function Etape2({ donneesInscription, majDonnees }) {
    // Similaire à Etape1, adapte les champs nécessaires
    return (
        <div>
            Étape 2: Identité
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel >Nom</InputLabel>
                    <Input
                        id="standard"
                        name='nom'
                        value={donneesInscription.etape2.nom}
                        onChange={majDonnees}
                    />
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel >Prénom</InputLabel>
                    <Input
                        id="standard"
                        name="prenom"
                        value={donneesInscription.etape2.prenom}
                        onChange={majDonnees}
                    />
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel >Adresse</InputLabel>
                    <Input
                        id="standard"
                        name="adresse"
                        value={donneesInscription.etape2.adresse}
                        onChange={majDonnees}
                    />
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel >Code postale</InputLabel>
                    <Input
                        id="standard"
                        name="codepostal"
                        value={donneesInscription.etape2.codepostal}
                        onChange={majDonnees}
                    />
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel >Ville</InputLabel>
                    <Input
                        id="standard"
                        name="ville"
                        value={donneesInscription.etape2.ville}
                        onChange={majDonnees}
                    />
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel >Numéro de téléphone</InputLabel>
                    <Input
                        id="standard"
                        name="telephone"
                        value={donneesInscription.etape2.telephone}
                        onChange={majDonnees}
                    />
                </FormControl>
            </Box>
        </div>);
}

function Etape3({ donneesInscription, majDonnees, handleFileChange }) {
    // Similaire à Etape1 et Etape2, adapte les champs nécessaires
    return (
        <div>
            Étape 3: Véhicule
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel >Marque du véhicule</InputLabel>
                    <Input
                        id="standard"
                        name='marquevehicule'
                        value={donneesInscription.etape3.marquevehicule}
                        onChange={majDonnees}
                    />
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel >Modèle</InputLabel>
                    <Input
                        id="standard"
                        name='modele'
                        value={donneesInscription.etape3.modele}
                        onChange={majDonnees}
                    />
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel >Année</InputLabel>
                    <Input
                        id="standard"
                        name='annee'
                        type="number"
                        value={donneesInscription.etape3.annee}
                        onChange={majDonnees}
                    />
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel >Couleur du véhicule</InputLabel>
                    <Input
                        id="standard"
                        name='couleurvehicule'
                        value={donneesInscription.etape3.couleurvehicule}
                        onChange={majDonnees}
                    />
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel >Numéro de série</InputLabel>
                    <Input
                        id="standard"
                        name='numSerie'
                        value={donneesInscription.etape3.numSerie}
                        onChange={majDonnees}
                    />
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <FormControl fullWidth sx={{ m: 1, width: '25ch' }} variant="standard">
                <InputLabel id="pecPMR-label">Prise en charge PMR</InputLabel>
                <Select
                    labelId="pecPMR-label"
                    id="pecPMR-select"
                    name='pecPMR'
                    value={donneesInscription.etape3.pecPMR}
                    onChange={majDonnees}
                    label="Prise en charge PMR"
                >
                    <MenuItem value="Oui">Oui</MenuItem>
                    <MenuItem value="Non">Non</MenuItem>
                </Select>
            </FormControl>
        </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel >Immatriculation du véhicule</InputLabel>
                    <Input
                        id="standard"
                        name='immatriculation'
                        value={donneesInscription.etape3.immatriculation}
                        onChange={majDonnees}
                    />
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
                    Controle technique
                    <input 
                    hidden 
                    type="file" 
                    name="controletechnique" 
                    accept="image/*,.pdf"
                    onChange={handleFileChange} />
                </Button>
            </Box>
        </div>);
}

function Etape4({ donneesInscription, majDonnees, handleFileChange }) {
    // Similaire à Etape1, Etape2 et Etape3, adapte les champs nécessaires
    return (
        <div>
            Étape 4: Téléchargez vos document
            <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: '16px' }}>
                <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
                    KBIS
                    <input 
                        hidden 
                        type="file" 
                        name="KBIS" 
                        accept="image/*,.pdf"
                        onChange={handleFileChange} />
                </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: '16px' }}>
                <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
                    Attestation d'assurance
                    <input 
                    hidden 
                    type="file" 
                    name="attestassurance" 
                    accept="image/*,.pdf"
                    onChange={handleFileChange} />
                </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: '16px' }}>
                <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
                Autorisation de stationnement ou arreté municipale
                    <input 
                    hidden 
                    type="file" 
                    name="autostationnement" 
                    accept="image/*,.pdf"
                    onChange={handleFileChange} />
                </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: '16px' }}>
                <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
                Attestation de stage continue
                    <input 
                    hidden 
                    type="file" 
                    name="atteststagecontinue" 
                    accept="image/*,.pdf"
                    onChange={handleFileChange} />
                </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: '16px' }}>
                <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
                Attestation médicale
                    <input 
                    hidden 
                    type="file" 
                    name="attestmedicale" 
                    accept="image/*,.pdf"
                    onChange={handleFileChange} />
                </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: '16px' }}>
                <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
                Carte professionnelle
                    <input 
                    hidden 
                    type="file" 
                    name="cartepro" 
                    accept="image/*,.pdf"
                    onChange={handleFileChange} />
                </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: '16px' }}>
                <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
                Permis de conduire
                    <input 
                    hidden 
                    type="file" 
                    name="permis" 
                    accept="image/*,.pdf"
                    onChange={handleFileChange} />
                </Button>
            </Box>
        </div>
        );
}

function Etape5 ({ donneesInscription, majDonnees }) {
    return (
        <div>
            Étape 5: Permis de conduire
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel >Numéro de permis</InputLabel>
                    <Input
                        id="standard"
                        name='numPermis'
                        value={donneesInscription.etape5.numPermis}
                        onChange={majDonnees}
                    />
                </FormControl>
            </Box>
            
        
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
    <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
        <TextField
            id="date-delivrance"
            label="Date de délivrance"
            type="date"
            name='dateDel'
            value={donneesInscription.etape5.dateDel}
            onChange={majDonnees}
            InputLabelProps={{
                shrink: true,
            }}
            variant="standard"
        />
    </FormControl>
</Box>
<Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
    <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
        <TextField
            id="date-expiration"
            label="Date d'expiration"
            type="date"
            name='dateExpi'
            value={donneesInscription.etape5.dateExpi}
            onChange={majDonnees}
            InputLabelProps={{
                shrink: true,
            }}
            variant="standard"
        />
    </FormControl>
</Box>
        </div>
    );
}


function Etape6({ donneesInscription, majDonnees, productInfo, priceInfo }) {
    const CARD_ELEMENT_OPTIONS = {
        style: {
            base: {
                color: "#000000",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#aab7c4"
                },
                padding: '10px 12px', // Ajoute un padding pour éviter que les éléments soient collés
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        }
    };

    return (
        <div>
            Étape 6: Paiement
            <Box>
                {productInfo && priceInfo && (
                    <div>
                        <h3>{productInfo.name}</h3>
                        <p>{productInfo.description}</p>
                        <p>Prix: {(priceInfo.unit_amount / 100).toFixed(2)} {priceInfo.currency.toUpperCase()}</p>
                    </div>
                )}
                <label style={{ color: '#000', display: 'block', marginBottom: '10px' }}>
                    Numéro de carte
                    <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
                </label>
                <label style={{ color: '#000', display: 'block', marginBottom: '10px' }}>
                    Date d'expiration
                    <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
                </label>
                <label style={{ color: '#000', display: 'block', marginBottom: '10px' }}>
                    CVC
                    <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
                </label>
            </Box>
        </div>
    );
}