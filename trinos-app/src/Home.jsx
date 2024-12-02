import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [productos, setProductos] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/productos")
      .then((response) => {
        setProductos(response.data); // Guardar los productos en el estado
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
      });
  }, []);

  return (
    <div className="bg-[#ff6c17] h-[100%] flex items-center justify-center">
      <div className="w-[80%] flex items-center justify-center pt-[5rem]">
        {/* Utilizamos grid y grid-cols-4 para crear una cuadrícula con hasta 4 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="bg-white h-[20rem] w-[15rem] rounded-[1rem] flex flex-col items-center justify-center shadow-md"
            >
              <div>
                <img
                  src={producto.url_img}
                  alt={producto.titulo}
                  className="h-[10rem] object-contain"
                />
              </div>
              <div className="mt-4 text-center">
                <h1 className="text-lg font-bold">{producto.titulo}</h1>
                <h1 className="text-gray-600">Precio: ${producto.precio}</h1>
              </div>
              <Link
                className="bg-blue-800 py-1 px-5 text-white rounded-lg mt-4 hover:bg-green-800"
                to={`/producto/${producto.id}`} // Redirige a la página de detalles
              >
                Comprar
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
