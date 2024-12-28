from os import error
from flask import (
    Blueprint,
    request,
    render_template,
    redirect,
    url_for,
    flash,
    session as flash_session,
    jsonify,
    make_response,
)
from sqlalchemy.orm import sessionmaker
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    unset_jwt_cookies,
    get_jwt_identity,
    get_jwt,
)
from werkzeug.security import generate_password_hash, check_password_hash
from app.db.db import Projects, User, AudioFiles, connections
import ipdb

# from main.controller import MainController, ApiController


protected_bp = Blueprint("protected", __name__, static_folder="static")


@protected_bp.route("/start", methods=["GET"])
@jwt_required()
def start():

    current_user = get_jwt_identity()
    claims = get_jwt()
    user_name = claims.get("name")

    return render_template("start.html", user=current_user, user_name=user_name)


@protected_bp.route("/projects_list", methods=["GET"])
@jwt_required()
def projects_list():

    claims = get_jwt()
    user_id = claims.get("id")

    Session = connections()

    with Session() as db_session:
        try:
            projects = (
                db_session.query(
                    Projects.id,
                    Projects.name,
                    Projects.description,
                    Projects.user_id,
                    AudioFiles.file_url,
                )
                .filter_by(user_id=user_id)
                .join(AudioFiles, Projects.id == AudioFiles.project_id, isouter=True)
                .all()
            )

            if projects:
                # Формируем список данных о проектах

                projects_data = [
                    {
                        "name": project.name,  # Имя проекта
                        "user_id": project.user_id,  # ID пользователя
                        "id": project.id,  # ID проекта
                        "desc": project.description,  # Описание проекта
                        "audio_files": project.file_url,  # ссылка на MP3 файл
                    }
                    for project in projects
                ]
                return jsonify(projects_data)  # Возвращаем список проектов

            # Если проектов нет
            return jsonify({"message": "Нет проекта у пользователя"})

        except Exception as e:
            db_session.rollback()
            # flash("Error occurred: " + str(e), "danger")
            return jsonify({"error": f"Database error {e}"}), 500
