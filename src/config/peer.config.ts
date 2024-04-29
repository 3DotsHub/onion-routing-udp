import { Peer } from '../types/peer.types';

export const bootstrapV0: Peer[] = [
	{
		address: '172.17.0.5',
		port: 42069,
	},
	{
		address: '172.17.0.6',
		port: 42069,
	},
	{
		address: '172.17.0.7',
		port: 42069,
	},
];

export function bootstrapMappingTo255(): Peer[] {
	const ipPrefix: string = '172.17.0.';
	const port: number = 42069;
	const start: number = 2;

	const peers: Peer[] = [];
	for (let i = start; i < 256; i++) {
		peers.push({
			address: `${ipPrefix}${i}`,
			port,
		});
	}

	return peers;
}
