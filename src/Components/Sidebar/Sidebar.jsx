import React from 'react';
import navLinks from "../../assets/data/navLinks";
import { NavLink } from "react-router-dom";
import "./sidebar.css";
import logo from "../../assets/img/Logo_UPERMED.png"

function Sidebar(props) {
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
                {navLinks.map((item, index) => (
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