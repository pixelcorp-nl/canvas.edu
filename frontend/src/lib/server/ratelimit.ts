import { r } from './redis'

interface RateLimitOptions {
	// Name of the route being called.
	route: string
	// Amount of time over which the requests function tracks the number of requests.
	timePeriodSeconds: number
	// Max amount of requests over that time.
	maxRequests: number
}

export async function rateLimit(identifier: string | undefined | null, options: RateLimitOptions): Promise<{ success: boolean; timeToWaitMs?: number }> {
	try {
		const now = Date.now()
		const cutoff = now - options.timePeriodSeconds * 1000
		const requests = await r.zrangebyscore(`ratelimit:${options.route}:(${identifier})`, cutoff, now)
		if (requests.length >= options.maxRequests) {
			const oldestRequestTime = parseInt(requests[0] as string, 10)
			const timeToWait = Math.max(oldestRequestTime + options.timePeriodSeconds * 1000 - now, 0) // in milliseconds
			return { success: false, timeToWaitMs: timeToWait }
		}
		await r.zadd(`ratelimit:${options.route}:(${identifier})`, now, now.toString())
		await r.expire(`ratelimit:${options.route}:(${identifier})`, options.timePeriodSeconds)
		return { success: true }
	} catch (err) {
		console.error('Error ratelimiting:', err)
		return { success: false }
	}
}
