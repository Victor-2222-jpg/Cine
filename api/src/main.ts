import { NestFactory } from '@nestjs/core';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { CARPETA_PUBLICA } from './imagenes';

/**
 * Valida solo el cuerpo (body) de las peticiones.
 * Si también transformara los parámetros de la URL, convertiría ids como "0x2" o "1e1" en números
 * antes de que ParseIntPipe los revise, y se aceptarían ids mal escritos.
 */
class ValidacionCuerpo extends ValidationPipe {
  async transform(valor: unknown, metadata: ArgumentMetadata) {
    return metadata.type === 'body' ? super.transform(valor, metadata) : valor;
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidacionCuerpo({ whitelist: true, transform: true }));

  // Sirve las imágenes: GET /posters/1.jpg y GET /fondos/1.jpg
  app.useStaticAssets(CARPETA_PUBLICA, { maxAge: '7d' });

  const port = Number(process.env.PORT ?? 3000);
  // 0.0.0.0 para que el celular pueda conectarse desde la red local (misma red WiFi)
  await app.listen(port, '0.0.0.0');
  console.log(`API escuchando en http://localhost:${port}`);
}
bootstrap();
