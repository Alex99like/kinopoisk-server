import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { prop } from "@typegoose/typegoose";
import { IsString } from "class-validator";

export interface UserModel extends Base {}

export class GenreModel extends TimeStamps {
  @prop({ unique: true })
  name: string

  @prop({ unique: true })
  slug: string

  @prop()
  description: string

  @prop()
  icon: string
}
