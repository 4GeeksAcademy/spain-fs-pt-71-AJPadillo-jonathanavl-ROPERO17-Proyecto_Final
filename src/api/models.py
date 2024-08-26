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

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "is_active": self.is_active,
            "profile_image": self.profile_image,
            "preferred_genres": self.preferred_genres
        }