import React from 'react';

import { Link } from "react-router-dom";
import profileImg from "../../assets/img/profile-02.png";
import "./top-nav.css";

function TopNav(props) {
    return (
        <div className="top__nav">
        <div className="top__nav-wrapper">
          <div className="search__box">
            <input type="text" placeholder="Rechercher" />
            <span>
                
              <i className="ri-search-line"></i>
            </span>
          </div>
          <div className="top__nav-right">
            <span className="notification">
              <i className="ri-notification-3-line"></i>
              <span className="badge">1</span>
            </span>
            <div className="profile">
              <Link to="/settings">
                <img src={profileImg} alt="" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
}

export default TopNav;