import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';


function InscriptionTaxi(props) {
    const [etape, setEtape] = useState(1);
    const { key } = useParams();
    const apiUrl = import.meta.env.VITE_API_URL;
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
            controletechnique: null,
        },
        etape4: {
            KBIS: null,
            attestassurance: null,
            autostationnement: null,
            atteststagecontinue: null,
            attestmedicale: null,
            cartepro: null,
        },
        etape5: {
            paymentMethodId: '',
        },
    });
    const [erreur, setErreur] = useState('');
    const stripe = useStripe();
    const elements = useElements();
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
            setEtape(etape + 1);
        } else {
            // Sinon, affiche un message d'erreur ou gère le cas des champs non remplis comme tu le souhaites
            alert("Veuillez remplir tous les champs avant de continuer.");
            return; // Empêche d'aller à l'étape suivante
        }
        setErreur(''); // Réinitialise l'erreur si tout va bien
        setEtape(etape + 1);
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



    const envoyerInscription = async () => {
        if (!stripe || !elements) {
            console.log("Stripe n'est pas encore prêt");
            return;
        }
    
        const cardElement = elements.getElement(CardNumberElement);
    
        if (!cardElement) {
            console.log("Élément de carte non trouvé");
            return;
        }
    
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });
    
        if (error) {
            console.log('[error]', error);
            return;
        }
    
        console.log('[PaymentMethod]', paymentMethod);
        console.log('Envoi des données à l\'API:', donneesInscription);
        
    // Attends une mise à jour de l'état
    await new Promise(resolve => setTimeout(resolve, 0));

    // Utilisation de FormData pour inclure les fichiers et les données textuelles
    const formData = new FormData();


    formData.append('key', donneesInscription.key);
    // Ajoute les données textuelles
    Object.keys(donneesInscription).forEach(etape => {
        Object.keys(donneesInscription[etape]).forEach(cle => {
            const valeur = donneesInscription[etape][cle];
            if (typeof valeur !== 'object' || valeur === null) { // Assure-toi que c'est du texte ou null
                formData.append(`${etape}[${cle}]`, valeur);
            }
        });
    });

    // Ajoute les fichiers
    formData.append('controletechnique', donneesInscription.etape3.controletechnique);
    Object.keys(donneesInscription.etape4).forEach(cle => {
        if (donneesInscription.etape4[cle] instanceof File) {
            formData.append(cle, donneesInscription.etape4[cle]);
        }
    });
    try {
        const response = await fetch(`${apiUrl}/api/users/completetaxi`, {
            method: 'POST',
            body: formData, // Pas besoin de spécifier 'Content-Type', FormData le fait automatiquement
        });

        if (!response.ok) throw new Error('Réponse du réseau non OK');

        const responseData = await response.json();
        console.log('Réponse de l\'API:', responseData);
        // Gère la réponse ici
    } catch (error) {
        console.error('Erreur lors de l\'envoi des données:', error);
    }
    console.log('formData:', formData);

        // Ici, tu pourrais utiliser fetch ou axios pour envoyer `donneesInscription` à ton API
    };


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
            return (
                
                    <Etape5 />
                
            );
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
            {etape > 1 && (
            <button onClick={etapePrecedente}>Étape Précédente</button>
            )}
            {etape < 5 ? (
            <button onClick={etapeSuivante}>Étape Suivante</button>
            ) : (
            <button onClick={envoyerInscription}>Envoyer Inscription</button>
            )}
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
                    <InputLabel >Prise en charge PMR</InputLabel>
                    <Input
                        id="standard"
                        name='pecPMR'
                        value={donneesInscription.etape3.pecPMR}
                        onChange={majDonnees}
                    />
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
            Étape 4: Document
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
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
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
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
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
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
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
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
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
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
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
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
        </div>
        );
}

function Etape5({ donneesInscription, majDonnees }) {

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
            Étape 5: Paiement
            <Box>
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
        </div>);
}