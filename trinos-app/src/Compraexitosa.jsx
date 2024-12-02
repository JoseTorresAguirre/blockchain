import React from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Importa useLocation y useNavigate

const Compraexitosa = () => {
  const location = useLocation(); // Accede a la ubicación actual
  const navigate = useNavigate(); // Inicializa useNavigate
  const { total, tokensObtenidos } = location.state || {}; // Obtén los datos pasados

  // Función para redirigir al inicio
  const volverAlInicio = () => {
    navigate("/"); // Redirige a la página de inicio
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-700">
          ¡Compra Exitosa!
        </h1>

        <div className="space-y-2 text-center">
          <p className="text-lg text-gray-600">
            Usted ha realizado un pago de ${total?.toFixed(2)}.
          </p>
          <p className="text-lg text-gray-600">
            ¡Felicidades! Ha obtenido {tokensObtenidos} TrinoTokens.
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={volverAlInicio} // Asocia la función al clic
            className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default Compraexitosa;
