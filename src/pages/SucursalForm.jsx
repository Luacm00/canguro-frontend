import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Box,
  Paper,
} from "@mui/material";
import AppBarComponent from "../components/AppBarComponent";

const SucursalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    codigo: "",
    descripcion: "",
    direccion: "",
    identificacion: "",
    fechaCreacion: "",
    monedaId: "",
  });

  const [monedas, setMonedas] = useState([]);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    const init = async () => {
      await fetchMonedas();
      if (id) await fetchSucursal();
    };
    init();
  }, [id]);

  const fetchMonedas = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://localhost:5200/api/moneda", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMonedas(res.data);
    } catch (err) {
      console.error("Error cargando monedas:", err);
    }
  };

  const fetchSucursal = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`https://localhost:5200/api/sucursal/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const s = res.data;
      setForm({
        codigo: s.codigo,
        descripcion: s.descripcion,
        direccion: s.direccion,
        identificacion: s.identificacion,
        fechaCreacion: s.fechaCreacion.split("T")[0],
        monedaId: s.monedaId,
      });
    } catch (err) {
      console.error("Error cargando sucursal:", err);
    }
  };

  const validar = () => {
    const errors = {};
    if (!form.codigo) errors.codigo = "Código es requerido";
    if (!form.descripcion || form.descripcion.length > 250)
      errors.descripcion = "Máximo 250 caracteres";
    if (!form.direccion || form.direccion.length > 250)
      errors.direccion = "Máximo 250 caracteres";
    if (!form.identificacion || form.identificacion.length > 50)
      errors.identificacion = "Máximo 50 caracteres";
    if (!form.fechaCreacion || new Date(form.fechaCreacion) < new Date())
      errors.fechaCreacion = "Fecha debe ser igual o mayor a hoy";
    if (!form.monedaId) errors.monedaId = "Moneda es requerida";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erroresValidados = validar();
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (id) {
        await axios.put(`https://localhost:5200/api/sucursal/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("https://localhost:5200/api/sucursal", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate("/");
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AppBarComponent />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            {id ? "Editar Sucursal" : "Crear Sucursal"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Código"
                  name="codigo"
                  type="number"
                  fullWidth
                  value={form.codigo}
                  onChange={handleChange}
                  error={!!errores.codigo}
                  helperText={errores.codigo}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Descripción"
                  name="descripcion"
                  fullWidth
                  value={form.descripcion}
                  onChange={handleChange}
                  error={!!errores.descripcion}
                  helperText={errores.descripcion}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Dirección"
                  name="direccion"
                  fullWidth
                  value={form.direccion}
                  onChange={handleChange}
                  error={!!errores.direccion}
                  helperText={errores.direccion}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Identificación"
                  name="identificacion"
                  fullWidth
                  value={form.identificacion}
                  onChange={handleChange}
                  error={!!errores.identificacion}
                  helperText={errores.identificacion}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Fecha de Creación"
                  name="fechaCreacion"
                  type="date"
                  fullWidth
                  value={form.fechaCreacion}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!errores.fechaCreacion}
                  helperText={errores.fechaCreacion}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Moneda"
                  name="monedaId"
                  fullWidth
                  value={form.monedaId}
                  onChange={handleChange}
                  error={!!errores.monedaId}
                  helperText={errores.monedaId}
                >
                  <MenuItem value="">Seleccione</MenuItem>
                  {monedas.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.descripcion}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end" mt={4}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mr: 2 }}
              >
                {id ? "Actualizar" : "Crear"}
              </Button>
              <Button variant="outlined" onClick={() => navigate("/")}>
                Cancelar
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default SucursalForm;
