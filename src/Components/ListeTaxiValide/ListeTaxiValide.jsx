import React , {useState, useEffect} from 'react';
import './ListeTaxiValide.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Collapse, Box, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon, KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';

function Row({ row }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  const [open, setOpen] = useState(false);
  const [openRefuseDialog, setOpenRefuseDialog] = useState(false);
  const [refuseMessage, setRefuseMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleViewPdf = (fic) => {
    window.open(`${apiUrl}/files/${fic}`, '_blank');
  };
  const handleClickValide = async (row) => {
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

      // Mettre à jour l'état ou la UI pour refléter la validation du bon
      console.log("Bon validé avec succès", data.message);
      // Vous pouvez également recharger les bons ici pour mettre à jour les données affichées
    } catch (error) {
        console.error('Erreur lors de la validation du bon:', error);
        // Gérer l'erreur ici (par exemple, afficher un message d'erreur)
    }
  }

  const handleClickRefuse = async (row) => {
    setSelectedUserId(row.idFiche);
    setOpenRefuseDialog(true);
  }

  const handleRefuse = async (row) => {
    try {
      const response = await fetch(`${apiUrl}/api/users/refuseuser`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              idFiche: row.idFiche,
              message: refuseMessage
          })
      });

      const data = await response.json();
      if (!response.ok) {
          throw new Error(data.error || "Erreur lors de la validation de l'inscription");
      }

      // Mettre à jour l'état ou la UI pour refléter la validation du bon
      console.log("Inscription refusé avec succès", data.message);
      // Vous pouvez également recharger les bons ici pour mettre à jour les données affichées
    } catch (error) {
        console.error("Erreur lors de la validation de l'inscription:", error);
        // Gérer l'erreur ici (par exemple, afficher un message d'erreur)
    }
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
              <Button onClick={() => handleRefuse(row)}>Confirmer</Button>
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
            <IconButton onClick={() => handleClickValide(row)}>
                <i className = "ri-check-line" color='green'></i>
            </IconButton>
            <IconButton onClick={() => handleClickRefuse(row)}>
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
                      <TableCell>Scan du permis</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                      <TableRow key={row.id}>
                        <TableCell>{row.permis.numPermis}</TableCell>
                        <TableCell>{row.permis.dateDel}</TableCell>
                        <TableCell>{row.permis.dateExpi}</TableCell>
                        <TableCell>                                    
                          <IconButton onClick={() => handleViewPdf(row.permis.ficPermis)}>
                            <i className = "ri-eye-line" color='green'></i>
                          </IconButton>
                        </TableCell>
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
                      <TableCell>Carte grise du véhicule</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                      <TableRow key={row.id}>
                        <TableCell>{row.vehicule.Marque}</TableCell>
                        <TableCell>{row.vehicule.Modele}</TableCell>
                        <TableCell>{row.vehicule.Annee}</TableCell>
                        <TableCell>{row.vehicule.numImmatriculation}</TableCell>
                        <TableCell>{row.vehicule.numSerie}</TableCell>
                        <TableCell>                                    
                          <IconButton onClick={() => handleViewPdf(row.vehicule.ficVehicule)}>
                            <i className = "ri-eye-line" color='green'></i>
                          </IconButton>
                        </TableCell>
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

    useEffect(() => {
        fetch(`${apiUrl}/api/users/taxinonvalide`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => setutilisateurs(data))
        .catch(error => console.error('Erreur lors de la récupération des taxs:', error));
    }, []);

    return (
        <div className="ListeTaxiValide">
            <h1>Liste des taxis non validés</h1>
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
                    <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {utilisateurs.map((user, index) => (
                    <Row key={index} row={user} />
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
        </div>
        
    )

}

export default ListeTaxiValide;