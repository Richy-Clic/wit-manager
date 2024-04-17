// import React, { useState } from 'react'
import WeddingsList from "../components/WeddingsList.jsx";
// import ModalCreate from "../components/ModalCreate.jsx";
// import Button from 'react-bootstrap/Button';
// import Title from "../components/Title.jsx";



const Weddings = () => {
//     const [modalCreate, setModalCreate] = useState(false);

//     const openModalCreate = () => {
//         setModalCreate(true);
//     };
//     const closeModalCreate = () => {
//         setModalCreate(false);
//     };

    return (
//         <div className="container">
//             <Title title={'Weddings'} />
//             <div className="row p-3">
//                 <div className="col-12 text-right">
//                     {/* <button className='btn btn-primary'>Nueva boda</button> */}
//                     <Button className='mx-1' variant="primary" onClick={() => openModalCreate()}>
//                         Nueva boda
//                     </Button>
//                 </div>
//             </div>
//             <div className="row">
//                 <div className="col-12">
                    <WeddingsList />
//                 </div>
//             </div>
//             <ModalCreate show={modalCreate} onHide={closeModalCreate} />
//         </div>
    )
}

export default Weddings