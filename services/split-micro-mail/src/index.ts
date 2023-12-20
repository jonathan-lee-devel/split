import logger from './logger';
import {sendMail} from './mail';
import {makeConsumeSendMailMessage} from './rabbitmq';
import {rabbitMQConnection} from './server';

export const consumeSendMailMessage = makeConsumeSendMailMessage(
    logger,
    sendMail,
    rabbitMQConnection,
);
