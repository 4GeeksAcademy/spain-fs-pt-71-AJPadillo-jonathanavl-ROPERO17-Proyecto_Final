from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_cors import CORS
from itsdangerous import URLSafeTimedSerializer
import os

app = Flask(__name__)
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://special-computing-machine-4j75xj56xq9x37vqr-3000.app.github.dev')
CORS(app, resources={r"/*": {"origins": FRONTEND_URL}})

def cors_response(response):
    response.headers.add('Access-Control-Allow-Origin', FRONTEND_URL)
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Configuración de correo
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

mail = Mail(app)

def generate_reset_token(email):
    s = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    return s.dumps(email, salt='password-reset-salt')

@app.route('/ForgotPassword', methods=['POST'])
def send_reset_email():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'message': 'Correo electrónico es requerido'}), 400

    reset_token = generate_reset_token(email)
    reset_url = f'{os.environ.get("FRONTEND_URL")}/reset-password/{reset_token}'

    msg = Message('Restablece tu contraseña', sender=app.config['MAIL_USERNAME'], recipients=[email])
    msg.body = f'Para restablecer tu contraseña, haz clic en el siguiente enlace: {reset_url}'

    try:
        mail.send(msg)
        return jsonify({'message': 'Correo enviado con éxito'}), 200
    except Exception as e:
        print(f"Error al enviar el correo: {str(e)}")
        return jsonify({'message': 'Error al enviar el correo', 'error': str(e)}), 500

@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('newPassword')

    if not token or not new_password:
        return jsonify({'message': 'Token y nueva contraseña son requeridos'}), 400

    try:
        s = URLSafeTimedSerializer(app.config['SECRET_KEY'])
        email = s.loads(token, salt='password-reset-salt', max_age=3600)  # El token expira después de 1 hora
        
        # Aquí iría la lógica para actualizar la contraseña en su base de datos
        # Por ejemplo: user = User.query.filter_by(email=email).first()
        #              user.set_password(new_password)
        #              db.session.commit()

        return jsonify({'message': 'Contraseña restablecida con éxito'}), 200
    except:
        return jsonify({'message': 'Token inválido o expirado'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=3001)