import { forwardRef, Module } from '@nestjs/common';

import { CryptoModule } from 'src/crypto/crypto.module';
import { OpcodeModule } from 'src/opcode/opcode.module';

import { PeerHandleService } from 'src/peer/peer.handle.service';
import { PeerTransportService } from './peer.transport.service';

@Module({
	providers: [PeerHandleService, PeerTransportService],
	exports: [PeerHandleService, PeerTransportService],
	imports: [CryptoModule, forwardRef(() => OpcodeModule)],
})
export class PeerModule {}
