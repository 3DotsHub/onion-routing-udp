import { forwardRef, Module } from '@nestjs/common';
import { OpcodeService } from './opcode.service';
import { CryptoModule } from 'src/crypto/crypto.module';
import { OpcodeCreateService } from './opcode.create.service';
import { OpcodeExecService } from './opcode.exec.service';
import { PeerModule } from 'src/peer/peer.module';

@Module({
	providers: [OpcodeService, OpcodeCreateService, OpcodeExecService],
	exports: [OpcodeService, OpcodeCreateService, OpcodeExecService],
	imports: [CryptoModule, forwardRef(() => PeerModule)],
})
export class OpcodeModule {
	// constructor(private readonly re: PeerModule) {}
}
