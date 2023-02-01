import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { path } from 'app-root-path'

import { FilesController } from './file.controller'
import { FilesService } from './file.service'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: '/uploads',
    }),
  ],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FileModule {}