from flask import Flask
from app.config.config import get_config_by_name
from app.initialize_functions import initialize_route, initialize_jwt
from app.db.db import connections


def create_app(config=None) -> Flask:
    """
    Create a Flask application.

    Args:
        config: The configuration object to use.

    Returns:
        A Flask application instance.
    """
    app = Flask(__name__)

    if config:
        app.config.from_object(get_config_by_name(config))

    # Initialize JWT extension and configure it with Flask-JWT-Extended
    initialize_jwt(app)

    # Register blueprints
    initialize_route(app)

    return app
