class BaseConfig:
    """Base configuration."""

    DEBUG = False
    TESTING = False
    # config.py

    SQLALCHEMY_DATABASE_URI = (
        "mysql+pymysql://alcadmin:werji23w98^%(8759GHF792346@data.ms/transcript"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Отключение отслеживания изменений (рекомендуется для производительности)
    SECRET_KEY = "lkdfjg83-6-6&)*%^(6f67fc6ae5976fhjvhjkvgjsg)"

    # Добавляем ключ для JWT
    JWT_SECRET_KEY = "uyweurtqy%^8758jhvvu65976576576dfkh986*&%*"
    # указывает JWT где искать токен
    JWT_TOKEN_LOCATION = ["cookies"]  # Использовать cookies
    JWT_ACCESS_COOKIE_NAME = "access_token"
    JWT_REFRESH_COOKIE_NAME = "refresh_token"  # Название для refresh токена
    JWT_COOKIE_SECURE = False  # Установите True для HTTPS
    JWT_COOKIE_CSRF_PROTECT = False  # Выключить CSRF защиту, если она не используется


class DevelopmentConfig(BaseConfig):
    """Development configuration."""

    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///development.db"


class TestingConfig(BaseConfig):
    """Testing configuration."""

    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///testing.db"


class ProductionConfig(BaseConfig):
    """Production configuration."""

    DEBUG = False
    SQLALCHEMY_DATABASE_URI = "sqlite:///production.db"


def get_config_by_name(config_name):
    """Get config by name"""
    if config_name == "development":
        return DevelopmentConfig()
    elif config_name == "production":
        return ProductionConfig()
    elif config_name == "testing":
        return TestingConfig()
    else:
        return DevelopmentConfig()
