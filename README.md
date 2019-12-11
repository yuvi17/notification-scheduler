# Scheduled Emails

- Serverless Application that uses AWS Step Functions along with AWS Lambda and AWS SNS to send a email at a particular time.

- It exposes a generic API which can be used to trigger the scheduler.

- API Signature

POST call to `/schedule` with message body as 
```
{
  "reciever_details": {
    "to": "",
    "name": "", 
  }
  "scheduled_time" : "",
  "body": "",
  "subject": ""
}

```



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

