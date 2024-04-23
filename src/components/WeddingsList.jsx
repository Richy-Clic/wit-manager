import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
// import { Button } from "@mui/material";
// import { WeddingsContext } from "../context/WeddingsProvider.jsx";

const columns = [
  { id: "index", label: "n°" },
  { id: "titulo", label: "Titulo" },
  { id: "novios", label: "Novios", minWidth: 170 },
  { id: "invitados", label: "Invitados" },
  { id: "fecha", label: "Fecha", align: "right" },
  {
    id: "ubicacion",
    label: "Ubicación",
    minWidth: 170,
    format: (value) => value.toLocaleString("en-US"),
  },
  { id: "eStatus", label: "Estatus", align: "right" },
  { id: "acciones", label: "Acciones", minWidth: 170 },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

const rows = [
  createData("India", "IN", 1324171354, 3287263),
  createData("China", "CN", 1403500365, 9596961),
  createData("Italy", "IT", 60483973, 301340),
  createData("United States", "US", 327167434, 9833520),
  createData("Canada", "CA", 37602103, 9984670),
  createData("Australia", "AU", 25475400, 7692024),
  createData("Germany", "DE", 83019200, 357578),
  createData("Ireland", "IE", 4857000, 70273),
  createData("Mexico", "MX", 126577691, 1972550),
  createData("Japan", "JP", 126317000, 377973),
  createData("France", "FR", 67022000, 640679),
  createData("United Kingdom", "GB", 67545757, 242495),
  createData("Russia", "RU", 146793744, 17098246),
  createData("Nigeria", "NG", 200962417, 923768),
  createData("Brazil", "BR", 210147125, 8515767),
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1976d2",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function Weddings() {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  // const { weddings, getWeddings } = useContext(WeddingsContext);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              // weddings ?
              //   weddings.map((wedding, index) => {
              //     const dateTime = new Date(wedding.wedding_date).toISOString().slice(0, 16).split('T')[0]
              //     return (
              //       <TableRow hover role="checkbox" tabIndex={-1} key={index}>
              //         <TableCell key={column.id} align="center"> {wedding.Id_wedding} </TableCell>
              //         <TableCell key={column.id}> {wedding.title} </TableCell>
              //         <TableCell key={column.id} align={column.align}>{wedding.girlfriend_name}</TableCell>
              //         <TableCell key={column.id} align={column.align}>{wedding.num_guest}</TableCell>
              //         <TableCell key={column.id} align={column.align}>{dateTime}</TableCell>
              //         <TableCell key={column.id} align={column.align}>{wedding.location}</TableCell>
              //         <TableCell key={column.id} align={column.align}>{wedding.wedding_status}</TableCell>
              //         <TableCell key={column.id} align={column.align}>
              //           <Button className='mx-1' variant="primary" onClick={() => openEditModal(wedding)}>Ver</Button>
              //           <Button variant="danger" onClick={() => openModalConfirm(wedding)}>Eliminar</Button>
              //         </TableCell>
              //       </TableRow>
              //     );
              //   })
              //   : <TableRow hover role="checkbox" tabIndex={-1}>
              //       <TableCell key={column.id} align={column.align}>Loading...</TableCell>
              //     </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
