import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function InscriptPaiement(props) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [clientSecret, setClientSecret] = useState('');
    const [paymentIntentId, setPaymentIntentId] = useState('');

    useEffect(() => {
        const fetchProduit = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/inscriptuser/product/prod_QarMlruvfZrJsg`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération du produit');
                }
    
                const data = await response.json();
                setProduct(data);
    
                // Créer un PaymentIntent et récupérer le clientSecret
                const paymentIntentResponse = await fetch(`${import.meta.env.VITE_API_URL}/inscriptuser/create-payment-intent`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ amount: 1000 }) // Remplacer par le montant réel
                });
    
                if (!paymentIntentResponse.ok) {
                    throw new Error('Erreur lors de la création du PaymentIntent');
                }
    
                const paymentIntentData = await paymentIntentResponse.json();
                setClientSecret(paymentIntentData.clientSecret);
                setPaymentIntentId(paymentIntentData.id); // Enregistrer l'ID du PaymentIntent pour l'utiliser plus tard
                props.data.paymentIntentId = paymentIntentData.id;
    
            } catch (err) {
                console.error("Erreur lors de la récupération du produit", err);
                setErrors({ clientSecret: "Erreur lors de la récupération du produit" });
            }
        };
    
        fetchProduit();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
    
        if (!stripe || !elements || !clientSecret) {
            setIsLoading(false);
            return;
        }
    
        const cardElement = elements.getElement(CardNumberElement);
    
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement
            }
        });
    
        if (error) {
            console.error("Erreur lors de la confirmation du paiement", error);
            setErrors({ paiement: "Erreur lors de la confirmation du paiement" });
            setIsLoading(false);
        } else {
            props.data.IdStripe = paymentIntent.id;
            props.allerAEtapeSuivante();
            console.log(props.data);
        }
    };

    return (
        <Box
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 1
            }}
        >
            <Typography variant="h5">Paiement</Typography>
            <Typography variant="body1">Montant à payer: 10€</Typography>
            <Typography variant="body1">Description: {product.description}</Typography>
            <Typography variant="body1">Méthode de paiement: Carte bancaire</Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex',
                    flexDirection: 'column',
                    gap: 2 }}>
                    <CardNumberElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                    <CardExpiryElement />
                    <CardCvcElement />
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    sx={{ mt: 2 }}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Payer 10€'}
                </Button>
            </form>
            {errors.clientSecret && <p>{errors.clientSecret}</p>}
            {errors.paiement && <p>{errors.paiement}</p>}
        </Box>
    );
}

export default InscriptPaiement;