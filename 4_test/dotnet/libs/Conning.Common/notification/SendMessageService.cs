using System.Collections.Generic;
using Amazon;

using System.Threading;
using System.Threading.Tasks;
using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using Amazon.SimpleNotificationService;
using Amazon.SimpleNotificationService.Model;
using Amazon.Util; // Amazon.Util.EC2InstanceMetadata
using Microsoft.Extensions.Options;

namespace Conning.Common
{
    public class SendMessageService
    {
        private readonly IOptions<AdviseAppSettings> _settings;
        public AmazonSimpleEmailServiceClient email { get; private set; }

        private AdviseAppSettings settings
        {
            get { return _settings.Value; }
        }

        public AmazonSimpleNotificationServiceClient sns { get; private set; }

        public SendMessageService( IOptions<AdviseAppSettings> settings)
        {
            _settings = settings;
            RegionEndpoint region = this.settings.aws.region;
            RegionEndpoint ses_region = this.settings.email.region;
            sns = new AmazonSimpleNotificationServiceClient(ses_region);
            email = new AmazonSimpleEmailServiceClient(ses_region);
        }


        public async Task<SendEmailResponse> sendEmail(string emailAddress, string subject, string body)
        {
            var sendRequest = new SendEmailRequest
            {
                Source = settings.email.notification,

                Destination = new Destination
                {
                    ToAddresses = new List<string> {emailAddress},
                },
                Message = new Amazon.SimpleEmail.Model.Message()
                {
                    Subject = new Content(subject),
                    Body = new Body
                    {
                        Html = new Content
                        {
                            Charset = "UTF-8",
                            Data = body
                        },
                        Text = new Content
                        {
                            Charset = "UTF-8",
                            Data = body
                        }
                    }
                },
                ConfigurationSetName = settings.aws.bouncedEmailConfigurationSet
            };

            if(!string.IsNullOrEmpty(settings.aws.sesSourceArn))
            {
                sendRequest.SourceArn = settings.aws.sesSourceArn;
            }

            return await email.SendEmailAsync(sendRequest);
        }

        public async Task<PublishResponse> sendText(string phoneNumber, string message)
        {
            var publishRequest = new PublishRequest
            {
                Message = message,
                PhoneNumber = $"+{phoneNumber}"
            };

            // default message type (promotional) may be blocked by some carriers
            publishRequest.MessageAttributes["AWS.SNS.SMS.SMSType"] =
                new MessageAttributeValue{ StringValue = "Transactional", DataType = "String"};

            return await sns.PublishAsync(publishRequest);
        }
    }
}
