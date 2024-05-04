import { SignedPackage } from 'protos/SignedPackage';

export type AddressInfo = { address: string; family?: string; port: number };

export type PeerIdentity = {
	address: string;
	port: number;
	pubkey: string;
};

export type VerifiedPeer = {
	pubkey: string;
	address: string;
	port: number;
	discoveredAt: number;
	updatedAt: number;
};

export type SignedPackageForTransport = {
	peer: AddressInfo;
	pkg: SignedPackage;
};
