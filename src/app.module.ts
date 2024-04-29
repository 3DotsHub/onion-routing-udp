import { Module } from '@nestjs/common';

// Module
import { ScheduleModule } from '@nestjs/schedule';

// Controller
import { AppController } from './app.controller';

// Service
import { AppService } from './app.service';
import { CryptoService } from './services/crypto.service';
import { PeerService } from './services/peer.service';

@Module({
	imports: [ScheduleModule.forRoot()],
	controllers: [AppController],
	providers: [AppService, CryptoService, PeerService],
})
export class AppModule {}
