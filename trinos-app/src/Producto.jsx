import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BotonRegresar from "./components/BotonRegresara";

const Producto = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/productos/${id}`)
      .then((response) => {
        setProducto(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener el producto:", error);
      });
  }, [id]);

  useEffect(() => {
    if (producto) {
      const newTotal = cantidad * parseFloat(producto.precio);
      setTotal(newTotal);
      // Guardar el total en localStorage
      localStorage.setItem("total", newTotal.toFixed(2));
    }
  }, [cantidad, producto]);

  if (!producto) {
    return <div>Cargando...</div>;
  }

  const handleConfirmarCompra = () => {
    navigate("/login2"); // Redirige a la página de Pasarella
  };

  return (
    <div className="bg-[#ff6c17] h-[90vh] flex items-center justify-center pt-[5rem]">
      <div className="bg-white rounded-[1rem] shadow-md w-[50%] h-[90%] p-8 flex items-center justify-center">
        <img
          src={producto.url_img}
          alt={producto.titulo}
          className="w-[100%] h-[15rem] object-contain"
        />
        <div className="w-[50%]">
          <h1 className="text-2xl font-bold mt-4">{producto.titulo}</h1>
          <h2 className="text-lg text-gray-600 mt-2">
            Precio: ${producto.precio}
          </h2>
          <div className="mt-4">
            <label htmlFor="cantidad" className="text-lg">
              Cantidad:{" "}
            </label>
            <input
              type="number"
              id="cantidad"
              value={cantidad}
              min="1"
              onChange={(e) => setCantidad(e.target.value)}
              className="border p-2 rounded-md w-[4rem]"
            />
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-bold">Total: ${total.toFixed(2)}</h2>
          </div>

          <button
            onClick={handleConfirmarCompra}
            className="bg-blue-800 py-2 px-6 w-[12rem] text-white rounded-lg mt-4 hover:bg-green-800"
          >
            Confirmar Compra
          </button>
          <BotonRegresar></BotonRegresar>
        </div>
      </div>
    </div>
  );
};

export default Producto;
