import {VALID_QUEUE_NAME} from '@split-common/split-constants';
import amqp, {ConsumeMessage} from 'amqplib';
import winston from 'winston';

export type onMessageCallback = (message: ConsumeMessage | null) => void;

export class RabbitMQConnection {
  private connection: amqp.Connection | undefined;
  private channel: amqp.Channel | undefined;

  constructor(
    private logger: winston.Logger,
    private connectionUrl: string,
  ) {}

  public async connectQueue() {
    try {
      this.connection = await amqp.connect(this.connectionUrl);
      this.channel = await this.connection.createChannel();
    } catch (err) {
      this.logger.error(`Error initializing RabbitMQ connection: ${err}`);
    }
  }

  public async disconnectQueue() {
    try {
      await this.connection?.close();
    } catch (err) {
      this.logger.error(`Error closing RabbitMQ connection: ${err}`);
    }
  }

  public async sendData(queueName: VALID_QUEUE_NAME, data: unknown) {
    await this.channel?.assertQueue(queueName);
    await this.channel?.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  }

  public async startConsumingData(queueName: VALID_QUEUE_NAME, onMessage: onMessageCallback) {
    await this.channel?.assertQueue(queueName);
    await this.channel?.consume(queueName, onMessage);
  }

  public getChannel() {
    return this.channel;
  }
}
