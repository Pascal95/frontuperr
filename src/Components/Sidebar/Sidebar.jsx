import React ,{useState, useEffect} from 'react';
import navLinks from "../../assets/data/navLinks";
import { NavLink } from "react-router-dom";
import "./sidebar.css";
import logo from "../../assets/img/Logo_UPERMED.png"

function Sidebar(props) {
  const token = localStorage.getItem('token');
  const apiUrl = import.meta.env.VITE_API_URL;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
  return (
      <div className="sidebar">
        <div className="sidebar__top">
        
          <h2>
          <img src={logo} className="logoSidebar"/>
            UperMed
          </h2>
        </div>
  
        <div className="sidebar__content">
          <div className="menu">
            <ul className="nav__list">
            {navLinks
              .filter(item => item.roles.includes(formFiche.role))
              .map((item, index) => (
                <li className="nav__item" key={index}>
                  <NavLink
                    to={item.path}
                    className={(navClass) =>
                      navClass.isActive ? "nav__active nav__link" : "nav__link"
                    }
                  >
                    <i className={item.icon}></i>
  
                    {item.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
  
          <div className="sidebar__bottom">
            <span>
              <i className="ri-logout-circle-r-line"></i> Se déconnecter
            </span>
          </div>
        </div>
      </div>
    );
}

export default Sidebar;