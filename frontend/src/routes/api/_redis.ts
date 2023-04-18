import { Redis } from '@upstash/redis';
import { PRIVATE_REDIS_TOKEN, PRIVATE_REDIS_URL } from '$env/static/private';

function get_redis() {
	return new Redis({
		url: 'https://eu1-teaching-snipe-38412.upstash.io',
		token: '975747a024cc4e48b6c276830bca9ed4',
	});
}

export const r = get_redis();
