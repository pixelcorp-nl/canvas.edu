import { r } from './_redis'

interface RateLimitOptions {
	// Name of the route being called.
	route: string
	// Amount of time over which the requests function tracks the number of requests.
	timePeriodSeconds: number
	// Max amount of requsts over that time.
	maxRequests: number
}

export async function ratelimit(identifier: string | undefined | null, options: RateLimitOptions): Promise<{ success: boolean; timeToWait?: number }> {
	try {
		identifier = identifier?.replace(/:/g, '_') // temporary until we stop using ipv4/6 addresses as identifiers : is used for defining sub keys in redis
		const now = Date.now()
		const cutoff = now - options.timePeriodSeconds * 1000
		const requests = await r.zrangebyscore(`ratelimit:${options.route}:(${identifier})`, cutoff, now)
		if (requests.length >= options.maxRequests) {
			const oldestRequestTime = parseInt(requests[0] as string, 10)
			const timeToWait = Math.max(oldestRequestTime + options.timePeriodSeconds * 1000 - now, 0) // in milliseconds
			return { success: false, timeToWait }
		} else {
			await r.zadd(`ratelimit:${options.route}:(${identifier})`, now, now.toString())
			await r.expire(`ratelimit:${options.route}:(${identifier})`, options.timePeriodSeconds)
			return { success: true }
		}
	} catch (err) {
		console.error('Error ratelimiting:', err)
		return { success: false }
	}
}
