import authFactory from './auth';
import store, { remoteDatabase } from './store';
import queriesFactory from './queries';
import observersFactory from './observers';

export const auth = authFactory(remoteDatabase());
export const queries = queriesFactory(store);
export const observers = observersFactory(store);
