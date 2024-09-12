from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    username = db.Column(db.String(20), unique=True, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False, default=True)
    is_admin = db.Column(db.Boolean(), unique=False, nullable=False, default=False)
    profile_image = db.Column(db.String(255), nullable=True)
    preferred_genres = db.Column(db.String(200))  # Almacena géneros preferidos como una cadena separada por comas
    events = db.relationship('Event', secondary='user_events', back_populates='attendees')
    reviews = db.relationship('Review', backref='author', lazy=True)
    posts = db.relationship('Post', backref='author', lazy=True, cascade="all, delete-orphan")  # Relación uno a muchos: un usuario puede crear varios posts
    comments = db.relationship('Comment', backref='author', lazy=True, cascade="all, delete-orphan") # Relación uno a muchos: un usuario puede crear varios comentarios

    def __repr__(self):
        return f'<User {self.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "is_active": self.is_active,
            "is_admin": self.is_admin,
            "profile_image": self.profile_image,
            "preferred_genres": self.preferred_genres,
            "events": [event.base_serialize() for event in self.events],
            "reviews": [review.serialize() for review in self.reviews],
            "posts": [post.serialize() for post in self.posts]
        }

    def base_serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "is_active": self.is_active,
            "is_admin": self.is_admin,
            "profile_image": self.profile_image,
            "preferred_genres": self.preferred_genres,
            "reviews": [review.serialize() for review in self.reviews],
            "posts": [post.serialize() for post in self.posts]
        }
    
class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, nullable=False)  # Este es el ID del juego desde la API RAWG
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=True)  # Relación con el usuario que escribió la reseña
    title = db.Column(db.String(50), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __repr__(self):
        return '<Review %r>' % self.title
    
    def serialize(self):
        return {
            "id": self.id,
            "game_id": self.game_id,
            "user_id": self.user_id,
            "username": self.author.username,  # Recupera el nombre de usuario del autor
            "title": self.title,
            "comment": self.comment,
            "created_at": self.created_at
        }
    
class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    image_url = db.Column(db.String(255))  # Columna opcional para la URL de la imagen
    attendees = db.relationship('User', secondary='user_events', back_populates='events')

    def __repr__(self):
        return f'<Event {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "date": self.date,
            "image_url": self.image_url,  # Incluye la URL de la imagen en la serialización
            "attendees": [user.base_serialize() for user in self.attendees]
        }
    
    def base_serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "date": self.date,
            "image_url": self.image_url  # Incluye la URL de la imagen también en la serialización base
        }

# Tabla de asociación para la relación muchos a muchos entre User y Event
user_events = db.Table('user_events',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('event_id', db.Integer, db.ForeignKey('events.id'), primary_key=True)
)

class Post(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)  # ID único del post
    title = db.Column(db.String(120), nullable=False)  # Título del post
    content = db.Column(db.Text, nullable=False)  # Contenido del post
    image_url = db.Column(db.String(255))  # URL de la imagen (opcional)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # ID del usuario que creó el post
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    comments = db.relationship('Comment', backref='post', lazy=True, cascade="all, delete-orphan")  # Relación uno a muchos: un post puede tener muchos comentarios

    def __repr__(self):
        return f'<Post {self.title}>'

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "image_url": self.image_url,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat(),
            "comments": [comment.serialize() for comment in self.comments]
        }
    
# Modelo de Comentario
class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)  # ID único del comentario
    content = db.Column(db.Text, nullable=False)  # Contenido del comentario
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # ID del usuario que escribió el comentario
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)  # ID del post al que pertenece el comentario

    def __repr__(self):
        return f'<Comment {self.id} for Post {self.post_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "user_id": self.user_id,
            "post_id": self.post_id
        }
