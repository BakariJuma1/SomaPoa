import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
import os
import logging

logger = logging.getLogger(__name__)

def send_otp_email(to_email, otp_code):
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = os.getenv("BREVO_API_KEY")

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

    sender = {
        "email": os.getenv("MAIL_DEFAULT_SENDER"),
        "name": "SomaPoa"
    }

    to = [{
        "email": to_email,
        "name": to_email.split('@')[0].capitalize()
    }]

    subject = "Your SomaPoa OTP Verification Code"
    html_content = f"""
    <html>
    <body>
        <p><strong>Your verification code is: {otp_code}</strong></p>
        <p>This code will expire in 30 seconds.</p>
    </body>
    </html>
    """

    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=to,
        sender=sender,
        subject=subject,
        html_content=html_content
    )

    try:
        response = api_instance.send_transac_email(send_smtp_email)
        logger.info(f"OTP email sent to {to_email}. Response: {response}")
    except ApiException as e:
        logger.error(f"Failed to send OTP email to {to_email}. Brevo error: {e}")
