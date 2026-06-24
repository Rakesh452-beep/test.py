import os
import smtplib
import imaplib
import logging
import email as email_lib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders

log = logging.getLogger(__name__)

SUBJECT_PREFIX = "KSCA Updated"


def delete_old_sent_emails(sender, password, max_delete=50):
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com", 993)
        mail.login(sender, password)
        mail.select('"[Gmail]/Sent Mail"')

        result, data = mail.search(None, f'SUBJECT "{SUBJECT_PREFIX}"')
        if result == "OK":
            ids = data[0].split()
            if ids:
                delete_ids = ids[-max_delete:]
                for mid in delete_ids:
                    mail.copy(mid, '"[Gmail]/Trash"')
                    mail.store(mid, "+FLAGS", "\\Deleted")
                mail.expunge()
                log.info(f"Deleted {len(delete_ids)} old sent email(s)")

        mail.logout()
        return True
    except Exception as e:
        log.warning(f"Could not delete old emails: {e}")
        return False


def send_email(subject, body, attachments=None):
    import config

    sender = config.EMAIL_SENDER
    password = config.EMAIL_PASSWORD
    recipient = config.EMAIL_RECIPIENT

    delete_old_sent_emails(sender, password)

    msg = MIMEMultipart()
    msg["From"] = sender
    msg["To"] = recipient
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain", "utf-8"))

    if attachments:
        for filepath in attachments:
            if not os.path.exists(filepath):
                log.warning(f"Attachment not found: {filepath}")
                continue
            with open(filepath, "rb") as f:
                part = MIMEBase("application", "octet-stream")
                part.set_payload(f.read())
                encoders.encode_base64(part)
                part.add_header(
                    "Content-Disposition",
                    f'attachment; filename="{os.path.basename(filepath)}"',
                )
                msg.attach(part)

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender, password)
        server.sendmail(sender, [recipient], msg.as_string())
        server.quit()
        log.info(f"Email sent to {recipient}")
        return True
    except Exception as e:
        log.error(f"Email failed: {e}")
        return False
