import React, { useState } from "react";
import { Mail, Password } from "@mui/icons-material";
import axios from "axios";
import Input from "./components/Input";
import BotonSubmit from "./components/BotonSubmit";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Importar estilos

const Login2 = () => {
  // Estado para manejar los campos del formulario
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [error, setError] = useState(""); // Estado para errores
  const navigate = useNavigate();

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar cualquier error previo

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        dni,
      });

      if (response.status === 200) {
        // Mostrar notificación personalizada
        toast.success("Ingreso exitoso!", {
          position: "top-center",
          autoClose: 3000, // La notificación se cierra después de 3 segundos
          style: {
            backgroundColor: "#000000", // Cambiar el color de fondo (puedes poner el color que prefieras)
            color: "#ffffff", // Cambiar el color del texto
            borderRadius: "10px", // Borde redondeado
            border: "2px solid #f4a261", // Agregar un borde (puedes personalizar el color)
            padding: "10px", // Espaciado interno
            fontWeight: "bold", // Hacer el texto en negrita
          },
        });

        // Almacenar los datos del usuario en el estado o en localStorage
        const usuario = response.data.usuario;

        // Imprimir los datos del usuario en consola para verificar
        console.log("Datos del usuario recibidos:", usuario);

        // Guardar los datos del usuario en localStorage
        localStorage.setItem("usuario", JSON.stringify(usuario)); // Guardar en localStorage

        // Redirigir al dashboard después de 3 segundos
        setTimeout(() => {
          navigate("/pasarella"); // Redirige a la página de dashboard
        }, 3000); // 3000ms = 3 segundos
      }
    } catch (err) {
      // Manejar errores del backend
      if (err.response && err.response.status === 401) {
        setError("Email o DNI incorrectos");
      } else {
        setError("Ocurrió un error al intentar iniciar sesión");
      }
    }
  };

  return (
    <div className="bg-[#ff6c17] h-[90vh] flex items-center justify-center">
      <img
        src="https://www.diariosigloxxi.com/multimedia/images/img_fc7008c32a86384b02d747a9d7361a47.jpg"
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@example"
              type="email"
              icon={Mail}
            />
            <Input
              name="dni"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="******"
              type="password"
              icon={Password}
            />
            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
            <BotonSubmit className="font-extrabold">Ingresar</BotonSubmit>
          </form>
        </div>
        {/* Contenedor de las notificaciones */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login2;
