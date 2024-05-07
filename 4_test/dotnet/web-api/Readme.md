# Notification bounce email detection setup

* Create an SNS topic for receiving bounce notifications
* Create an SQS standard queue and link it to the SNS topic via the "Subscribe Queue to SNS Topic" option under "Queue Actions". This queue will need to be specified in the "BOUNCED_EMAIL_QUEUE_URL" environment variable 
* Create an SES configuration set named "Bounced_Emails". Edit this set to triggered on "Bounce" and forward to the above SNS topic