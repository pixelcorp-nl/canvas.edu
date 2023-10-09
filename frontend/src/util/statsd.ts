import { StatsD as StatsDObj, type ClientOptions } from 'hot-shots'
import { privateEnv } from '../privateEnv'

const statsIncrement = ['pixel', 'request', 'user.signup'] as const
export type StatIncrement = (typeof statsIncrement)[number]

const statsGauge = ['connections'] as const
export type StatGauge = (typeof statsGauge)[number]

export class StatsD {
	private client: StatsDObj
	private globalPrefix: string
	constructor(globalPrefix: string, opt?: Partial<ClientOptions>) {
		const defaultOpt: ClientOptions = {
			port: privateEnv.statsdPort,
			host: privateEnv.statsdHost,
			errorHandler: console.error
		}
		this.client = new StatsDObj({ ...defaultOpt, ...opt })
		if (!this.isValidDataDogStr(globalPrefix)) {
			throw new Error(`Invalid globalPrefix ${globalPrefix}`)
		}
		console.log(`Connected to statsD: ${privateEnv.statsdHost}:${privateEnv.statsdPort}, prefix: ${globalPrefix}`)
		this.globalPrefix = globalPrefix
	}

	public increment(stat: StatIncrement, tag?: string): void {
		if (!this.validInput(stat, tag)) {
			return console.error(`Invalid increment for statsd: ${stat} ${tag}`)
		}
		this.client.increment(`${this.globalPrefix}.${stat}`, tag ? [tag] : [])
	}

	public gauge(stat: StatGauge, value: number, tag?: string): void {
		if (!this.validInput(stat, tag)) {
			return console.error(`Invalid gauge for statsd: ${stat} ${tag}`)
		}
		this.client.gauge(`${this.globalPrefix}.${stat}`, value, tag ? [tag] : [])
	}

	private validInput(stat: string, tag?: string): boolean {
		if (!this.isValidDataDogStr(stat)) {
			return false
		}
		if (tag && !this.isValidDataDogStr(tag)) {
			return false
		}
		return true
	}

	public strToTag(prefix: string, str: string): string {
		const normalized = str
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9]/g, '_')
		return `${prefix}:${normalized}`
	}

	private isValidDataDogStr(tag: string): boolean {
		return /^[a-z0-9_:]+$/.test(tag)
	}
}
