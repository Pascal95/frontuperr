import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import TopNav from "../TopNav/TopNav";

function Layout(props) {
    return (
        <div className="layout">
            <Sidebar />
            <div className="main__layout">
                <TopNav />
                <div className="content">
                    {props.children}
                </div>
            </div>
        </div>
    );
}

export default Layout;
