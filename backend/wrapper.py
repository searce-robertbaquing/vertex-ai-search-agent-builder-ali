import functools
from google.protobuf.json_format import MessageToDict
import logging

logger = logging.getLogger(__name__)

def log_data(func):
    """Decorator to log function execution details."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            response = func(*args, **kwargs)
            return response
        except Exception as e:
            logger.error(f"Error in {func.__name__}: {e}", exc_info=True)
            raise
    return wrapper

def proto_to_dict(func):
    """Decorator that converts a Protobuf Message to a Dict."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        response = func(*args, **kwargs)
        if hasattr(response, '_pb'):
            return MessageToDict(response._pb)
        return response
    return wrapper