import { Module } from '@nestjs/common';

// Module
import { ScheduleModule } from '@nestjs/schedule';
import { CryptoModule } from './crypto/crypto.module';
import { PeerModule } from './peer/peer.module';
import { OpcodeModule } from './opcode/opcode.module';

@Module({
	imports: [ScheduleModule.forRoot(), CryptoModule, OpcodeModule, PeerModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
