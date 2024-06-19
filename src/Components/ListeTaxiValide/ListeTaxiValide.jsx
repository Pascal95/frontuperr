import React , {useState, useEffect} from 'react';
import './ListeTaxiValide.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Collapse, Box, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon, KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';

function Row({ row, handleClickValide, handleClickRefuse, handleDownload }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  const [open, setOpen] = useState(false);
  const [openRefuseDialog, setOpenRefuseDialog] = useState(false);
  const [refuseMessage, setRefuseMessage] = useState('');



  const handleOpenRefuseDialog = (row) => {
    setOpenRefuseDialog(true);
  }

  const handleConfirmRefuse = () => {
    handleClickRefuse(row, refuseMessage);
    setOpenRefuseDialog(false);
  }
  

    return (
      <>
        <Dialog open={openRefuseDialog} onClose={() => setOpenRefuseDialog(false)}>
          <DialogTitle>Refuser l'inscription</DialogTitle>
          <DialogContent>
              <DialogContentText>
                  Veuillez fournir une raison pour le refus de l'inscription.
              </DialogContentText>
              <TextField
                  autoFocus
                  margin="dense"
                  id="refuseMessage"
                  label="Message de Refus"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={refuseMessage}
                  onChange={(e) => setRefuseMessage(e.target.value)}
              />
          </DialogContent>
          <DialogActions>
              <Button onClick={() => setOpenRefuseDialog(false)}>Annuler</Button>
              <Button onClick={handleConfirmRefuse}>Confirmer</Button>
          </DialogActions>
        </Dialog>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              size="small"
              onClick={() => setOpen(!open)}
              aria-label="expand row"
              aria-expanded={open}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">{row.nom}</TableCell>
          <TableCell>{row.prenom}</TableCell>
          <TableCell>{row.adresse}</TableCell>
          <TableCell>{row.ville}</TableCell>
          <TableCell>{row.codepostal}</TableCell>
          <TableCell>{row.mailcontact}</TableCell>
          <TableCell>{row.telephone}</TableCell>
          <TableCell>
            <IconButton onClick={() => handleDownload(row)}>
              <i class="ri-folder-download-fill"></i>
            </IconButton>
          </TableCell>
          <TableCell>
            <IconButton onClick={() => handleClickValide(row)}>
                <i className = "ri-check-line" color='green'></i>
            </IconButton>
            <IconButton onClick={() => handleOpenRefuseDialog(row)}>
                <i className = "ri-close-line" color='red'></i>
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant='h6' gutterBottom component={'div'}>
                    Information du permis
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Numéro du permis</TableCell>
                      <TableCell>Date de délivrance</TableCell>
                      <TableCell>Date d'expiration</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                      <TableRow key={row.id}>
                        <TableCell>{row.numPermis}</TableCell>
                        <TableCell>{row.dateDel}</TableCell>
                        <TableCell>{row.dateExpi}</TableCell>

                      </TableRow>
                  </TableBody>
                </Table>
                <Typography variant='h6' gutterBottom component={'div'}>
                    Information du vehicule
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Marque</TableCell>
                      <TableCell>Modele</TableCell>
                      <TableCell>Année</TableCell>
                      <TableCell>Numéro d'immatriculation</TableCell>
                      <TableCell>Numéro de série</TableCell>
                      <TableCell>Prise en charge PMR</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                      <TableRow key={row.id}>
                        <TableCell>{row.Marque}</TableCell>
                        <TableCell>{row.Modele}</TableCell>
                        <TableCell>{row.Annee}</TableCell>
                        <TableCell>{row.numImmatriculation}</TableCell>
                        <TableCell>{row.numSerie}</TableCell>
                        <TableCell>{row.pecPMR}</TableCell>
                      </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
}

function ListeTaxiValide(props) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    const [utilisateurs,setutilisateurs] = useState([]);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const fetchTaxis = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrl}/api/users/taxinonvalide`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setutilisateurs(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des taxs:', error);
        setSnackbar({ open: true, message: 'Erreur lors de la récupération des taxs', severity: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      fetchTaxis();
    }, []);

    const handleClickValide = async (row) => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrl}/api/users/valideuser`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idFiche: row.idFiche,
          })
        });
  
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la validation du bon');
        }
  
        console.log("Bon validé avec succès", data.message);
        setSnackbar({ open: true, message: 'Bon validé avec succès', severity: 'success' });
        fetchTaxis(); // Actualiser la liste des taxis
      } catch (error) {
        console.error('Erreur lors de la validation du bon:', error);
        setSnackbar({ open: true, message: error.message, severity: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleClickRefuse = async (row) => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrl}/api/users/refuseuser`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idFiche: row.idFiche,
            message: row.message
          })
        });
  
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Erreur lors de la validation de l'inscription");
        }
  
        console.log("Inscription refusé avec succès", data.message);
        setSnackbar({ open: true, message: 'Inscription refusée avec succès', severity: 'success' });
        fetchTaxis(); // Actualiser la liste des taxis
      } catch (error) {
        console.error("Erreur lors de la validation de l'inscription:", error);
        setSnackbar({ open: true, message: error.message, severity: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleDownload = async (row) => {
      setIsLoading(true);
      try {
        const response = await fetch(apiUrl+ '/api/users/doc/' + row.USR_KEY, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'file.zip');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        setSnackbar({ open: true, message: 'Fichier téléchargé avec succès', severity: 'success' });
      } catch (error) {
        console.error('Failed to download file:', error);
        setSnackbar({ open: true, message: 'Échec du téléchargement du fichier', severity: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleCloseSnackbar = () => {
      setSnackbar({ ...snackbar, open: false });
    };

    return (
        <div className="ListeTaxiValide">
                            <Typography variant="h4" gutterBottom color="white">
                    Taxi à valider
                </Typography>
            <TableContainer component={Paper}>
                <Table>
                <TableHead>
                    <TableRow>
                    <TableCell />
                    <TableCell>Nom</TableCell>
                    <TableCell>Prénom</TableCell>
                    <TableCell>Adresse</TableCell>
                    <TableCell>Ville</TableCell>
                    <TableCell>Code Postal</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Téléphone</TableCell>
                    <TableCell>Télécharger</TableCell>
                    <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {utilisateurs.map((user, index) => (
                                  <Row
                                  key={index}
                                  row={user}
                                  handleClickValide={handleClickValide}
                                  handleClickRefuse={handleClickRefuse}
                                  handleDownload={handleDownload}
                                />
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
        </div>
        
    )

}

export default ListeTaxiValide;