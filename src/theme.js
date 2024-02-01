import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#808191', // Votre couleur primaire
    },
    // Autres personnalisations du thème si nécessaire
  },
  components: {
    MuiTextField: {
      // Supprimez cette section, les styles pour MuiTextField ne sont pas nécessaires ici
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#808191', // Couleur du label non focus
          '&.Mui-focused': {
            color: '#808191', // Couleur du label au focus
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // Ajoutez des styles pour la bordure ici si nécessaire
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#808191', // Couleur de la bordure
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#808191', // Couleur de la bordure au survol
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#808191', // Couleur de la bordure au focus
          },
        },
        input: {
          color: '#808191', // Couleur du texte saisi
        },
      },
    },
    // Ajoutez d'autres composants et styles si nécessaire
  },

});

export default theme;