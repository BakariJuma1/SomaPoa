
import cloudinary
from cloudinary.uploader import upload 
import os
import logging
from dotenv import load_dotenv

load_dotenv() 


cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

logger = logging.getLogger(__name__)

def upload_file_to_cloudinary(file, folder="soma-poa/documents"):
    """
    Upload a file-like object to Cloudinary and return the secure URL.
    """
    try:
        result = upload(file, folder=folder)
        return result.get("secure_url")
    except Exception as e:
        logger.error("Cloudinary upload failed: %s", e)
        raise
