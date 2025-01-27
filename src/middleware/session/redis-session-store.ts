type Callback<T = any> = (error?: Error, result?: T) => any;

/**
 * Redis Token Store Class
 * @param {any} client Redis Client
 * @param {string} [prefix="session:"] Token Prefix
 * @param {any} [serializer=JSON] Serializer
 * @param {number} [ttl=24 * 60 * 60] TTL (in seconds)
 */
export class RedisSessionStore {
	/**
	 * Redis Client
	 * @type {RedisClient}
	 */
	client: RedisClient;
	/**
	 * Prefix of token
	 * @type {string}
	 */
	prefix?: string;
	/**
	 * Serializer (default JSON)
	 * @type {any}
	 */
	serializer?: any | JSON;
	/**
	 * TTL (in seconds)
	 * @type {number}
	 */
	ttl?: number;

	/**
	 * Constructor
	 * @param {Object} options Options
	 * @param {any} [options.client] Redis Client
	 * @param {string} [options.prefix] Prefix of Token
	 * @param {any} [options.serializer] Serializer
	 * @param {number} [options.ttl] TTL (in seconds)
	 */
	constructor(options: { client: RedisClient; prefix?: string; serializer?: any; ttl?: number }) {
		if (!options.client) {
			throw new Error('A client must be directly provided to the TokenStore');
		}
		/**
		 * Prefix of token
		 * @type {string}
		 */
		this.prefix = options.prefix ? options.prefix : 'session:';
		/**
		 * Redis Client
		 * @type {any}
		 */
		this.client = options.client;
		/**
		 * Serializer
		 * @type {any}
		 * @default JSON
		 */
		this.serializer = options.serializer || JSON;
		/**
		 * TTL (in seconds)
		 * @type {number}
		 * @default "24 * 60 * 60"
		 */
		this.ttl = options.ttl || 24 * 60 * 60;
	}

	/**
	 * Get Session by ID
	 * @param {string} sid Session ID
	 */
	get(sid: string): Promise<any> {
		const key = this.prefix + sid;
		return this.client.get(key).then((data) => {
			if (data) {
				return this.serializer.parse(data);
			} else {
				return null;
			}
		});
	}

	/**
	 * Set Session - Save Session
	 * @param {string} sid Session ID
	 * @param {any} sess Session Data
	 */
	set(sid: string, sess: any): Promise<any> {
		return this.client.set(this.prefix + sid, this.serializer.stringify(sess), {
			EX: this._getTTL(sess),
		});
	}

	/**
	 * Calculate and return TTL from Session Data using `_expiry` value
	 * @param {any} sess Session Data
	 */
	_getTTL(sess: any): number {
		if (sess && sess._expiry) {
			const _sessionExpiry = Number(new Date(sess._expiry));
			const _currentTime = Number(Date.now());
			const _differenceInMilliseconds = _sessionExpiry - _currentTime;
			return Math.ceil(_differenceInMilliseconds / 1000); // Time is seconds
		} else {
			return this.ttl; // Time in seconds
		}
	}

	/**
	 * Touch Session - Set Expiry of the session in Redis by using `_expiry` value
	 * @param {string} sid Session ID
	 * @param {any} sess Session Data
	 */
	touch(sid: string, sess: any): Promise<any> {
		const key = this.prefix + sid;
		return this.client.expire(key, this._getTTL(sess)).then((result) => {
			if (result) {
				return 'OK';
			} else {
				return 'EXPIRED';
			}
		});
	}

	/**
	 * Destroy Session by ID
	 * @param {string} sid Session ID
	 */
	destroy(sid: string): Promise<any> {
		const key = this.prefix + sid;
		return this.client.del(key);
	}
}
