import { Global, Module } from '@nestjs/common';
import { AppConfigService } from 'src/modules/configs/config.service';

@Global()
@Module({
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule { }
