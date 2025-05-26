import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sys

# Get dynamic args
to = sys.argv[1]
subject = sys.argv[2]
body = sys.argv[3]

gmail_user = "nikola.kokotovic9@gmail.com"
app_password = "xslr vcoj mumk malp"

msg = MIMEMultipart()
msg['From'] = gmail_user
msg['To'] = to
msg['Subject'] = subject
msg.attach(MIMEText(body, 'plain'))

try:
    server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    server.login(gmail_user, app_password)
    server.send_message(msg)
    server.quit()
    print('Email sent!')
except Exception as e:
    print(f'Error: {e}')
