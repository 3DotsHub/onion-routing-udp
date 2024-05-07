import { Injectable, Logger } from '@nestjs/common';
import { TransportData, OpTransport, DiscoveryData, RemoteIdentities } from '../../protos/SignedPackage';
import { Message } from '../../protos/MessagePackage';

import { bootstrapMappingLocalhostPorts, bootstrapMappingSubnet255, bootstrapStatic } from 'src/peer/peer.config';
import { AddressInfo, PeerIdentity, SignedPackageForTransport, VerifiedPeer } from 'src/peer/peer.types';
import { CryptoRsaService } from 'src/crypto/crypto.rsa.service';
import { read } from 'fs';

@Injectable()
export class OpcodeCreateService {
	private readonly logger = new Logger(this.constructor.name);
	constructor(private readonly cryptoRsaService: CryptoRsaService) {}

	createDiscovery(address: string, port: number): SignedPackageForTransport {
		const opcodeData = DiscoveryData.create({ publicKey: Buffer.from(this.cryptoRsaService.getPublicKey(), 'hex') });
		const transportData = TransportData.create({ opTransport: OpTransport.DISCOVERY, opData: DiscoveryData.toBinary(opcodeData) });
		const signedPackage = this.cryptoRsaService.signTransportData(transportData);
		return {
			peer: { address, port },
			pkg: signedPackage,
		};
	}

	createDiscoveryPackages(verifiedPeers: VerifiedPeer[]): SignedPackageForTransport[] {
		const numPeers: number = 10;
		const numIdentities: number = 3;
		const randomPeers: PeerIdentity[] = [];
		const randomIdentities: PeerIdentity[] = [];

		// discovery from verified peers
		const randIdx = function (): number {
			return Math.floor(Math.random() * verifiedPeers.length);
		};

		for (let cnt = 0; cnt < Math.min(verifiedPeers.length, numPeers); cnt++) {
			const p = verifiedPeers.at(randIdx());
			const address = p.address;
			const port = p.port;
			const pubkey = p.pubKey;
			randomPeers.push({ address, port, pubKey: pubkey });
		}

		for (let cnt = 0; cnt < Math.min(verifiedPeers.length, numIdentities); cnt++) {
			const p = verifiedPeers.at(randIdx());
			const address = p.address;
			const port = p.port;
			const pubKey = p.pubKey;
			randomIdentities.push({ address, port, pubKey });
		}

		const opcodeData = DiscoveryData.create({
			publicKey: Buffer.from(this.cryptoRsaService.getPublicKey(), 'hex'),
			remoteIdentities: randomIdentities.map((id) =>
				RemoteIdentities.create({
					address: Buffer.from(id.address),
					port: Buffer.from(id.port.toString()),
					pubKey: Buffer.from(id.pubKey, 'hex'),
				})
			),
		});

		const transportData = TransportData.create({ opTransport: OpTransport.DISCOVERY, opData: DiscoveryData.toBinary(opcodeData) });
		const signedPackage = this.cryptoRsaService.signTransportData(transportData);

		// bootstrapping? over Transport Layer
		if (verifiedPeers.length < 3) {
			this.logger.warn(`Bootstrapping programm for peer discovery...`);
			const verifiedPeersInfo: AddressInfo[] = verifiedPeers.map((p) => {
				return { address: p.address, port: p.port, family: 'IPv4' };
			});
			const addressInfos: AddressInfo[] = verifiedPeersInfo.concat(
				bootstrapStatic(),
				bootstrapMappingLocalhostPorts(),
				bootstrapMappingSubnet255()
			);
			const pkgs = addressInfos.map((peer: AddressInfo): SignedPackageForTransport => {
				return {
					peer,
					pkg: signedPackage,
				};
			});
			return pkgs;
		}

		const randPeerPkgs = randomPeers.map((peer: VerifiedPeer): SignedPackageForTransport => {
			return {
				peer,
				pkg: signedPackage,
			};
		});
		return randPeerPkgs;
	}
}
