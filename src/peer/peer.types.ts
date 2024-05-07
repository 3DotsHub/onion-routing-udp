import { SignedPackage } from 'protos/SignedPackage';

export type AddressInfo = { address: string; family?: string; port: number };

export type PeerIdentity = {
	address: string;
	port: number;
	pubKey: string;
};

export type VerifiedPeer = {
	pubKey: string;
	address: string;
	port: number;
	heartBeat: number;
	discoveredAt: number;
	updatedAt: number;
};

export type SignedPackageForTransport = {
	peer: AddressInfo;
	pkg: SignedPackage;
};

export class PeerTransportStats {
	public sentPackagesCount: number = 0;
	public receivedPackagesCount: number = 0;
}
