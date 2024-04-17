// /* eslint-disable react-hooks/exhaustive-deps */
// import { useState, useEffect, useContext } from 'react'
// import Table from 'react-bootstrap/Table';
// import ModalEdit from "../components/ModalEdit.jsx";
// import ModalConfirm from "../components/ModalConfirm.jsx";
// import Button from 'react-bootstrap/Button';
// import { WeddingsContext } from "../context/WeddingsProvider.jsx";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


export default function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell align="right">Novio</TableCell>
            <TableCell align="right">Novia</TableCell>
            <TableCell align="right">Invitados</TableCell>
            <TableCell align="right">Fecha</TableCell>
            <TableCell align="right">Locación</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Aciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))} */}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


// const WeddingsList = () => {
//   const [modalShow, setModalShow] = useState(false);
//   const [modalConfirm, setModalConfirm] = useState(false);
//   const [record, setRecord] = useState(null);
//   const {weddings, getWeddings} = useContext(WeddingsContext);

//   useEffect(() => {
//     try {
//       getWeddings()
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   }, []);

//   const openEditModal = (record) => {
//     setRecord(record);
//     setModalShow(true);
//   };

//   const closeModal = () => {
//     setModalShow(false);
//   };

//   const closeModalConfirm = () => {
//     setModalConfirm(false);
//   };

//   const openModalConfirm = (record) => {
//     setRecord(record);
//     setModalConfirm(true);
//   }

//   return (
//     <div>
//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Novio</th>
//             <th>Novia</th>
//             <th>Invitados</th>
//             <th>Fecha</th>
//             <th>Locación</th>
//             <th>Status</th>
//             <th>Aciones</th>
//           </tr>
//         </thead>
//         <tbody>
//           {weddings ?
//             weddings.map((wedding, index) => {
//               const dateTime = new Date(wedding.wedding_date).toISOString().slice(0, 16).split('T')[0]
//               return (
//                 <tr key={index}>
//                   <td>{wedding.Id_wedding}</td>
//                   <td>{wedding.boyfriend_name}</td>
//                   <td>{wedding.girlfriend_name}</td>
//                   <td>{wedding.num_guest}</td>
//                   <td>{dateTime}</td>
//                   <td>{wedding.location}</td>
//                   <td>{wedding.wedding_status}</td>
//                   <td className='text-center'>
//                     <Button className='mx-1' variant="primary" onClick={() => openEditModal(wedding)}>Ver</Button>
//                     <Button variant="danger" onClick={() => openModalConfirm(wedding)}>Eliminar</Button>
//                   </td>
//                 </tr>
//               );
//             })
//             : <tr><td colSpan={8} className='text-center'>Loading...</td></tr>
//           }
//         </tbody>
//       </Table>
//       <ModalEdit record={record} show={modalShow} onHide={closeModal}/>
//       <ModalConfirm show={modalConfirm} onHide={closeModalConfirm} record={record} />
//     </div>
//   )
// }

// export default WeddingsList