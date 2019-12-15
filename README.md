# Scheduled Notifications

- Serverless Application that uses AWS Step Functions along with AWS Lambda and AWS SNS to send a email at a particular time.

- Architecture:
 ![Architecture](https://drive.google.com/file/d/1SUgY4BwDQGmdXe1nogURnJVQRQL4uiGn/view?usp=sharing)

- Flow:
   - The client application (Cab Booking Site in this example) triggers the StepFunction using the following input format
   ```
   {
      dueDate: '', //time at which email should be sent, in ISO8061 string format
      email: { // details of the email
        'to': "",
        'subject': '',
        body_text: '',
        body_html: ''
      }
   }
   ```

   - The AWS Step Function, defined using `CloudFormation` tempate `scheduler/template.yaml` will create 2 steps, a `wait` and a `task`.

   - The `wait` step waits till the given time.

   - After the wait is complete, the `task` step will trigger a lambda, defined in `mailer/template.yaml` which will be sending the mail with the given details via `Amazon SES`.

- **Pros** : 
 - **Highly Scaleable**: The service is infinitely scaleable since AWS Lambda, AWS StepFunctions and SES are scaleable by design. No extra time or effort is required to scale these. (There might be some thing in regards to AWS service limits which depends on account to account.)
 - **Pay Per Use**: Unlike running a compute instance 24/7, we can only pay for the no of invocations, thus saving significant costs.
 - Built in monitoring and logging using AWS CloudWatch and similar services.
 - **Modular and Loosly Coupled**: Any application can easily integrate the service using AWS SDK, available for most of the languages. Also, a REST API to trigger the service can be easily exposed.
 - **Built-in Error Handling**: AWS StepFunctions and Lambda have native support for error handling and retires. Further, `CloudWatch` alarams can be set up to ensure proper reporting in case of repeated errors. 

- **Cons**
  - **Vendor Lock** : Completely relies on AWS services, thus creating a vendor lock. This is generally not an issue since and other cloud vendors also might have a similar offering.
  - **Little High in Complexity**: Although the code is fairly straight-forward, there is some complexity involved in deploying it to AWS, specially if done properly using `CloudFormation` templates. Knowledge of StepFunction, Lambda, SES, ARN, IAM roles and policies etc. is required.

- Structure of this repo
  - **README.md**: This help file.
  - **scheduler/**: Contains `CloudFormation` template for AWS StepFunction
  - **mailer/**: Contains `CloudFormation` template and code for AWS Lambda that sends mail using AWS SES
  - **cab-time-notifier/**: Sample express and react app that uses the above service to notify a user when to book a cab using Uber and Google Maps APIs.

- **Possible Improvements**:
  - Use SNS instead of SES to create a generic notifcation pipeline which can notify to multiple clients at once(SMS, Email, Mobile App etc.)
  - Create REST API to trigger the application, removing dependency on AWS SDK.
  - Have provision of using other mail clients like MailChimp or MailGun to send emails.
  - Notification to admin via email/slack etc. in case of failures.
  - Centrailized `CloudWatch` logs from Lambda, StepFunction, SES extra and alarams.
  - More sample applications.

## Other Approaches

1. Use a rails web app and a library like `sidekiq`/`resque` and use scheduled jobs.

    - Pros:
      - Platform agnostic: Can be deployed on any cloud provider using a simple virtual machine.
      - Easy to Build: Can be build in around 100 LOC for anyone with RoR experience

    - Cons:
      - Needs to be deployed, maintained and scaled manually (as in AWS will not do it for us).
      - Minimum associated cost for running at least 2 servers (rails web app and  sidekiq workers ) unlike Pay-per-use model offered by AWS services.
      - Handle and configure mail services.
      - Need to use redis which is internally used by sidekiq.

2. Use a similar approach as mentioned above in some other language like Python/Java/NodeJS using a similar scheduling library. The ruby solution is detailed since I have worked with RoR recently. This approach is also dependent on language and library used for scheduling a features offered by the library.

3. Insert the incoming emails to be sent along with the time to into a datastore (redis/some SQL like database). Run a cron server to query the datastore every N seconds ( 1 < N < 300) depending upon the constraints and process the emails, marking the processed ones.

  - Pros:
      - Easy to implement, language and library agnostic.
      - Built in retry and failover mechanism

  - Cons:
      - Need to deploy, manage and scale the cron and the datastore
      - Lot of unneccesary polling for the datastore.
      - Will be most expensive solution among all.

