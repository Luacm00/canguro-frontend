import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Pagination,
  AppBar,
  Toolbar,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [sucursales, setSucursales] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const navigate = useNavigate();

  const fetchSucursales = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://localhost:5200/api/sucursal?page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSucursales(response.data.sucursales);
      setTotalRegistros(response.data.totalRegistros);
    } catch (error) {
      console.error("Error al obtener sucursales:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchSucursales();
  }, [page]);

  const totalPaginas = Math.ceil(totalRegistros / pageSize);

  const handleEdit = (id) => {
    navigate(`/editar/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar esta sucursal?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:5200/api/sucursal/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchSucursales();
    } catch (error) {
      console.error("Error al eliminar la sucursal:", error);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Sucursales - Canguro
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ marginTop: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5">Listado de Sucursales</Typography>
          <Button variant="contained" onClick={() => navigate("/crear")}>
            Nueva Sucursal
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Identificación</TableCell>
                <TableCell>Moneda</TableCell>
                <TableCell>Activo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sucursales.map((sucursal) => (
                <TableRow key={sucursal.id}>
                  <TableCell>{sucursal.codigo}</TableCell>
                  <TableCell>{sucursal.descripcion}</TableCell>
                  <TableCell>{sucursal.direccion}</TableCell>
                  <TableCell>{sucursal.identificacion}</TableCell>
                  <TableCell>{sucursal.monedaId}</TableCell>
                  <TableCell>{sucursal.activo ? "Sí" : "No"}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleEdit(sucursal.id)}
                      size="small"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(sucursal.id)}
                      size="small"
                      color="error"
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPaginas}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </Container>
    </>
  );
};

export default HomePage;
