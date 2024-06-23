import React, {useState, useEffect} from 'react';
import './AncienneCourse.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Box, Snackbar, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/fr';


function AncienneCourse(props) {
    const [courses, setCourses] = useState([]);
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL;
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
    const [isLoading, setIsLoading] = useState(false);
    const [openUploadDialog, setOpenUploadDialog] = useState(false);
    const [currentIdReservation, setCurrentIdReservation] = useState(null);
    const navigate = useNavigate();

    const renderStatusIcon = (etat) => {
        switch (etat) {
          case 2:
            return <HourglassTopIcon style={{ color: 'ff9500' }} />;
          case 3:
            return <DoneOutlineIcon style={{ color: '#08e300' }} />;
          case 4:
            return <PriorityHighIcon style={{ color: '#ff0000' }} />;
          default:
            return null; // ou un autre icône par défaut si nécessaire
        }
    };

    const formatDate = (dateString) => {
        return moment(dateString).locale('fr').format('DD/MM/YYYY HH:mm');
    };

    // Fonctions pour ouvrir et fermer le dialogue
    const handleOpenUploadDialog = (idReservation) => {
        setCurrentIdReservation(idReservation);
        setOpenUploadDialog(true);
    };

    const handleCloseUploadDialog = () => {
        setOpenUploadDialog(false);
    };
    function downloadFile(idReservation) {
        window.location.href = `${apiUrl}/api/reservation/download/${idReservation}`;
    }

    function uploadFile(idReservation) {
        // Cette fonction pourrait ouvrir un dialogue de fichier pour choisir un fichier à uploader
        // Pour simplifier, vous pouvez aussi déclencher cette action via un formulaire d'upload sur une modale
        handleOpenUploadDialog(idReservation);
        console.log("Ouvrir un formulaire pour uploader pour l'id", idReservation);
    }

    const handleFileUpload = async (file, idReservation) => {
        const formData = new FormData();
        formData.append('BonTransport', file);
        formData.append('idReservation', idReservation);
        

        try {
            const response = await fetch(`${apiUrl}/api/reservation/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.status === 401 || response.status === 403) {
                // Token is invalid or expired
                localStorage.removeItem('token');
                navigate('/');  // Redirect to login page
                throw new Error('Token is invalid or expired');
            }

            if (!response.ok) throw new Error('Network response was not ok.');

            
            // Gérer la réponse ici, par exemple en actualisant la liste des courses
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${apiUrl}/api/reservation/lastresa`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 401 || response.status === 403) {
                    // Token is invalid or expired
                    localStorage.removeItem('token');
                    navigate('/');  // Redirect to login page
                    throw new Error('Token is invalid or expired');
                }
                if (response.ok) {
                    const data = await response.json();
                    setCourses(data.reservations);
                } else {
                    setSnackbar({ open: true, message: 'Une erreur est survenue lors de la récupération des courses.', severity: 'error' });
                }
            } catch (error) {
                setSnackbar({ open: true, message: 'Une erreur est survenue lors de la récupération des courses.', severity: 'error' });
            }
            setIsLoading(false);
        };
        fetchCourses();
    }, [apiUrl, token]);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <div className="AncienneCourse">
            <h2 className='AncienneCourse__title'>Anciennes courses</h2>
            <TableContainer component={Paper}>
    <Table>
        <TableHead>
            <TableRow>
                <TableCell>Id Réservation</TableCell>
                <TableCell>Date de consultation</TableCell>
                <TableCell>Adresse de départ</TableCell>
                <TableCell>Adresse d'arrivée</TableCell>
                <TableCell>Etat</TableCell>
                <TableCell>Actions</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {courses.map((course) => (
                <TableRow key={course.idReservation}>
                    <TableCell>{course.idReservation}</TableCell>
                    <TableCell>{formatDate(course.HeureConsult)}</TableCell>
                    <TableCell>{course.AdresseDepart}</TableCell>
                    <TableCell>{course.AdresseArrive}</TableCell>
                    <TableCell>{renderStatusIcon(course.Etat)}</TableCell>
                    <TableCell>
                        {course.bonTransportPath ? (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => downloadFile(course.idReservation)}
                            >
                                Télécharger
                            </Button>
                        ) : (
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => uploadFile(course.idReservation)}
                            >
                                Upload
                            </Button>
                        )}
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
</TableContainer>

            {isLoading && <CircularProgress />}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            <UploadDialog
                open={openUploadDialog}
                onClose={handleCloseUploadDialog}
                onFileUpload={handleFileUpload}
                idReservation={currentIdReservation}
            />
        </div>
    );

}
export default AncienneCourse;

function UploadDialog({ open, onClose, onFileUpload, idReservation }) {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = () => {
        onFileUpload(file, idReservation);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Upload Bon de Transport</DialogTitle>
            <DialogContent>
                <TextField
                    type="file"
                    onChange={handleFileChange}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleUpload} disabled={!file}>Upload</Button>
            </DialogActions>
        </Dialog>
    );
}
