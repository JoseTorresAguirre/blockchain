import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import TrinosToken from "./TrinosToken.json";
import axios from "axios";

// Dirección del contrato desplegado
const contractAddress = "0x6fc81C337594073370ED8BEBAA8DA5b852c45891"; // Dirección del contrato actualizada
const tokenAddress = "0xAAE1f29E49d035DC84Cef0EB9c9F2505cB1428aA"; // Dirección del propietario del token (o donde se manejará el canje)

const DashUser = () => {
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    dni: "",
    tokens: "",
  });

  const [tokens, setTokens] = useState(0);
  const [error, setError] = useState("");

  // Efecto para obtener los datos del usuario almacenados en localStorage
  useEffect(() => {
    const usuarioData = JSON.parse(localStorage.getItem("usuario"));

    // Si hay datos de usuario en el localStorage, los actualizamos en el estado
    if (usuarioData) {
      setUsuario({
        nombre: usuarioData.nombre || "",
        apellido: usuarioData.apellido || "",
        email: usuarioData.email || "",
        dni: usuarioData.dni || "",
      });

      // Solicitar los tokens asociados al usuario
      axios
        .get(`http://localhost:5000/api/usuario/${usuarioData.id}/tokens`)
        .then((response) => {
          console.log("Tokens del usuario:", response.data);
          setTokens(response.data.cantidad_tokens); // Asumiendo que la respuesta contiene la cantidad de tokens
        })
        .catch((error) => {
          console.error("Error al obtener los tokens:", error);
        });
    }
  }, []);

  const [account, setAccount] = useState(null); // Estado para la cuenta conectada
  const [provider, setProvider] = useState(null); // Estado para el proveedor de Ethereum
  const [balance, setBalance] = useState(null); // Estado para almacenar el balance de ETH
  const [tokenBalance, setTokenBalance] = useState(null); // Estado para el balance del token ERC-20
  const [showTokenBalance, setShowTokenBalance] = useState(false); // Estado para controlar la visibilidad del balance del token
  const [showTokenDetails, setShowTokenDetails] = useState(false); // Estado para controlar la visibilidad de los detalles del token
  const [tokenDetails, setTokenDetails] = useState({}); // Estado para los detalles del token
  const [ownerAddress, setOwnerAddress] = useState(""); // Estado para la dirección del dueño del contrato
  const [userType, setUserType] = useState(""); // Estado para determinar si es dueño o usuario
  const [transferAmount, setTransferAmount] = useState(""); // Estado para la cantidad de tokens a transferir
  const [transactionStatus, setTransactionStatus] = useState(""); // Estado para mostrar el estado de la transacción
  const [burnAmount, setBurnAmount] = useState(""); // Estado para la cantidad de tokens a quemar
  const [mintAmount, setMintAmount] = useState(""); // Estado para la cantidad de tokens a mintear

  const [canjeAmount, setCanjeAmount] = useState(""); // Estado para la cantidad de tokens a canjear
  const [canjeStatus, setCanjeStatus] = useState(""); // Estado para mostrar el estado de la transacción de canje

  // Función para manejar el canje de tokens
  const canjearTokens = async () => {
    try {
      if (!account || !canjeAmount) return;

      // Crear una instancia del contrato ERC-20
      const tokenContract = new ethers.Contract(
        contractAddress,
        TrinosToken.abi,
        provider.getSigner() // Usar el firmante para firmar la transacción
      );

      // Verificar si el usuario tiene suficientes tokens
      const decimals = await tokenContract.decimals();
      const amountInUnits = ethers.utils.parseUnits(canjeAmount, decimals);
      const tokenBalance = await tokenContract.balanceOf(account);

      if (tokenBalance.lt(amountInUnits)) {
        setCanjeStatus("No tienes suficientes tokens para canjear.");
        return;
      }

      // Llamar a la función de canje (deberías agregarla en tu contrato)
      // Aquí supongo que el contrato tiene una función `canjear` que maneja el canje
      const tx = await tokenContract.canjear(amountInUnits);
      setCanjeStatus("Esperando confirmación de la transacción...");
      await tx.wait(); // Esperar que la transacción se confirme

      setCanjeStatus("¡Canje exitoso!");
      getTokenBalance(); // Actualiza el balance de tokens
    } catch (error) {
      console.error("Error canjeando los tokens:", error);
      setCanjeStatus("Hubo un error al realizar el canje.");
    }
  };

  // Función para conectar la cuenta de MetaMask
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
      try {
        const [selectedAccount] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(selectedAccount);
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("Provider:", newProvider);
        setProvider(newProvider);

        // Al conectar la wallet, obtener el balance de la cuenta
        getBalance(newProvider, selectedAccount);
        getTokenDetails(newProvider);
      } catch (error) {
        console.error("Error conectando con MetaMask:", error);
      }
    } else {
      console.log("MetaMask is not installed.");
      alert(
        "MetaMask no está instalado. Por favor, instálalo para usar esta aplicación."
      );
    }
  };

  // Función para obtener el balance de la cuenta en ETH
  const getBalance = async (provider, account) => {
    try {
      const balanceWei = await provider.getBalance(account); // Obtener el balance en wei
      const balanceEther = ethers.utils.formatEther(balanceWei); // Convertir a Ether
      setBalance(balanceEther); // Establecer el balance en el estado
    } catch (error) {
      console.error("Error obteniendo el balance:", error);
    }
  };

  // Función para obtener el balance del token ERC-20
  const getTokenBalance = async () => {
    try {
      if (!account) return;

      // Crear una instancia del contrato ERC-20
      const tokenContract = new ethers.Contract(
        contractAddress,
        TrinosToken.abi, // ABI del contrato del token
        provider
      );

      // Llamar a la función balanceOf del contrato
      const tokenBalance = await tokenContract.balanceOf(account);

      // Convertir el saldo a formato legible (decimales)
      const decimals = await tokenContract.decimals();
      const tokenBalanceFormatted = ethers.utils.formatUnits(
        tokenBalance,
        decimals
      );

      setTokenBalance(tokenBalanceFormatted); // Establecer el balance del token en el estado
    } catch (error) {
      console.error("Error obteniendo el balance del token:", error);
    }
  };

  // Función para obtener los detalles del contrato ERC-20
  const getTokenDetails = async (provider) => {
    try {
      if (!provider) return;

      const tokenContract = new ethers.Contract(
        contractAddress,
        TrinosToken.abi,
        provider
      );

      // Obtener el dueño del contrato
      const owner = await tokenContract.owner();
      setOwnerAddress(owner); // Establecer la dirección del dueño del contrato

      // Comparar la dirección conectada con la del dueño
      if (account === owner) {
        setUserType("Dueño del contrato");
      } else {
        setUserType("Usuario");
      }

      // Obtener otros detalles del token
      const name = await tokenContract.name();
      const symbol = await tokenContract.symbol();
      const decimals = await tokenContract.decimals();
      const paused = await tokenContract.paused();
      const totalSupply = await tokenContract.totalSupply();

      setTokenDetails({
        name,
        symbol,
        decimals,
        owner,
        paused,
        totalSupply: ethers.utils.formatUnits(totalSupply, decimals),
      });
    } catch (error) {
      console.error("Error obteniendo detalles del token:", error);
    }
  };

  // Función para alternar la visibilidad del saldo del token ERC-20
  const toggleTokenBalance = () => {
    setShowTokenBalance((prevState) => !prevState); // Alterna entre true/false
    if (!showTokenBalance) {
      getTokenBalance(); // Solo obtener el saldo si el balance está siendo mostrado
    }
  };

  // Función para alternar la visibilidad de los detalles del token
  const toggleTokenDetails = () => {
    setShowTokenDetails((prevState) => !prevState); // Alterna entre true/false
    if (!showTokenDetails) {
      getTokenDetails(provider); // Solo obtener los detalles si se están mostrando
    }
  };

  // Función para realizar la transferencia de tokens
  const transferTokens = async () => {
    try {
      if (!provider || !account || !transferAmount) return;

      // Crear una instancia del contrato ERC-20
      const tokenContract = new ethers.Contract(
        contractAddress,
        TrinosToken.abi,
        provider.getSigner() // Usar el firmante para firmar la transacción
      );

      // Calcular la cantidad de tokens a transferir en unidades enteras
      const decimals = await tokenContract.decimals();
      const amountInUnits = ethers.utils.parseUnits(transferAmount, decimals);

      // Realizar la transacción de transferencia
      const tx = await tokenContract.transfer(account, amountInUnits);
      setTransactionStatus("Esperando confirmación de la transacción...");
      await tx.wait(); // Esperar que la transacción se confirme
      setTransactionStatus("¡Transferencia exitosa!");

      // Actualizar el balance después de la transferencia
      getTokenBalance();
    } catch (error) {
      console.error("Error transfiriendo tokens:", error);
      setTransactionStatus("Hubo un error al realizar la transferencia.");
    }
  };

  // Función para quemar tokens
  const burnTokens = async () => {
    if (!account || !burnAmount) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      TrinosToken.abi,
      signer
    );

    try {
      console.log("Quemando tokens...");
      const tx = await contract.burn(ethers.utils.parseEther(burnAmount));
      console.log("Esperando confirmación...");
      await tx.wait();
      console.log("Tokens quemados con éxito");
      getBalance(); // Actualiza el balance después de quemar
    } catch (error) {
      console.error("Error quemando los tokens:", error);
    }
  };

  // Función para mintear tokens
  const mintTokens = async () => {
    if (!account || !mintAmount) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      TrinosToken.abi,
      signer
    );

    try {
      console.log("Minteando tokens...");
      const tx = await contract.mint(
        account,
        ethers.utils.parseEther(mintAmount)
      );
      console.log("Esperando confirmación...");
      await tx.wait();
      console.log("Tokens minteados con éxito");
      getBalance(); // Actualiza el balance después de mintear
    } catch (error) {
      console.error("Error minteando los tokens:", error);
    }
  };

  // Función para pausar el contrato
  const pauseContract = async () => {
    try {
      if (!provider || !account) return;

      // Crear una instancia del contrato ERC-20
      const tokenContract = new ethers.Contract(
        contractAddress,
        TrinosToken.abi,
        provider.getSigner() // Usar el firmante para firmar la transacción
      );

      // Llamar a la función pause
      const tx = await tokenContract.pause();
      setTransactionStatus("Pausando contrato...");
      await tx.wait(); // Esperar que la transacción se confirme
      setTransactionStatus("¡Contrato pausado con éxito!");
    } catch (error) {
      console.error("Error pausando el contrato:", error);
      setTransactionStatus("Hubo un error al pausar el contrato.");
    }
  };

  // Función para reanudar el contrato
  const unpauseContract = async () => {
    try {
      if (!provider || !account) return;

      // Crear una instancia del contrato ERC-20
      const tokenContract = new ethers.Contract(
        contractAddress,
        TrinosToken.abi,
        provider.getSigner() // Usar el firmante para firmar la transacción
      );

      // Llamar a la función unpause
      const tx = await tokenContract.unpause();
      setTransactionStatus("Reanudando contrato...");
      await tx.wait(); // Esperar que la transacción se confirme
      setTransactionStatus("¡Contrato reanudado con éxito!");
    } catch (error) {
      console.error("Error reanudando el contrato:", error);
      setTransactionStatus("Hubo un error al reanudar el contrato.");
    }
  };

  return (
    <div className="min-h-screen h-[100%] bg-gray-100 space-x-4 flex items-start justify-center">
      <div className="bg-white my-[5rem]  p-8 rounded-lg shadow-lg w-full max-w-md">
        <div>
          <h1 className="text-2xl font-semibold text-center text-indigo-600 mb-4">
            Informacion de Usuario
          </h1>
        </div>
        <h1>Nombre: {usuario.nombre}</h1>
        <h1>Apellido: {usuario.apellido}</h1>
        <h1>Email: {usuario.email}</h1>
        <h1>DNI: {usuario.dni}</h1>
        <h1>Tokens: {tokens} TRN</h1>
        {/* <div className="bg-white my-[5rem] p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-semibold text-center text-indigo-600 mb-4">
            Canje de Tokens
          </h1>

          <div>
            <label htmlFor="canjeAmount" className="block text-lg mb-2">
              Cantidad a Canjear (TRN)
            </label>
            <input
              type="number"
              id="canjeAmount"
              className="border-2 border-gray-300 p-2 w-full rounded"
              value={canjeAmount}
              onChange={(e) => setCanjeAmount(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <button
              onClick={canjearTokens}
              className="bg-indigo-600 text-white py-2 px-4 rounded w-full"
            >
              Canjear Tokens
            </button>
          </div>

          {canjeStatus && (
            <div className="mt-4 text-center">
              <p>{canjeStatus}</p>
            </div>
          )}
        </div> */}
      </div>

      <div className="bg-white my-[5rem] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-indigo-600 mb-4">
          TrinosTOKEN Dashboard
        </h1>
        {!account ? (
          <button
            onClick={connectWallet}
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Conectar Wallet
          </button>
        ) : (
          <>
            <p className="text-lg text-gray-800 mt-4">
              Dirección conectada:{" "}
              <span className="font-semibold text-indigo-600">{account}</span>
            </p>
            {userType && (
              <p className="text-lg text-gray-800 mt-4">
                {userType === "Dueño del contrato" ? (
                  <span className="text-green-500">¡Eres el dueño!</span>
                ) : (
                  <span className="text-blue-500">Eres un usuario.</span>
                )}
              </p>
            )}
            {balance && (
              <p className="text-lg text-gray-800 mt-4">
                Balance de ETH:{" "}
                <span className="font-semibold text-indigo-600">
                  {balance} ETH
                </span>
              </p>
            )}
            <button
              onClick={toggleTokenBalance}
              className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition mt-4"
            >
              {showTokenBalance
                ? "Ocultar Balance del Token"
                : "Mostrar Balance del Token"}
            </button>
            {showTokenBalance && tokenBalance !== null && (
              <p className="text-lg text-gray-800 mt-4">
                Balance de TrinosToken:{" "}
                <span className="font-semibold text-indigo-600">
                  {tokenBalance} {tokenDetails.symbol}
                </span>
              </p>
            )}
            <button
              onClick={toggleTokenDetails}
              className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition mt-4"
            >
              {showTokenDetails
                ? "Ocultar Detalles del Token"
                : "Mostrar Detalles del Token"}
            </button>
            {showTokenDetails && tokenDetails.name && (
              <div className="mt-6 text-gray-800">
                <h2 className="text-xl font-semibold">Detalles del Token</h2>
                <p>
                  Nombre:{" "}
                  <span className="font-semibold text-indigo-600">
                    {tokenDetails.name}
                  </span>
                </p>
                <p>
                  Símbolo:{" "}
                  <span className="font-semibold text-indigo-600">
                    {tokenDetails.symbol}
                  </span>
                </p>
                <p>
                  Decimals:{" "}
                  <span className="font-semibold text-indigo-600">
                    {tokenDetails.decimals}
                  </span>
                </p>
                <p>
                  Dirección del propietario:{" "}
                  <span className="font-semibold text-indigo-600">
                    {tokenDetails.owner}
                  </span>
                </p>
                <p>
                  Suministro total:{" "}
                  <span className="font-semibold text-indigo-600">
                    {tokenDetails.totalSupply} {tokenDetails.symbol}
                  </span>
                </p>
                <p>
                  Estado del contrato (Pausado):{" "}
                  <span
                    className={`font-semibold ${
                      tokenDetails.paused ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {tokenDetails.paused ? "Pausado" : "Activo"}
                  </span>
                </p>
              </div>
            )}
            {/* Botón para pausar el contrato */}
            <button
              onClick={pauseContract}
              className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition mt-4"
            >
              Pausar Contrato
            </button>

            {/* Botón para reanudar el contrato */}
            <button
              onClick={unpauseContract}
              className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition mt-4"
            >
              Reanudar Contrato
            </button>
            {/* Funciones de transferencia, quema y minteo */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Cantidad a transferir"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full p-2 border rounded-lg mt-2"
              />
              <button
                onClick={transferTokens}
                className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition mt-4"
              >
                Transferir Tokens
              </button>
              <input
                type="text"
                placeholder="Cantidad a quemar"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
                className="w-full p-2 border rounded-lg mt-2"
              />
              <button
                onClick={burnTokens}
                className="w-full py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition mt-4"
              >
                Quemar Tokens
              </button>
              <input
                type="text"
                placeholder="Cantidad a mintear"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                className="w-full p-2 border rounded-lg mt-2"
              />
              <button
                onClick={mintTokens}
                className="w-full py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition mt-4"
              >
                Mintear Tokens
              </button>
              {transactionStatus && (
                <p className="text-lg text-gray-800 mt-4">
                  {transactionStatus}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashUser;
