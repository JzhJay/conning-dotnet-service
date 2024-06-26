using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Conning.AWS.monitors
{
    public abstract class ScheduleMonitor
    {
        protected AwsNotificationService AwsService;
        private bool _isMonitoring;
        protected int Timer = 60000;
        protected int RetryTimer = 5000;
        private CancellationTokenSource _cancelToken;

        public ScheduleMonitor(AwsNotificationService service)
        {
            this.AwsService = service;
        }

        public bool IsMonitoring()
        {
            return _isMonitoring;
        }
        
        public void StartMonitor()
        { 
            var cancelToken = new CancellationTokenSource();
            Task.Run(async () =>
            {
                while (!cancelToken.IsCancellationRequested)
                {
                    try
                    {
                        await this.Monitoring(cancelToken);
                        await Task.Delay(this.Timer);
                    }
                    catch (OperationCanceledException e)
                    {
                        this.AwsService.getLogger().LogWarning($"Scheduled monitor [{this.GetType().Name}] has been canceled");
                    }
                    catch (Exception e)
                    {
                        this.AwsService.getLogger().LogError($"Unexpected error occured in scheduled monitor [{this.GetType().Name}]: " + e.ToString());
                        await Task.Delay(this.RetryTimer);
                    }
                }
            }, cancelToken.Token);
            this._cancelToken = cancelToken;
            this._isMonitoring = true;
        }

        public virtual async Task Monitoring(CancellationTokenSource cancellationTokenSource)
        {
        }

        public void StopMonitor()
        {
            this.AwsService.getLogger().LogInformation($"Scheduled monitor [{this.GetType().Name}] stopped monitoring.");
            this._cancelToken?.Cancel();
            this._isMonitoring = false;
        }
    }
}