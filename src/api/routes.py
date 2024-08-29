"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Review, Event
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route("/login", methods=["POST"])
def login():
    # Obtiene el email y password del cuerpo de la solicitud JSON. Si no se proporcionan, se establece como None.
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    # Verifica si el email o password no fueron proporcionados
    if email is None or password is None:
        return jsonify({"msg": "Usuario o Password erroneos"}), 401
    # Busca al usuario en la base de datos por su email
    user_query = User.query.filter_by(email=email)
    user = user_query.first()  # Obtiene el primer resultado de la consulta
    # Si no se encuentra el usuario, devuelve un mensaje de error
    if user is None:
        return jsonify({"msg": "Usuario o Password erroneos"}), 401
    # Verifica que el email y password coincidan con los del usuario en la base de datos
    if user.email != email or user.password != password:
        return jsonify({"msg": "Usuario o Password erroneos"}), 401
    # Si todo es correcto, crea un token de acceso para el usuario usando su id como identidad
    access_token = create_access_token(identity=user.id)
    # Devuelve el token de acceso como respuesta JSON
    return jsonify(access_token=access_token)

@api.route('/signup', methods=['POST'])
def create_user():
    # Obtiene los datos del cuerpo de la solicitud JSON
    data = request.json
    # Crea un nuevo usuario con el email y password proporcionados
    new_user = User(email=data['email'], password=data['password'])
    # Añade el nuevo usuario a la sesión de la base de datos
    db.session.add(new_user)
    # Confirma los cambios en la base de datos (guarda el nuevo usuario)
    db.session.commit()
    # Devuelve los datos del nuevo usuario como respuesta JSON
    return jsonify({"user": new_user.serialize()}), 200

@api.route("/current-user", methods=["GET"])
@jwt_required()  # Requiere que el usuario esté autenticado con JWT
def get_current_user():
    # Obtiene la identidad del usuario actual desde el token JWT
    current_user_id = get_jwt_identity()
    # Verifica si no se encontró la identidad del usuario
    if current_user_id is None:
        return jsonify({"msg": "Usuario no encontrado"}), 401
    # Busca al usuario en la base de datos usando su id
    user_query = User.query.get(current_user_id)
    # Si no se encuentra el usuario, devuelve un mensaje de error
    if user_query is None:
        return jsonify({"msg": "Usuario no encontrado"}), 401
    # Serializa los datos del usuario para enviarlos como JSON
    user = user_query.serialize()
    # Devuelve los datos del usuario actual como respuesta JSON
    return jsonify(current_user=user), 200

@api.route('/reviews/<int:game_id>', methods=['GET'])
def get_reviews(game_id):
    reviews = Review.query.filter_by(game_id=game_id).all()
    return jsonify([review.to_dict() for review in reviews])

@api.route('/reviews', methods=['POST'])
def add_review():
    data = request.json
    new_review = Review(
        game_id=data['game_id'],
        username=data['username'],
        title=data['title'],
        comment=data['comment'],
    )
    db.session.add(new_review)
    db.session.commit()
    return jsonify(new_review.to_dict()), 201

@api.route('/reviews/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    review = Review.query.get_or_404(review_id)
    db.session.delete(review)
    db.session.commit()
    return jsonify({"message": "Review deleted successfully"}), 200

@api.route('/reviews/<int:review_id>', methods=['PUT'])
def update_review(review_id):
    # Obtener la reseña existente usando el ID
    review = Review.query.get_or_404(review_id)
    # Obtener los datos enviados en la solicitud
    data = request.json
    # Actualizar los campos de la reseña si están presentes en los datos
    if 'title' in data:
        review.comment = data['title']
    if 'comment' in data:
        review.comment = data['comment']
    # Guardar los cambios en la base de datos
    db.session.commit()
    # En la respuesta JSON, convierte la instancia del modelo Review en un diccionario de Python.
    return jsonify(review.to_dict()), 200

@api.route('/update-avatar', methods=['PUT'])
@jwt_required()
def update_avatar():
    user_id = get_jwt_identity()
    data = request.get_json()
    new_avatar_url = data.get('avatar')
    # Verificar si se proporciona una nueva imagen
    if not new_avatar_url:
        return jsonify({"msg": "No image URL provided"}), 400
    # Buscar al usuario en la base de datos
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    # Actualizar la imagen de perfil del usuario
    user.profile_image = new_avatar_url
    db.session.commit()
    # Serializar y devolver la información actualizada del usuario
    return jsonify(user.serialize()), 200

@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    all_users = list(map(lambda x: x.serialize(), users))
    return jsonify(all_users), 200

@api.route('/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    return jsonify([event.serialize() for event in events])

@api.route('/events', methods=['POST'])
def add_event():
    data = request.json
    new_event = Event(
        name=data['name'],
        description=data['description'],
        date=data['date']  # Asegúrate de que la fecha esté en un formato correcto, como ISO 8601
    )
    db.session.add(new_event)
    db.session.commit()
    return jsonify(new_event.serialize()), 201

@api.route('/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    event = Event.query.get_or_404(event_id)
    data = request.json
    
    event.name = data.get('name', event.name)
    event.description = data.get('description', event.description)
    event.date = data.get('date', event.date)  # Nuevamente, asegúrate de que la fecha esté en un formato correcto
    
    db.session.commit()
    return jsonify(event.serialize()), 200

@api.route('/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    event = Event.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Event deleted successfully"}), 200

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200