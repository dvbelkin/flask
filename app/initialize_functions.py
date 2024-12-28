from flask import Flask
from flask_jwt_extended import JWTManager
from app.modules.main.route import main_bp
from app.modules.auth.route import auth_bp
from app.modules.protected.route import protected_bp


def initialize_route(app: Flask):
    """
    Initialize application routes (blueprints).
    """
    with app.app_context():
        app.register_blueprint(main_bp, url_prefix="/flask")
        app.register_blueprint(auth_bp, url_prefix="/flask/auth")
        app.register_blueprint(protected_bp, url_prefix="/flask/protected")


def initialize_jwt(app: Flask):
    """
    Initialize JWT for secure authentication.
    """
    # Инициализация JWTManager
    jwt = JWTManager()
    jwt.init_app(app)
