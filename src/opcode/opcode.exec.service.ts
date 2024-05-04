import { Injectable, Logger } from '@nestjs/common';
import * as dgram from 'dgram';
import { TransportData, OpTransport, SignedPackage } from '../../protos/SignedPackage';
import { Message } from '../../protos/MessagePackage';

@Injectable()
export class OpcodeExecService {
	private readonly logger = new Logger(this.constructor.name);

	execTransportDiscovery(pkg: SignedPackage, rinfo: dgram.RemoteInfo) {
		const pk = pkg.publicKey;
		const addr = rinfo.address;
		const port = rinfo.port;

		this.logger.log(`New peer discovery. ${pk.slice(0, 32)} at ${addr}:${port}`);

		// let found: boolean = false;
		// for (let peer of this.peerTransportService.verifiedPeers) {
		// 	if (peer.address == addr && peer.pubkey == pk && peer.port == port) found = true;
		// 	if (found) break;
		// }

		// if (!found) {
		// 	this.peerTransportService.verifiedPeers.push({
		// 		address: addr,
		// 		port: port,
		// 		pubkey: pk,
		// 		discoveredAt: Date.now(),
		// 		updatedAt: Date.now(),
		// 	});
		// }
	}
}
