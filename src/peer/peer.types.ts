export type AddressInfo = { address: string; family: string; port: number };

export type VerifiedPeer = {
	pubkey: string;
	address: string;
	port: number;
	discoveredAt: number;
	updatedAt: number;
};
