import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const body = typeof exceptionResponse === 'object' && exceptionResponse !== null ? exceptionResponse as { message?: unknown; code?: string } : undefined;
    const rawMessage = typeof exceptionResponse === 'string' ? exceptionResponse : body?.message || exception.message;
    const message = Array.isArray(rawMessage) ? rawMessage.map(String) : [String(rawMessage)];

    response.status(status).send({
      statusCode: status,
      message,
      ...(body?.code ? { code: body.code } : {}),
      timestamp: new Date().toISOString(),
    });
  }
}
