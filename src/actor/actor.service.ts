import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { ActorModel } from "./actor.model";
import { Types } from "mongoose";
import { ActorDto } from "./actor.dto";

@Injectable()
export class ActorService {
  constructor(
    @InjectModel(ActorModel)
    private readonly actorModel: ModelType<ActorModel>
  ) {}

  async getAll(searchTerm?: string): Promise<ActorModel[]> {
    let options = {}

    if (searchTerm) {
      options = {
        $or: [
          {
            name: new RegExp(searchTerm, 'i'),
          },
          {
            slug: new RegExp(searchTerm, 'i'),
          },
        ],
      }
    }

    return (
      this.actorModel.find(options)
        .select('-updatedAt -__v')
        .sort({
          createdAt: 'desc'
        })
        .exec()
      // this.actorModel
      //   .aggregate()
      //   .match(options)
      //   .lookup({
      //     from: 'Movie',
      //     localField: '_id',
      //     foreignField: 'actors',
      //     as: 'movies',
      //   })
      //   .addFields({
      //     countMovies: { $size: '$movies' },
      //   })
      //   .project({ __v: 0, updatedAt: 0, movies: 0 })
      //   .sort({ createdAt: -1 })
      //   .exec()
    )

    // Remove some field
    // why count movies only 1
  }

  async bySlug(slug: string): Promise<ActorModel> {
    const doc = await this.actorModel.findOne({ slug }).exec()
    if (!doc) throw new NotFoundException('Actor not Found')
    return doc
  }

  /* Admin area */

  async byId(id: string): Promise<ActorModel> {
    return this.actorModel.findById(id).exec()
  }

  async create(): Promise<Types.ObjectId> {
    const defaultValue: ActorDto = {
      name: '',
      photo: '',
      slug: '',
    }
    const actor = await this.actorModel.create(defaultValue)
    return actor._id
  }

  async update(
    id: string,
    dto: ActorDto
  ): Promise<ActorModel | null> {
    const updateDoc = this.actorModel.findByIdAndUpdate(id, dto, { new: true }).exec()
    if (!updateDoc) throw new NotFoundException('Actor not found')
    return updateDoc
  }

  async delete(id: string): Promise<ActorModel | null> {
    const deleteDoc = this.actorModel.findByIdAndDelete(id).exec()
    if (!deleteDoc) throw new NotFoundException('Actor not found')
    return deleteDoc
  }
}
