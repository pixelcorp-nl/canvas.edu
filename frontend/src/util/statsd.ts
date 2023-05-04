import { StatsD as StatsDObj, type ClientOptions } from 'hot-shots'

export class StatsD {
	private client: StatsDObj
	private globalPrefix: string
	constructor(globalPrefix: string, opt?: Partial<ClientOptions>) {
		const defaultOpt: ClientOptions = {
			port: 8125,
			host: 'datadog-agent', // TODO use env
			errorHandler: console.error,
		}
		this.client = new StatsDObj({ ...defaultOpt, ...opt })
		if (!this.isValidDataDogStr(globalPrefix)) {
			throw new Error(`Invalid globalPrefix ${globalPrefix}`)
		}
		this.globalPrefix = globalPrefix
	}

	public increment(stat: string, tag?: string): void {
		if (!this.isValidDataDogStr(stat)) {
			return console.error(`Invalid stat ${stat}`)
		}
		if (tag && !this.isValidDataDogStr(tag)) {
			return console.error(`Invalid tag ${tag} for stat ${stat}`)
		}
		this.client.increment(`${this.globalPrefix}-${stat}`, tag ? [tag] : [])
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
