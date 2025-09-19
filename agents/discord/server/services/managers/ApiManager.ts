import http from 'node:http';
import { DiscordBotServer } from '../../DiscordBotServer';

export class ApiManager {
  private client: DiscordBotServer;
  private server?: http.Server;

  constructor(client: DiscordBotServer) {
    this.client = client;
  }

  start(): void {
    this.server = http.createServer((req, res) => {
      // TODO: build API for website

      if (req.url === '/sso/v0/') {
        // TODO: validate request
        res.writeHead(200);

        // TODO: process Api call with a service
        // TODO: perform SSO

        res.end('OK');
      } else if (req.url === '/api/v0/') {
        // TODO: validate request
        res.writeHead(200);

        // TODO: process Api call with a service

        res.end('OK');
      } else if (req.url === '/') {
        res.writeHead(200);
        // TODO: show static html page
        res.end('OK');
      } else if (req.url === '/health') {
        res.writeHead(200);
        res.end('OK');
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    const port = this.client.config.api.port || 8080;
    this.server.listen(port);
    console.info(`🌐 API server started on port ${port}`);
  }

  stop(): void {
    if (this.server) {
      this.server.close();
      console.info('🌐 API server stopped');
    }
  }
}