/* eslint-disable no-bitwise */

export function numberToIp(ip: number): string {
	return [3, 2, 1, 0]
		.map(s => ((1 << ((s + 1) * 8)) - (1 << (s * 8)) & ip) >>> (s * 8))
		.join('.');
}

export function ipToNumber(ip: string): number {
	return ip
		.split('.')
		.map(f => parseInt(f, 10))
		.reverse()
		.reduce(
			(previous, current, index) => previous | (current << (index * 8)),
			0
		) >>> 0;
}

export function calculateBroadcast(address: number, subnet: number): number {
	return (address & subnet) | calculateWildcard(subnet);
}

export function calculateWildcard(subnet: number): number {
	return (~subnet & 4294967295) >>> 0;
}

export function calculateNetworkIp(ip: number, subnet: number): number {
	return (ip & subnet) >>> 0;
}

export function* createNetworkIpIterator(ip: number, subnet: number): Iterable<number> {
	const wildcard = calculateWildcard(subnet);
	const network = calculateNetworkIp(ip, subnet);
	for (let i = 0; i < wildcard; i++) {
		yield network + i;
	}
}
