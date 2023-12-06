import React ,{useState} from 'react';
import { useParams } from 'react-router-dom';
import InscriptionEtape2 from '../Components/InscriptionEtape2';
import InscriptionTaxiPermis from '../Components/InscriptionTaxiPermis';
import InscriptionTaxiVehicule from '../Components/InscriptionTaxiVehicule';


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
            return <InscriptionEtape2 data={formData} onInputChange={handleInputChange} allerAEtapeSuivante={allerAEtapeSuivante} />;
        case 2:
            return formData.role === 'taxi' ? 
                <InscriptionTaxiPermis data={formData} onInputChange={handleInputChange} allerAEtapeSuivante={allerAEtapeSuivante} allerAEtapePrecedente={allerAEtapePrecedente} /> : 
                'Inscription Complète pour Utilisateur';
        case 3:
            return <InscriptionTaxiVehicule data={formData} onInputChange={handleInputChange} allerAEtapeSuivante={allerAEtapeSuivante} allerAEtapePrecedente={allerAEtapePrecedente} />;
        default:
            return 'Étape inconnue';
    }
}

export default InscriptionEtape;