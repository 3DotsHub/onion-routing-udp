import { Module } from '@nestjs/common';
import { OpcodeService } from './opcode.service';
import { CryptoModule } from 'src/crypto/crypto.module';
import { OpcodeSendService } from './opcode.send.service';
import { OpcodeReceiveService } from './opcode.receive.service';

@Module({
	providers: [OpcodeService, OpcodeSendService, OpcodeReceiveService],
	exports: [OpcodeService, OpcodeSendService, OpcodeReceiveService],
	imports: [CryptoModule],
})
export class OpcodeModule {}
