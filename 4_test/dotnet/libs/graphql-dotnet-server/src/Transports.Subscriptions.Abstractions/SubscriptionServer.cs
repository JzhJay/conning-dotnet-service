﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;
using Microsoft.Extensions.Logging;

namespace GraphQL.Server.Transports.Subscriptions.Abstractions
{
    /// <summary>
    ///     Subscription server
    ///     Acts as a message pump reading, handling and writing messages
    /// </summary>
    public class SubscriptionServer : IServerOperations
    {
        private readonly ILogger<SubscriptionServer> _logger;
        private readonly IEnumerable<IOperationMessageListener> _messageListeners;
        private ActionBlock<OperationMessage> _handler;

        public SubscriptionServer(
            IMessageTransport transport,
            ISubscriptionManager subscriptions,
            IEnumerable<IOperationMessageListener> messageListeners,
            ILogger<SubscriptionServer> logger)
        {
            _messageListeners = messageListeners;
            _logger = logger;
            Subscriptions = subscriptions;
            Transport = transport;
        }

        public IMessageTransport Transport { get; }

        public ISubscriptionManager Subscriptions { get; }

        public IReaderPipeline TransportReader { get; set; }

        public IWriterPipeline TransportWriter { get; set; }

        public async Task OnConnect()
        {
            //_logger.LogDebug("Connected...");
            LinkToTransportWriter();
            LinkToTransportReader();

            //LogServerInformation();

            // when transport reader is completed it should propagate here
            try
            {
                await _handler.Completion;
            }
            catch (AggregateException )
            {
                return;
            }

            // complete write buffer
            await TransportWriter.Complete();
            await TransportWriter.Completion;
        }

        public Task OnDisconnect()
        {
            return Terminate();
        }

        public async Task Terminate()
        {
            foreach (var subscription in Subscriptions)
                await Subscriptions.UnsubscribeAsync(subscription.Id);

            // this should propagate to handler completion
            await TransportReader.Complete();
        }

        private void LogServerInformation()
        {
            // list listeners
            var builder = new StringBuilder();
            builder.AppendLine("Message listeners:");
            foreach (var listener in _messageListeners)
                builder.AppendLine(listener.GetType().FullName);

            _logger.LogDebug(builder.ToString());
        }

        private void LinkToTransportReader()
        {
            _logger.LogDebug("Creating reader pipeline");
            TransportReader = Transport.Reader;
            _handler = new ActionBlock<OperationMessage>(HandleMessageAsync, new ExecutionDataflowBlockOptions
            {
                EnsureOrdered = true,
                BoundedCapacity = 1
            });

            TransportReader.LinkTo(_handler);
            _logger.LogDebug("Reader pipeline created");
        }

        private async Task HandleMessageAsync(OperationMessage message)
        {
            _logger.LogDebug("Handling message: {id} of type: {type}", message.Id, message.Type);
            using (var context = await BuildMessageHandlingContext(message))
            {
                await OnBeforeHandleAsync(context);

                if (context.Terminated)
                    return;

                await OnHandleAsync(context);
                await OnAfterHandleAsync(context);
            }
        }

        private async Task OnBeforeHandleAsync(MessageHandlingContext context)
        {
            foreach (var listener in _messageListeners)
            {
                await listener.BeforeHandleAsync(context);
            }
        }

        private Task<MessageHandlingContext> BuildMessageHandlingContext(OperationMessage message)
        {
            return Task.FromResult(new MessageHandlingContext(this, message));
        }

        private async Task OnHandleAsync(MessageHandlingContext context)
        {
            foreach (var listener in _messageListeners)
            {
                await listener.HandleAsync(context);
            }
        }

        private async Task OnAfterHandleAsync(MessageHandlingContext context)
        {
            foreach (var listener in _messageListeners)
            {
                await listener.AfterHandleAsync(context);
            }
        }

        private void LinkToTransportWriter()
        {
            _logger.LogDebug("Creating writer pipeline");
            TransportWriter = Transport.Writer;
            _logger.LogDebug("Writer pipeline created");
        }
    }
}