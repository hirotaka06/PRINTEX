import logging
from rest_framework.views import APIView

logger = logging.getLogger("app")


class BaseAPIView(APIView):
    def log_info(self, message):
        logger.info(message)

    def log_warning(self, message):
        logger.warning(message)

    def log_error(self, message):
        logger.error(message)

    def log_debug(self, message):
        logger.debug(message)
