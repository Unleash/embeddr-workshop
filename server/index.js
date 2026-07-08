import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { startUnleash } from './unleash.js';
import healthRoutes from './routes/health.js';
import openerRoutes from './routes/opener.js';
import ickRoutes from './routes/ick.js';
import qrRoutes from './routes/qr.js';

// Request logging off: with six cards polling every few seconds it drowns
// the logs that matter during the workshop (sync status, warnings, icks).
const app = Fastify({ logger: true, disableRequestLogging: true });

await app.register(cors, {
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
});

startUnleash(app.log);

await app.register(healthRoutes);
await app.register(openerRoutes);
await app.register(ickRoutes);
await app.register(qrRoutes);

// Deployed mode: one process serves both the API and the frontend build.
// Registered API routes always win; unknown GET paths fall back to the SPA.
// During the workshop the frontend runs on Vite instead, so a missing dist
// changes nothing.
const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
if (existsSync(distDir)) {
  await app.register(fastifyStatic, { root: distDir });
  app.setNotFoundHandler((request, reply) => {
    const acceptsHtml = (request.headers.accept ?? '').includes('text/html');
    if (request.method === 'GET' && acceptsHtml) {
      return reply.sendFile('index.html');
    }
    return reply.code(404).send({ error: 'not found' });
  });
  app.log.info('serving the frontend build from dist');
}

const port = Number(process.env.PORT) || 3001;
await app.listen({ port, host: '0.0.0.0' });
