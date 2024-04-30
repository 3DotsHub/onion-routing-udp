import { AddressInfo } from './peer.types';

export const bootstrapV0: AddressInfo[] = [
	{
		address: '172.17.0.5',
		family: 'IPv4',
		port: 42069,
	},
	{
		address: '172.17.0.6',
		family: 'IPv4',
		port: 42069,
	},
	{
		address: '172.17.0.7',
		family: 'IPv4',
		port: 42069,
	},
];

export function bootstrapMappingTo255(): AddressInfo[] {
	const addressPrefix: string = '172.17.0.';
	const family: string = 'IPv4';
	const port: number = 42069;
	const start: number = 2;

	const addr: AddressInfo[] = [];
	for (let i = start; i < 256; i++) {
		addr.push({
			address: `${addressPrefix}${i}`,
			family,
			port,
		});
	}

	return addr;
}
