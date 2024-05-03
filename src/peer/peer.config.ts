import { AddressInfo } from './peer.types';

export const bootstrapStatic: AddressInfo[] = [
	{
		address: '127.0.0.1',
		family: 'IPv4',
		port: 42069,
	},
	{
		address: '127.0.0.1',
		family: 'IPv4',
		port: 42070,
	},
	{
		address: '127.0.0.1',
		family: 'IPv4',
		port: 42071,
	},
];

export function bootstrapMappingLocalhostPorts(): AddressInfo[] {
	const address: string = '127.0.0.1';
	const family: string = 'IPv4';
	const port: number = 42069;

	const addr: AddressInfo[] = [];
	for (let i = 0; i < 256; i++) {
		addr.push({
			address,
			family,
			port: port + i,
		});
	}

	return addr;
}

export function bootstrapMappingSubnet255(): AddressInfo[] {
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
