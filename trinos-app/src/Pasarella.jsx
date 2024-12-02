import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import axios from "axios"; // Importa axios para hacer solicitudes HTTP

const Pasarella = () => {
  const [usuario, setUsuario] = useState(null);
  const [total, setTotal] = useState(0);
  const [metodoPago, setMetodoPago] = useState(""); // Estado para el método de pago
  const [numeroTarjeta, setNumeroTarjeta] = useState(""); // Estado para el número de tarjeta
  const navigate = useNavigate(); // Inicializa useNavigate

  useEffect(() => {
    // Obtener los datos del usuario desde localStorage
    const usuarioData = localStorage.getItem("usuario");
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
    }

    // Obtener el total de la compra desde localStorage
    const totalData = localStorage.getItem("total");
    if (totalData) {
      setTotal(parseFloat(totalData));
    }
  }, []);

  // Función para desconectar al usuario
  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("total");
    setUsuario(null);
    setTotal(0);
    navigate("/login2"); // Redirige a la página de login
  };

  // Función para manejar el pago (simulación) y redirigir a /compraexitosa
  const handlePago = async () => {
    if (metodoPago && numeroTarjeta.length === 16) {
      // Calcular la cantidad de tokens solo si el total es mayor a 50$
      let tokensObtenidos = 0;
      if (total > 50) {
        tokensObtenidos = Math.floor((total - 50) / 10); // 1 token por cada 10$
      }

      // Solo enviar los tokens si tokensObtenidos es mayor que 0
      if (tokensObtenidos > 0) {
        try {
          const response = await axios.post(
            `http://localhost:5000/api/usuario/${usuario.id}/tokens`,
            {
              cantidad_tokens: tokensObtenidos,
            }
          );

          console.log(response.data); // Confirmación del backend

          // Redirigir a la página de compra exitosa y pasar los datos
          navigate("/compraexitosa", { state: { total, tokensObtenidos } });
        } catch (error) {
          console.error("Error al enviar los tokens al backend:", error);
          alert("Hubo un error al procesar el pago.");
        }
      } else {
        // Si no hay tokens, no hacer la solicitud y redirigir
        navigate("/compraexitosa", { state: { total, tokensObtenidos } });
      }
    } else {
      alert("Por favor, complete los campos correctamente");
    }

    if (tokensObtenidos <= 0) {
      console.log("Los tokens no son válidos.");
      return; // No enviar solicitud si los tokens no son válidos
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-700">
          Detalles de Compra
        </h1>

        {usuario ? (
          <div className="space-y-2">
            <div className="flex justify-between">
              <h2 className="text-lg font-medium text-gray-800">Nombre:</h2>
              <p className="text-lg text-gray-600">{usuario.nombre}</p>
            </div>

            <div className="flex justify-between">
              <h2 className="text-lg font-medium text-gray-800">Apellido:</h2>
              <p className="text-lg text-gray-600">{usuario.apellido}</p>
            </div>

            <div className="flex justify-between">
              <h2 className="text-lg font-medium text-gray-800">Email:</h2>
              <p className="text-lg text-gray-600">{usuario.email}</p>
            </div>

            <div className="flex justify-between">
              <h2 className="text-lg font-medium text-gray-800">Dni:</h2>
              <p className="text-lg text-gray-600">{usuario.dni}</p>
            </div>

            <div className="flex justify-between">
              <h2 className="text-lg font-medium text-gray-800">
                Monto total:
              </h2>
              <p className="text-lg text-gray-600">${total.toFixed(2)}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <p className="text-lg text-gray-500">Cargando...</p>
          </div>
        )}

        {/* Selección del método de pago */}
        <div className="mt-4">
          <label
            className="text-lg font-medium text-gray-800"
            htmlFor="metodoPago"
          >
            Selecciona el método de pago:
          </label>
          <select
            id="metodoPago"
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Seleccionar...</option>
            <option value="visa">Visa</option>
            <option value="mastercard">MasterCard</option>
          </select>
        </div>

        {/* Ingreso del número de tarjeta */}
        {metodoPago && (
          <div className="mt-4">
            <label
              className="text-lg font-medium text-gray-800"
              htmlFor="numeroTarjeta"
            >
              Número de tarjeta:
            </label>
            <input
              id="numeroTarjeta"
              type="text"
              value={numeroTarjeta}
              onChange={(e) => setNumeroTarjeta(e.target.value)}
              maxLength="16"
              className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
              placeholder="Ingrese el número de tarjeta (simulado)"
            />
          </div>
        )}

        {/* Botones de acción */}
        <div className="mt-6 space-x-4 text-center">
          <button
            onClick={handlePago}
            className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Realizar Pago
          </button>
          <button className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pasarella;
