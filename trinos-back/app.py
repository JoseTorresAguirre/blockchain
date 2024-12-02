from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

# Configuración de Flask
app = Flask(__name__)
CORS(app, origins="http://localhost:5173")  # Habilitar CORS para permitir solicitudes desde el frontend

# Configuración de la conexión con la base de datos MySQL
db_config = {
    'host': 'localhost',       # Cambiar si no usas localhost
    'user': 'root',            # Usuario de MySQL
    'password': 'root',            # Contraseña de MySQL
    'database': 'trinos'       # Base de datos que creaste
}

# Ruta para obtener todos los productos
@app.route('/api/productos', methods=['GET'])
def get_productos():
    try:
        # Conectar a la base de datos
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # Consultar los productos
        cursor.execute("SELECT * FROM producto")
        productos = cursor.fetchall()

        # Cerrar la conexión
        cursor.close()
        conn.close()

        # Devolver los productos en formato JSON
        return jsonify(productos), 200

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

# Ruta para agregar un producto
@app.route('/api/productos', methods=['POST'])
def add_producto():
    data = request.json
    try:
        # Conectar a la base de datos
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Insertar el producto
        query = "INSERT INTO producto (url_img, titulo, precio) VALUES (%s, %s, %s)"
        values = (data['url_img'], data['titulo'], data['precio'])
        cursor.execute(query, values)
        conn.commit()

        # Cerrar la conexión
        cursor.close()
        conn.close()

        return jsonify({'message': 'Producto agregado exitosamente'}), 201
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    
    
# Ruta para obtener un producto específico por ID
@app.route('/api/productos/<int:id>', methods=['GET'])
def get_producto(id):
    try:
        # Conectar a la base de datos
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # Consultar el producto por id
        cursor.execute("SELECT * FROM producto WHERE id = %s", (id,))
        producto = cursor.fetchone()  # Obtenemos solo un producto

        # Cerrar la conexión
        cursor.close()
        conn.close()

        if producto:
            return jsonify(producto), 200
        else:
            return jsonify({'error': 'Producto no encontrado'}), 404
        
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    
# Ruta para registrar un usuario
@app.route('/api/usuarios', methods=['POST'])
def register_usuario():
    data = request.json

    # Verificar que todos los campos estén presentes
    if not all(key in data for key in ['nombre', 'apellido', 'email', 'dni']):
        return jsonify({'error': 'Faltan datos necesarios'}), 400

    try:
        # Conectar a la base de datos
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Insertar el usuario en la base de datos
        query = """
            INSERT INTO usuario (nombre, apellido, email, dni)
            VALUES (%s, %s, %s, %s)
        """
        values = (data['nombre'], data['apellido'], data['email'], data['dni'])
        cursor.execute(query, values)
        conn.commit()

        # Cerrar la conexión
        cursor.close()
        conn.close()

        return jsonify({'message': 'Usuario registrado exitosamente'}), 201

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    
@app.route('/api/login', methods=['POST'])
def login_usuario():
    data = request.json

    # Verificar que los campos necesarios estén presentes
    if not all(key in data for key in ['email', 'dni']):
        return jsonify({'error': 'Faltan datos necesarios para iniciar sesión'}), 400

    try:
        # Conectar a la base de datos
        print("Conectando a la base de datos...")  # Agregado para saber si llegamos a la conexión
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # Consultar si el usuario existe y el DNI coincide
        query = "SELECT id, nombre, apellido, dni, email FROM usuario WHERE email = %s AND dni = %s"
        print(f"Ejecutando consulta: {query} con email = {data['email']} y dni = {data['dni']}")  # Ver consulta ejecutada
        cursor.execute(query, (data['email'], data['dni']))
        usuario = cursor.fetchone()  # Obtener el usuario

        # Cerrar la conexión
        cursor.close()
        conn.close()

        if usuario:
            # Usuario válido, devolver los datos del usuario incluyendo el ID
            return jsonify({
                'message': 'Inicio de sesión exitoso',
                'usuario': {
                    'id': usuario['id'],
                    'nombre': usuario['nombre'],
                    'apellido': usuario['apellido'],
                    'dni': usuario['dni'],
                    'email': usuario['email']
                }
            }), 200
        else:
            # Credenciales inválidas
            return jsonify({'error': 'Email o DNI incorrectos'}), 401

    except mysql.connector.Error as err:
        # Retornar el error del servidor
        print(f"Error en la base de datos: {str(err)}")  # Mostrar error en consola
        return jsonify({'error': f"Error en la base de datos: {str(err)}"}), 500

    except Exception as err:
        # Capturar cualquier otro tipo de error no relacionado con la base de datos
        print(f"Error inesperado: {str(err)}")  # Mostrar error inesperado
        return jsonify({'error': f"Error inesperado: {str(err)}"}), 500
    
