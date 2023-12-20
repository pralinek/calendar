import express, { Request, Response } from 'express';
import next from 'next';
import morgan from 'morgan';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Use Morgan middleware
  server.use(morgan('dev'));

  server.get('*', (req: Request, res: Response) => {
    return handle(req, res);
  });

  server.listen(3000, (err?: any) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});


// something
{
    "compilerOptions": {
      "target": "es5",
      "module": "commonjs",
      "strict": true,
      "esModuleInterop": true
    }
  }


  "scripts": {
    "dev": "ts-node server.ts",
    "build": "next build",
    "start": "NODE_ENV=production ts-node server.ts"
  }