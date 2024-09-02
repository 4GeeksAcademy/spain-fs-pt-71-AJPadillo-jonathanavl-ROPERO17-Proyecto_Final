from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    username = db.Column(db.String(20), unique=True, nullable=True)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False, default=True)
    profile_image = db.Column(db.String(255), nullable=True)
    preferred_genres = db.Column(db.String(200))  # Almacena géneros preferidos como una cadena separada por comas
    events = db.relationship('Event', secondary='user_events', back_populates='attendees')
    reviews = db.relationship('Review', backref='author', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "is_active": self.is_active,
            "profile_image": self.profile_image,
            "preferred_genres": self.preferred_genres,
            "events": [event.serialize() for event in self.events],
            "reviews": [review.serialize() for review in self.reviews]
        }
    
class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, nullable=False)  # Este es el ID del juego desde la API RAWG
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=True)  # Relación con el usuario que escribió la reseña
    title = db.Column(db.String(50), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def to_dict(self):
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
    # Relación muchos a muchos con usuarios
    attendees = db.relationship('User', secondary='user_events', back_populates='events')

    def __repr__(self):
        return f'<Event {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "date": self.date,
            "attendees": [user.serialize() for user in self.attendees]
        }

# Tabla de asociación para la relación muchos a muchos entre User y Event
user_events = db.Table('user_events',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('event_id', db.Integer, db.ForeignKey('events.id'), primary_key=True)
)
