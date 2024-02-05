import React, { useState, useEffect } from 'react';
import { Box, Grid, List, ListItem, ListItemText, Typography, Paper } from '@mui/material';
import './Message.css';

function Message(props) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                // Remplacer par l'URL réelle de votre API
                const response = await fetch(`${apiUrl}/api/messages`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                if (!response.ok) throw new Error('Erreur lors de la récupération des messages');
                const data = await response.json();
                setMessages(data); // Supposons que la réponse est directement le tableau des messages
            } catch (error) {
                console.error('Erreur lors de la récupération des messages:', error);
            }
        };
    
        fetchMessages();
    }, []);

    

    const handleSelectMessage = (message) => {
        setSelectedMessage(message);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    }


    return (
        <div className="Message">
            <h2 className='Message__title'>Messages</h2>
            {isLoading && <p>Chargement en cours...</p>}
            <Box sx={{ flexGrow: 1, overflow: 'hidden', px: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Paper elevation={3}>
                        <List component="nav">
                        {messages.map((message, index) => (
                            <ListItem
                                button
                                key={index}
                                selected={selectedMessage && selectedMessage.id === message.id}
                                onClick={() => handleSelectMessage(message)}
                            >
                                <ListItemText primary={message.objet} secondary={`${message.destinataire.nom} ${message.destinataire.prenom}`} />
                            </ListItem>
                        ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={8}>
                {selectedMessage ? (
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            {selectedMessage.objet}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            {`De: ${selectedMessage.destinataire.nom} ${selectedMessage.destinataire.prenom}`}
                        </Typography>
                        <Typography variant="body1">{selectedMessage.contenu}</Typography>
                    </Paper>
                ) : (
                    <Typography variant="body1">Sélectionnez un message pour lire son contenu.</Typography>
                )}
                </Grid>
            </Grid>
        </Box>
        </div>
    )
    

}
export default Message;