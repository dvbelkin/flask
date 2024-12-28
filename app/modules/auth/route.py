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
    create_refresh_token,
    set_access_cookies,
    set_refresh_cookies,
    jwt_required,
    unset_jwt_cookies,
    get_jwt_identity,
    get_jwt,
)
from werkzeug.security import generate_password_hash, check_password_hash
from app.db.db import User, connections
import ipdb

# from main.controller import MainController, ApiController


auth_bp = Blueprint("auth", __name__, static_folder="static")


@auth_bp.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        user_name = request.form.get("user_name")
        password_hash = generate_password_hash(password)

        Session = connections()

        with Session() as db_session:
            try:
                user = User(
                    email=email, password_hash=password_hash, user_name=user_name
                )
                exists_user = db_session.query(User).filter_by(email=email).first()

                if not exists_user:
                    db_session.add(user)
                    db_session.commit()

                    flash(f"Вы успешно зарегистрированы!", "success")
                    return redirect(url_for("auth.login"))
                else:
                    flash("Этот адрес электронной почты уже зарегистрирован!", "danger")
                    return redirect(url_for("auth.register"))

            except Exception as e:
                db_session.rollback()
                flash("Error occurred: " + str(e), "danger")
                return redirect(url_for("auth.register"))

    return render_template("register.html")


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        email = request.form.get("email")
        password = request.form.get("password")

        # присоединяемся л базе
        Session = connections()

        with Session() as db_session:
            try:
                user = User(email=email)
                exists_user = db_session.query(User).filter_by(email=email).first()

                if exists_user:
                    if check_password_hash(exists_user.password_hash, password):

                        # Create JWT token

                        access_token = create_access_token(
                            identity=user.email,
                            additional_claims={
                                "name": exists_user.user_name,
                                "id": exists_user.id,
                            },
                        )
                        # refresh_token = create_refresh_token(
                        #     identity=user.email,
                        #     additional_claims={
                        #         "name": exists_user.user_name,
                        #         "id": exists_user.id,
                        #     },
                        # )

                        # Устанавливаем токен в cookies
                        response = make_response(redirect(url_for("protected.start")))
                        set_access_cookies(response, access_token)
                        # set_refresh_cookies(response, refresh_token)

                        return response

                    else:
                        flash("Неверный email, пароль", "danger")
                        return redirect(url_for("auth.login"))
                else:
                    flash("Этот адрес электронной почты НЕ зарегистрирован!", "danger")
                    return redirect(url_for("auth.login"))

            except Exception as e:
                db_session.rollback()
                flash("Error occurred: " + str(e), "danger")
                return redirect(url_for("auth.login"))

    # При GET запросе вовращаем html
    return render_template("login.html")


@auth_bp.route("/getpass", methods=["GET", "POST"])
def getpass():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        flash("Login successful!", "success")
        return jsonify({"getpass": "Заглушка"})

    # При GET запросе вовращаем html
    return render_template("getpass.html")


@auth_bp.route("/logout", methods=["GET"])
def logout():
    response = redirect(url_for("auth.login"))
    unset_jwt_cookies(response)
    return response
