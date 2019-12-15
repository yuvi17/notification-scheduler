import json
import boto3
from botocore.exceptions import ClientError


def lambda_handler(event, context):
    print(event)
    body = event['body']
    
    send_email(body)

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "hello world",
        }),
    }

# TODO: PICK THESE UP FROM ENV
SENDER='kumaryuvraj118@gmail.com'

AWS_REGION = "us-east-1"        

CHARSET = "UTF-8"

def send_email(options={}):
    # Create a new SES resource and specify a region.
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
