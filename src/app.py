import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# Crear la instancia de la aplicación Flask
app = Flask(__name__)

# Configuración de CORS
CORS(app)

# Configuración de la base de datos
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar la base de datos y la migración
db.init_app(app)
MIGRATE = Migrate(app, db, compare_type=True)

# Configuración de JWT
app.config["JWT_SECRET_KEY"] = "griffithgutsberserk-88"  # Cambiar esta clave en producción
jwt = JWTManager(app)

# Registrar el Blueprint
app.register_blueprint(api, url_prefix='/api')

# Configurar la administración y comandos personalizados
setup_admin(app)
setup_commands(app)

# Manejo de errores como JSON
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Generar el sitemap con todos los endpoints
@app.route('/')
def sitemap():
    if os.getenv("FLASK_DEBUG") == "1":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# Ejecutar el servidor solo si se ejecuta directamente este archivo
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
