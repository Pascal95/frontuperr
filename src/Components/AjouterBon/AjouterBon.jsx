import React, {useState, useEffect} from 'react';
import './AjouterBon.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';


function AjouterBon(props) {
    const [formData, setFormData] = React.useState({
        idFicheUser: '',
        drPrescripteur: '',
        dateEmission: '',
    });

    const [bonTransportFile, setBonTransportFile] = useState(null);
    const [bons, setBons] = useState([]);
    const [patients, setPatients] = useState([]);
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL;
    

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };


    const handleFileChange = (event) => {
        setBonTransportFile(event.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataApi = new FormData();
        formDataApi.append('idFicheUser', formData.idFicheUser);
        formDataApi.append('drPrescripteur', formData.drPrescripteur);
        formDataApi.append('dateEmission', formData.dateEmission);
        

        // Ajoutez le fichier permis si disponible
        if (bonTransportFile) {
            formDataApi.append('BonTransport', bonTransportFile);
        }
    
        try {
            const response = await fetch(`${apiUrl}/api/bon/bonfromcli`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataApi, // Ici, envoyez formData au lieu d'un JSON
                // Ne définissez pas l'en-tête 'Content-Type' ; il sera automatiquement défini par le navigateur
            });
    
            const api = await response.json();
            if (!response.ok) {
                throw new Error(api.erreur || 'Erreur lors de la soumission du formulaire');
            }
    
            console.log("Bon soumis avec succès", api);
            // Logique pour passer à l'étape suivante ou terminer le processus d'inscription
        } catch (err) {
            console.error("Erreur lors de la soumission de Bon", err);
            // Gérer l'erreur ici
        }
        // Ici, vous pouvez effectuer l'envoi de 'data' à votre API
        console.log('Envoi du formulaire', formData); // À remplacer par l'appel API
    };

    
    useEffect(() => {// Récupérez le token depuis le stockage local

        fetch(`${apiUrl}/api/bon`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Ajoutez l'en-tête Authorization avec le token
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => setBons(data.bons))
        .catch(error => console.error('Erreur lors de la récupération des bons:', error));
    }, []);

    const renderValidationStatus = (isValid) => {
        if (isValid === true) {
            return <i className = "ri-checkbox-circle-fill" color='green'></i>;
        } else if (isValid === false) {
            return <i className="ri-close-circle-fill" color='red'></i>;
        } else {
            return <i className="ri-loader-2-fill" color='orange'></i>;
        }
    };

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/users/mesusers`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des données');
                }

                const data = await response.json();
                setPatients(data.listeUser);
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
            }
        };

        fetchPatients();
    }, []);
    return (
        <div className="AjouterBon">
            <h2 className="AjouterBon__title">Ajouter un bon de transport</h2>
            <form onSubmit={handleSubmit}>
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Patient</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="idFicheUser"
                value={formData.idFicheUser}
                label="Patient"
                onChange={handleInputChange}
            >
                {patients.map((patient) => (
                    <MenuItem value={patient.idFiche}>{patient.nom} {patient.prenom}</MenuItem>
                ))}
            </Select>
            </FormControl>
            <div className='form__group'>

                <div>
                    <label htmlFor="">Nom du prescripteur</label>
                    <input type="text" name="drPrescripteur" id="drPrescripteur" placeholder="dr Lellouche" value={formData.drPrescripteur} onChange={handleInputChange}/>
                </div>
                <div>
                    <label htmlFor="">Date d'émission</label>
                    <input type="date" name="dateEmission" id="dateEmission" value={formData.dateEmission} onChange={handleInputChange}/>
                </div>
            </div>
            <div className='form__group'>
                <div>
                    <label htmlFor="">Bon de transport</label>
                    <input type="file" name="BonTransport" id="BonTransport" value={formData.BonTransport} onChange={handleFileChange}/>
                </div>
                <button  type="submit" className="btn-validate" >Ajouter un bon</button>
                </div>
            </form>
            <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Id Bon</TableCell>
                        <TableCell>Dr Prescripteur</TableCell>
                        <TableCell>Date Émission</TableCell>
                        <TableCell>Fichier Bon</TableCell>
                        <TableCell>Validé</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bons.map((bon) => (
                        <TableRow key={bon.idBon}>
                            <TableCell>{bon.idBon}</TableCell>
                            <TableCell>{bon.drPrescripteur}</TableCell>
                            <TableCell>{bon.dateEmission}</TableCell>
                            <TableCell>{bon.ficBon}</TableCell>
                            <TableCell>{renderValidationStatus(bon.Valide)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </div>
    );
}

export default AjouterBon;