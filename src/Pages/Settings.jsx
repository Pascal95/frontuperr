import React, {useState, useEffect } from "react";
import "../styles/settings.css";

const Settings = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const apiUrl = import.meta.env.REACT_APP_API_URL;

  const [formFiche, setformFiche] =useState({
    nom: '',
    prenom: '',
    adresse: '',
    ville: '',
    codepostal: '',
    mailcontact: '',
    telephone: '',
    role:'',
    idCNX:'',
    signature:'',
    idFicheMere:0,
    numSS:''
})
  const fetchUserProfile = (token) => {
    const url = `${apiUrl}/api/users/profile`;

    setLoading(true);
    fetch(url, {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
      setformFiche(data);
    })
    .catch(error => {
        setError(error.toString());
    })
    .finally(() => {
        setLoading(false);
    });
  };

  useEffect(() => {
    fetchUserProfile(token);
  }, [token]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setformFiche({ ...formFiche, [name]: value });
  }

  return (
    <div className="settings">
      <div className="settings__wrapper">
        <h2 className="settings__title">Settings</h2>

        <div className="settings__top">
          <button className="setting__btn">My Details</button>
          <button className="setting__btn active__btn">Profile</button>
          <button className="setting__btn">Password</button>
          <button className="setting__btn">Email</button>
          <button className="setting__btn">Notification</button>
        </div>

        <div className="details__form">
          <h2 className="profile__title">Profile</h2>
          <p className="profile__desc">
            Update your photo and personal details here
          </p>
          <form>
            <div className="form__group">
              <div>
                <label>Nom</label>
                <input 
                  type="text" 
                  placeholder="Nom" 
                  name="nom"
                  value={formFiche.nom}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label>Prénom</label>
                <input 
                  type="text" 
                  placeholder="Prénom" 
                  name="prenom"
                  value={formFiche.prenom}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form__group">
              <div>
                <label>Adresse</label>
                <input 
                  type="text" 
                  placeholder="Adresse" 
                  name="adresse"
                  value={formFiche.adresse}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label>Ville</label>
                <input 
                  type="text" 
                  placeholder="Ville" 
                  name="ville"
                  value={formFiche.ville}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form__group">
              <div>
                <label>Code postale</label>
                <input 
                  type="number" 
                  placeholder="95330" 
                  name="codepostal"
                  value={formFiche.codepostal}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label>Mail de contact</label>
                <input 
                  type="email" 
                  placeholder="azer@hotmail.fr"
                  name="mailcontact"
                  value={formFiche.mailcontact}
                  onChange={handleInputChange}
                  />
              </div>
            </div>
            <div className="form__group">
              <div>
                <label>Téléphone</label>
                <input 
                  type="number" 
                  placeholder="0778641376" 
                  name="telephone"
                  value={formFiche.telephone}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label>Numéro de sécurité sociale</label>
                <input 
                  type="number" 
                  placeholder="123456789112234" 
                  name="numSS"
                  value={formFiche.numSS}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form__group">
              <div>
                <label>Photo de profil</label>
                <p className="profile-img__desc">
                  Cette photo sera affiché sur votre profil
                </p>
                <input type="file" placeholder="choose file" />
              </div>

              <div className="profile__img-btns">
                <button className="update__btn">Mettre a jour</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
