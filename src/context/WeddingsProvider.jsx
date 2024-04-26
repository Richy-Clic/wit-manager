import { useState, createContext } from "react";
import PropTypes from 'prop-types'; // Importa PropTypes
import axios from "axios";


export const WeddingsContext = createContext();

export const WeddingsProvider = (props) => {
    const [weddings, setWeddings] = useState()

    const getWeddings = () => {
        setTimeout(() => {
            axios.get('http://localhost:3001/weddings')
                .then(response => {
                    setWeddings(response.data.weddings);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    console.log('Retry connection in 30sec');
                    setTimeout(getWeddings, 30000);
                });
        }, 1000);
    }

    return (
        <WeddingsContext.Provider value={{ weddings, setWeddings, getWeddings }}>
            {props.children}
        </WeddingsContext.Provider>
    )
}

// Define PropTypes para WeddingsProvider
WeddingsProvider.propTypes = {
    children: PropTypes.node.isRequired // Suponiendo que children es una propiedad requerida
};
