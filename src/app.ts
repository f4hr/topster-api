import 'dotenv/config';
import { FastifyInstance } from 'fastify';

import getApp from './index';

const port = process.env.PORT || 5000;
const address = '0.0.0.0';

getApp().then((app: FastifyInstance) => {
  app.listen(port, address, () => {
    console.log(`Server has been started on ${port}`);
  });
});
