import React from 'react';
import { useParams } from 'react-router-dom';

function InscriptionEtape(props) {
    const { info } = useParams();
    console.log(info)
    return (
        <div>
            Bonjour
        </div>
    );
}

export default InscriptionEtape;