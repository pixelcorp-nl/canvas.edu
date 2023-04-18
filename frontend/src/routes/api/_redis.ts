import { Redis } from '@upstash/redis';
import { PRIVATE_REDIS_TOKEN, PRIVATE_REDIS_URL } from '$env/static/private';

console.log(PRIVATE_REDIS_TOKEN, PRIVATE_REDIS_URL);
export const r = new Redis({
	url: PRIVATE_REDIS_URL,
	token: PRIVATE_REDIS_TOKEN,
});
