const navLinks = [
  {
    path: "/Dashboard/accueil",
    icon: "ri-apps-2-line",
    display: "Réserver un taxi",
    roles:[1,4,5]
  },
  {
    path: "/Dashboard/courses",
    icon: "ri-user-2-line",
    display: "Mes courses",
    roles:[3,4,5]
  },
  {
    path: "/Dashboard/patient",
    icon: "ri-taxi-line",
    display: "Mes patients",
    roles:[1,4,5]
  },
  {
    path: "/Dashboard/ListeTaxiValide",
    icon: "ri-shopping-bag-line",
    display: "Liste des taxis à valider",
    roles:[1]
  },
  {
    path: "/Dashboard/AncienneCourse",
    icon: "ri-shopping-bag-line",
    display: "Anciennes courses",
    roles:[1,3,4,5]
  },
  {
    path: "/Dashboard/BonSuperviseur",
    icon: "ri-shopping-bag-line",
    display: "Bon de transport a valider",
    roles:[]
  },
  {
    path: "/Dashboard/CreerUtilisateur",
    icon: "ri-shopping-bag-line",
    display: "Créer un utilisateur",
    roles:[1]
  },
  {
    path: "/Dashboard/BonTransport",
    icon: "ri-shopping-bag-line",
    display: "Ajouter un bon de transport",
    roles:[]
  },
  {
    path: "/Dashboard/Disponibilite",
    icon: "ri-shopping-bag-line",
    display: "Mes disponibilités",
    roles:[3]
  },
  {
    path: "/Dashboard/Messages",
    icon: "ri-shopping-bag-line",
    display: "Mes messages",
    roles:[3,4,5]
  },
  {
    path: "/Dashboard/NewMessages",
    icon: "ri-shopping-bag-line",
    display: "Envoyer un message",
    roles:[1]
  },
  {
    path: "/Dashboard/InscriptionComplet",
    icon: "ri-alert-line",
    display: "Inscription à compléter",
    roles: [] // Assumons que seul le rôle 3 (Taxi) a besoin de compléter l'inscription
  },
  {
    path: "/Dashboard/CourseSup",
    icon: "ri-shopping-bag-line",
    display: "Les prochaines courses",
    roles:[1]
  },
  {
    path: "/Dashboard/ListeUtilisateur",
    icon: "ri-shopping-bag-line",
    display: "Liste des utilisateurs",
    roles:[1]
  },
  {
    path: "/Dashboard/AjoutFichier",
    icon: "ri-shopping-bag-line",
    display: "Ajouter un fichier",
    roles:[1]
  },
  {
    path: "/Dashboard/settings",
    icon: "ri-shopping-bag-line",
    display: "Parametres",
    roles:[]
  },
];

export default navLinks;
