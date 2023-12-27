import React from 'react';
import './DashboardInit.css'

function DashboardInit(props) {
    return (
        <div className="DashboardInit">
            <h2 className="dashboard__title">Reserver un taxi</h2>

            <form>
                <div className="form__group">
                    <div>
                        <label>Patient</label>
                        <select name="patient" id="patient">
                            <option value="Tom">Tom</option>
                            <option value="René">René</option>
                        </select>
                    </div>
                    <div>
                        <label>Numéro de sécurité social</label>
                        <input type="text" placeholder="10093072074" />
                    </div>
                </div>
                <div className="form__group">
                    <div>
                        <label>Lieu de départ</label>
                        <input type="text" placeholder="6 rue des fossettes 95330 Domont" />
                    </div>
                    <div>
                        <label>Lieu d'arrivé</label>
                        <input type="text" placeholder="Hopital d'Eaubonne" />
                    </div>
                </div>
                <div className="form__group">
                    <div>
                        <label for="party">Date et heure de consultation</label>
                        <input
                        id="party"
                        type="datetime-local"
                        name="partydate"
                        value="2017-06-01T08:30" />
                    </div>
                    <div>
                        <label for="party">Heure de depart suggéré</label>
                        <input
                        id="party"
                        type="time"
                        name="partydate"/>
                    </div>
                </div>
                <div className="form__group">
                    <div>
                        <label htmlFor="">Durée de la consultation</label>
                        <input type="time" name="dureeconsult" id="dureeconsult" />
                    </div>
                    <div>
                        <label htmlFor="">Souhaitez vous faire l'aller retour</label>
                        <select name="AllerRetour" id="AllerRetour">
                            <option value="1">Oui</option>
                            <option value="0">Non</option>
                        </select>
                    </div>
                </div>
                <button className="btn-validate">Valider</button>
            </form>
        </div>
    );
}

export default DashboardInit;