@app.route('/api/usuario/<int:id>', methods=['GET'])
def obtener_usuario(id):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        
        query = "SELECT id, nombre, apellido, dni, email FROM usuario WHERE id = %s"
        cursor.execute(query, (id,))
        usuario = cursor.fetchone()
        
        cursor.close()
        conn.close()

        if usuario:
            return jsonify(usuario), 200
        else:
            return jsonify({'error': 'Usuario no encontrado'}), 404

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    
@app.route('/api/usuario/<int:id>/tokens', methods=['POST'])
def asignar_tokens(id):
    data = request.json

    # Verificar que el campo 'cantidad_tokens' esté presente
    if 'cantidad_tokens' not in data:
        return jsonify({'error': 'Falta el campo cantidad_tokens'}), 400

    try:
        # Conectar a la base de datos
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Verificar si el usuario existe
        query = "SELECT id FROM usuario WHERE id = %s"
        cursor.execute(query, (id,))
        usuario = cursor.fetchone()

        if not usuario:
            # Si el usuario no existe, retornar un error
            cursor.close()
            conn.close()
            return jsonify({'error': 'Usuario no encontrado'}), 404

        # Verificar si el usuario ya tiene tokens asignados
        query_tokens = "SELECT id, cantidad_tokens FROM tokens WHERE usuario_id = %s"
        cursor.execute(query_tokens, (id,))
        token_data = cursor.fetchone()

        if token_data:
            # token_data es una tupla, así que accedemos a los elementos por índice
            nueva_cantidad = token_data[1] + data['cantidad_tokens']  # token_data[1] es 'cantidad_tokens'
            update_query = "UPDATE tokens SET cantidad_tokens = %s WHERE usuario_id = %s"
            cursor.execute(update_query, (nueva_cantidad, id))
        else:
            # Si no tiene tokens, insertarlos por primera vez
            insert_query = "INSERT INTO tokens (usuario_id, cantidad_tokens) VALUES (%s, %s)"
            cursor.execute(insert_query, (id, data['cantidad_tokens']))

        # Guardar los cambios
        conn.commit()

        # Cerrar los cursores y la conexión
        cursor.close()
        conn.close()

        return jsonify({'message': 'Tokens asignados exitosamente'}), 200

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    

@app.route('/api/usuario/<int:id>/tokens', methods=['GET'])
def obtener_tokens(id):
    try:
        # Conectar a la base de datos
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Verificar si el usuario tiene tokens asignados
        query_tokens = "SELECT cantidad_tokens FROM tokens WHERE usuario_id = %s"
        cursor.execute(query_tokens, (id,))
        token_data = cursor.fetchone()

        if not token_data:
            # Si no tiene tokens, devolver un mensaje de error
            cursor.close()
            conn.close()
            return jsonify({'error': 'Tokens no encontrados'}), 404

        # Retornar la cantidad de tokens
        cantidad_tokens = token_data[0]  # token_data[0] es 'cantidad_tokens'
        cursor.close()
        conn.close()

        return jsonify({'cantidad_tokens': cantidad_tokens}), 200

    except mysql.connector.Error as e:
        return jsonify({'error': f'Error de base de datos: {str(e)}'}), 500

    
# Iniciar el servidor
if __name__ == '__main__':
    app.run(debug=True)
