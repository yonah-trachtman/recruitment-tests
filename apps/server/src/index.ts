import { start } from '@base-backend';
import { apiRouter, authStrategy } from './api/routes/apiRouter';
import { watchDB } from './services/sse';
import { authorizer } from '@auth-backend';

start(apiRouter, [authorizer(authStrategy)], [], watchDB);
