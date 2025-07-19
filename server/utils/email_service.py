from flask_mail import Message
from server.extension import mail

def send_otp_email(to_email, otp_code):
    try:
        msg = Message(
            subject='Your SomaPoa OTP Verification Code',
            recipients=[to_email],
            html=f"<strong>Your verification code is: {otp_code}</strong><br><br>This code will expire in 30 seconds."
        )
        mail.send(msg)
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")
