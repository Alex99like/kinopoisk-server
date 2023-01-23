import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { UserModel } from "./user.model";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { genSalt, hash } from 'bcryptjs'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ModelType<UserModel>
  ) {}

  async byId(id: string): Promise<UserModel> {
    const user = await this.userModel.findById(id).exec()

    if (user) return user
    throw new NotFoundException('User not found')
  }

  async updateProfile(_id: string, data: UpdateUserDto) {
    const user = await this.userModel.findById(_id)
    const isSameUser = await this.userModel.findOne({ email: data.email })

    if (isSameUser && String(_id) !== String(isSameUser._id)) {
      throw new NotFoundException('Email busy')
    }

    if (user) {
      if (data.password) {
        const salt = await genSalt(10)
        user.password = await hash(data.password, salt)
      }
      user.email = data.email
      if (data.isAdmin || data.isAdmin === false) user.isAdmin = data.isAdmin

      await user.save()
      return
    }

    throw new NotFoundException('User not found')
  }

  async getCount() {
    return this.userModel.find().count().exec()
  }

  async getAll(searchTerm?: string): Promise<UserModel[]> {
    let options = {}

    if (searchTerm) {
      options = {
        $or: [
          {
            email: new RegExp(searchTerm, 'i'),
          },
        ],
      }
    }

    return this.userModel
      .find(options)
      .select('-password -updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .exec()
  }

  async delete(id: string): Promise<UserModel | null> {
    return this.userModel.findByIdAndDelete(id).exec()
  }
}
