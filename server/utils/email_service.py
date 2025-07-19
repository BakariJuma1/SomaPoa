import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_email_otp(to_email, otp_code):
    message = Mail(
        from_email='your_verified_sender@example.com',
        to_emails=to_email,
        subject='Your SomaPoa OTP Verification Code',
        html_content=f"<strong>Your verification code is: {otp_code}</strong><br><br>This code will expire in 30 seconds."
    )

    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        print(f"Email sent to {to_email}: {response.status_code}")
    except Exception as e:
        print(str(e))