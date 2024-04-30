export type AddressInfo = { address: string; family: string; port: number };

export type VerifiedPeer = {
	pubkey?: string;
	address: string;
	port: number;
	outputStats: {
		discover: number;
		updatedAt: Date;
	};
	inputStats: {
		discover: number;
		updatedAt: Date;
	};
};
