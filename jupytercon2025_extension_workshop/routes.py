import base64
import json
import random
from pathlib import Path

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado

from .images_and_captions import IMAGES_AND_CAPTIONS

IMAGES_DIR = Path(__file__).parent.absolute() / "images"


class HelloRouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({
            "data": (
                "Hello, Matt!"
                " This is the '/jupytercon2025-extension-workshop/hello' endpoint."
                " Try visiting me in your browser!"
            ),
        }))


class ImageAndCaptionRouteHandler(APIHandler):
    @tornado.web.authenticated
    def get(self):
        random_selection = random.choice(IMAGES_AND_CAPTIONS)

        # Read the data and encode the bytes in base64
        with open(IMAGES_DIR / random_selection["filename"], "rb") as f:
            b64_bytes = base64.b64encode(f.read()).decode("utf-8")

        self.finish(json.dumps({
            "b64_bytes": b64_bytes,
            "caption": random_selection["caption"],
        }))


def setup_route_handlers(web_app):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]

    hello_route_pattern = url_path_join(base_url, "jupytercon2025-extension-workshop", "hello")
    image_route_pattern = url_path_join(base_url, "jupytercon2025-extension-workshop", "random-image-caption")
    handlers = [
        (hello_route_pattern, HelloRouteHandler),
        (image_route_pattern, ImageAndCaptionRouteHandler),
    ]

    web_app.add_handlers(host_pattern, handlers)
