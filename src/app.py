import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager
from api.mail_config import init_mail, mail

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# Configuración de la base de datos
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar la base de datos y la migración
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Configuración de JWT
app.config["JWT_SECRET_KEY"] = "griffithgutsberserk-88"  # Cambiar esta clave en producción
jwt = JWTManager(app)

# Configuración de Mailtrap
app.config['MAIL_SERVER'] = 'smtp.mailtrap.io'  # Usar el servidor de Mailtrap
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = '69f5ab6b4cee36'  # Coloca aquí el username de SMTP de Mailtrap
app.config['MAIL_PASSWORD'] = '658a3c675fa88e'  # Coloca aquí la contraseña de SMTP de Mailtrap
app.config['MAIL_DEFAULT_SENDER'] = 'recoverpassword@playlife.com'  # O el correo que prefieras como remitente


init_mail(app)

# Configurar la administración y comandos personalizados
setup_admin(app)
setup_commands(app)

# Registrar el Blueprint
app.register_blueprint(api, url_prefix='/api')

# Manejo de errores como JSON
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Generar el sitemap con todos los endpoints
@app.route('/')
def sitemap():
    if os.getenv("FLASK_DEBUG") == "1" or ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

# Ejecutar el servidor solo si se ejecuta directamente este archivo
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
