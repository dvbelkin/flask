from flask import (
    Blueprint,
    make_response,
    jsonify,
    send_from_directory,
    request,
    url_for,
    flash,
    redirect,
    render_template,
    abort,
)


from .controller import MainController, ApiController
import os


# Создаем экземпляр Flask приложения

main_bp = Blueprint(
    "main",
    __name__,
    static_folder="../../static",  # Путь к папке `static` относительно модуля
)


main_controller = MainController()
api = ApiController()


@main_bp.route("/")
def index():
    return render_template("main.html")


# POST запрос на сохранение файла
@main_bp.route("/api/upload", methods=["POST"])
def upload_file():
    return api.upload_file()
