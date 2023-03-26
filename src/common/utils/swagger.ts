import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class Swagger {
    static setup(app: INestApplication, opts: { title?: string }) {
        const options = new DocumentBuilder()
            .setTitle(opts.title || 'App Title')
            .setVersion('1.0')
            .addBearerAuth()
            .addServer('/v1')
            .build();

        const document = SwaggerModule.createDocument(app, options, {
            ignoreGlobalPrefix: true,
        });
        SwaggerModule.setup('/docs', app, document, {
            swaggerOptions: {
                // docExpansion: 'none',
                persistAuthorization: true,
            },
        });
    }
}
