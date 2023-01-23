import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { TypegooseModule } from "nestjs-typegoose";
import { UserModel } from "../user/user.model";
import { ConfigModule } from "@nestjs/config";
import { GenreModel } from "./genre.model";

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: GenreModel,
        schemaOptions: {
          collection: 'Genre'
        }
      }
    ]),
    ConfigModule
  ],
  controllers: [GenreController],
  providers: [GenreService]
})
export class GenreModule {}
