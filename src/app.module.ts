import { Module } from '@nestjs/common';

// Module
import { ScheduleModule } from '@nestjs/schedule';
import { CryptoBitcoinService } from './crypto/crypto.bitcoin.service';
import { CryptoRsaService } from './crypto/crypto.rsa.service';
import { CryptoEncryptService } from './crypto/crypto.encrypt.service';
import { PeerTransportService } from './peer/peer.transport.service';
import { PeerHandleService } from './peer/peer.handle.service';
import { OpcodeTransportService } from './opcode/opcode.transport.service';
import { OpcodeCreateService } from './opcode/opcode.create.service';
import { OpcodeExecService } from './opcode/opcode.exec.service';

@Module({
	providers: [
		PeerTransportService,
		PeerHandleService,
		CryptoBitcoinService,
		CryptoRsaService,
		CryptoEncryptService,
		OpcodeTransportService,
		OpcodeCreateService,
		OpcodeExecService,
	],
	exports: [
		PeerTransportService,
		PeerHandleService,
		CryptoBitcoinService,
		CryptoRsaService,
		CryptoEncryptService,
		OpcodeTransportService,
		OpcodeCreateService,
		OpcodeExecService,
	],
	imports: [ScheduleModule.forRoot()],
	controllers: [],
})
export class AppModule {}
