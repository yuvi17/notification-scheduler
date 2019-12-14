import json
import boto3
from botocore.exceptions import ClientError


def lambda_handler(event, context):
    body = json.loads(event['body'])
    
    send_email(body)

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "hello world",
            # "location": ip.text.replace("\n", "")
        }),
    }

# TODO: PICK THESE UP FROM ENV
SENDER='kumaryuvraj118@gmail.com'

# If necessary, replace us-west-2 with the AWS Region you're using for Amazon SES.
AWS_REGION = "us-east-1"

# The subject line for the email.
SUBJECT = "Amazon SES Test (SDK for Python)"

# The email body for recipients with non-HTML email clients.
BODY_TEXT = ("Amazon SES Test (Python)\r\n"
             "This email was sent with Amazon SES using the "
             "AWS SDK for Python (Boto)."
            )
            
# The HTML body of the email.
BODY_HTML = """<html>
<head></head>
<body>
  <h1>Amazon SES Test (SDK for Python)</h1>
  <p>This email was sent with
    <a href='https://aws.amazon.com/ses/'>Amazon SES</a> using the
    <a href='https://aws.amazon.com/sdk-for-python/'>
      AWS SDK for Python (Boto)</a>.</p>
</body>
</html>
"""            

# The character encoding for the email.
CHARSET = "UTF-8"

def send_email(options={}):
# Create a new SES resource and specify a region.
    print(options)
    print(options['to'])
    client = boto3.client('ses',region_name=AWS_REGION)

    # Try to send the email.
    try:
        #Provide the contents of the email.
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    options['to'],
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': CHARSET,
                        'Data': options['body_html'],
                    },
                    'Text': {
                        'Charset': CHARSET,
                        'Data': options['body_text'],
                    },
                },
                'Subject': {
                    'Charset': CHARSET,
                    'Data': options['subject'],
                },
            },
            Source=SENDER,
        )
    # Log error
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        # Log messageId
        print("Email sent! Message ID:"),
        print(response['MessageId'])
