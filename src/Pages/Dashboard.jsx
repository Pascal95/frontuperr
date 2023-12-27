import React, { useEffect } from 'react';
import Layout from '../Components/Layout/Layout';
import { Outlet, useNavigate } from 'react-router-dom';


function Dashboard(props) {
    return (
        <Layout>
            <Outlet/>
        </Layout>
    );
}

export default Dashboard;