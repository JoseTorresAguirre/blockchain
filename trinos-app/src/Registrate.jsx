import React, { useState } from "react";
import { Person, GroupAdd, Mail, Badge } from "@mui/icons-material";
import Input from "./components/Input";
import BotonSubmit from "./components/BotonSubmit";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Importar estilos
import { useNavigate } from "react-router-dom";

const Registrate = () => {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    dni: "",
  });

  const navigate = useNavigate(); // Usar useNavigate para redirigir

  // Manejo de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hacer la solicitud POST a la API
    try {
      const response = await fetch("http://localhost:5000/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Mostrar notificación personalizada
        toast.success(
          "¡Registro exitoso! Ahora formas parte de la familia Trinos.",
          {
            position: "top-center",
            autoClose: 3000, // La notificación se cierra después de 5 segundos
            style: {
              backgroundColor: "#000000", // Cambiar el color de fondo (puedes poner el color que prefieras)
              color: "#ffffff", // Cambiar el color del texto
              borderRadius: "10px", // Borde redondeado
              border: "2px solid #f4a261", // Agregar un borde (puedes personalizar el color)
              padding: "10px", // Espaciado interno
              fontWeight: "bold", // Hacer el texto en negrita
            },
          }
        );
        // Redirigir al login después de 5 segundos (5000ms)
        setTimeout(() => {
          navigate("/login"); // Redirige a la página de login
        }, 5000); // 5000ms = 5 segundos

        // Limpiar formulario
        setFormData({
          nombre: "",
          apellido: "",
          email: "",
          dni: "",
        });
      } else {
        toast.error(
          "Ocurrió un error al registrar el usuario. Intenta de nuevo.",
          {
            position: "top-center",
            autoClose: 5000,
          }
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Ocurrió un error al registrar el usuario. Intenta de nuevo.",
        {
          position: "top-center",
          autoClose: 5000,
        }
      );
    }
  };

  return (
    <div className="bg-[#ff6c17] h-[90vh] flex  items-center justify-center">
      <img
        src="https://watermark.lovepik.com/photo/20211130/large/lovepik-folder-record-close-up-picture_501269781.jpg"
        alt="img"
        className="absolute w-[100vw] h-[90vh] z-10"
      />
      <div className="bg-gray-900 opacity-90 h-[80%] w-[50%] flex flex-col items-center justify-center rounded-[2rem] border-2 border-[#ff6c17] shadow-lg shadow-black z-20">
        <div>
          <img
            src="https://res.cloudinary.com/dj3xwsle9/image/upload/v1732934248/trinos_yzi9rc.png"
            alt="img"
            className="h-[15rem]"
          />
        </div>
        <div>
          <form onSubmit={handleSubmit} className="space-y-2">
            <Input
              name="nombre"
              placeholder="Ingresa tu Nombre"
              type="text"
              icon={Person}
              value={formData.nombre}
              onChange={handleInputChange}
            ></Input>
            <Input
              name="apellido"
              placeholder="Ingresa tus Apellidos"
              type="text"
              icon={GroupAdd}
              value={formData.apellido}
              onChange={handleInputChange}
            ></Input>
            <Input
              name="email"
              placeholder="Ingresa tu Email"
              type="mail"
              icon={Mail}
              value={formData.email}
              onChange={handleInputChange}
            ></Input>
            <Input
              name="dni"
              placeholder="Ingresa tu Dni"
              type="text"
              icon={Badge}
              value={formData.dni}
              onChange={handleInputChange}
            ></Input>

            <BotonSubmit className="font-extrabold">Enviar</BotonSubmit>
          </form>
          {/* Contenedor de las notificaciones */}
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Registrate;
