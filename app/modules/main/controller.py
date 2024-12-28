import os
import json
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


class ApiController:
    def upload_file(self):

        if "file" not in request.files:
            flash("No file part")
            return redirect(request.url)

        file = request.files["file"]

        if file.filename == "":
            flash("No selected file")
            return redirect(request.url)

        if file:
            path = "./app/static/project_file"
            os.makedirs(path, exist_ok=True)

            file_path = os.path.join(path, file.filename)
            file.save(file_path)

            flash(f"File successfully uploaded to {file_path}")
            return file_path, 200

    def load_project(self):
        return {"": ""}


class MainController:
    def index(self):
        return {"message": "Hello, World!"}
