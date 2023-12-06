import React from 'react';

function InscriptionEtape2(props) {
    return (
        <div>
                    <form>
            {/* Champs du formulaire pour nom, prenom, etc. */}
            {/* Select pour le rôle */}
            <select name="role" value={props.data.role} onChange={props.onInputChange}>
                <option value="utilisateur">Utilisateur</option>
                <option value="taxi">Taxi</option>
            </select>
            <button type="button" onClick={props.allerAEtapeSuivante}>Suivant</button>
        </form>
        </div>
    );
}

export default InscriptionEtape2;