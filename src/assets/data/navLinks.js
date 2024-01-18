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
    roles:[1,4,5]
  },
  {
    path: "/Dashboard/patient",
    icon: "ri-taxi-line",
    display: "Mes patients",
    roles:[1,4,5]
  },
  {
    path: "/Dashboard/settings",
    icon: "ri-shopping-bag-line",
    display: "Parametres",
    roles:[1,2,3,4,5]
  },
  {
    path: "/Dashboard/Planning",
    icon: "ri-shopping-bag-line",
    display: "Planning",
    roles:[1,3]
  },
  {
    path: "/Dashboard/ListeUtilisateurs",
    icon: "ri-shopping-bag-line",
    display: "Liste des utilisateurs",
    roles:[1]
  },
  {
    path: "/Dashboard/BonSuperviseur",
    icon: "ri-shopping-bag-line",
    display: "Bon de transport a valider",
    roles:[1]
  },
  {
    path: "/Dashboard/BonTransport",
    icon: "ri-shopping-bag-line",
    display: "Ajouter un bon de transport",
    roles:[5]
  },
];

export default navLinks;
