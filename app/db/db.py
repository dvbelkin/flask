from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import DeclarativeBase, sessionmaker, relationship
from app.config.config import BaseConfig


# Определение базового класса
class Base(DeclarativeBase):
    pass


#######################
# Определение таблиц
#######################


class Tokens:
    __tablename__ = "tokens"
    id = Column(Integer, primary_key=True)


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    user_name = Column(String(250))
    email = Column(String(250), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_verified = Column(Boolean, nullable=False, default=False)


class Projects(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    description = Column(String(255), nullable=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)

    # Связь с таблицей AudioFile
    # audio_files = relationship("AudioFiles", back_populates="project")


class AudioFiles(Base):
    __tablename__ = "audio_files"
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    file_url = Column(String(255), nullable=False)

    # Связь с таблицей Projects
    # project = relationship("Projects", back_populates="audio_files")


########################################################################
# Соединение с базой
########################################################################


def connections():
    # app.config.from_pyfile('config.py')  # Укажите путь к файлу конфигурации
    engine = create_engine(
        BaseConfig.SQLALCHEMY_DATABASE_URI,
        echo=True,
    )
    Session = sessionmaker(bind=engine)
    return Session
