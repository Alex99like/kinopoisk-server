import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { UpdateUserDto } from "../user/dto/updateUser.dto";
import { GenreModel } from "./genre.model";
import { CreateGenreDto } from "./dto/create-genre.dto";
import { Types } from "mongoose";

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(GenreModel)
    private readonly genreModel: ModelType<GenreModel>
  ) {}

  async getAll(searchTerm?: string): Promise<GenreModel[]> {
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
          {
            description: new RegExp(searchTerm, 'i'),
          },
        ],
      }
    }

    return this.genreModel
      .find(options)
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .exec()
  }

  async bySlug(slug: string): Promise<GenreModel> {
    return this.genreModel.findOne({ slug }).exec()
  }

  async getPopular(): Promise<GenreModel[]> {
    return this.genreModel
      .find()
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .exec()
  }
//Promise<ICollection[]>
  async getCollections() {
    const genres = await this.getAll()
    const collection = genres

    return collection
  }

  async byId(id: string): Promise<GenreModel> {
    return this.genreModel.findById(id).exec()
  }

  async create(): Promise<Types.ObjectId> {
    const defaultValue: CreateGenreDto = {
      description: '',
      icon: '',
      name: '',
      slug: '',
    }
    const genre = await this.genreModel.create(defaultValue)
    return genre._id
  }

  async update(
    id: string,
    dto: CreateGenreDto
  ): Promise<GenreModel | null> {
    const updateDoc = this.genreModel.findByIdAndUpdate(id, dto, { new: true }).exec()

    if (!updateDoc) throw new NotFoundException('Genre not found')

    return updateDoc
  }

  async delete(id: string): Promise<GenreModel | null> {
    const deleteDoc = this.genreModel.findByIdAndDelete(id).exec()

    if (!deleteDoc) throw new NotFoundException('Genre not found')

    return deleteDoc
  }
}
