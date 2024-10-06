import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './model/user.model';
import { CreateUserDto, UserType } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async findUserById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User Not found');
    return user;
  }
  async findUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User Not found');
    return user;
  }
  async create(dto: CreateUserDto): Promise<User> {
    const isUserExists = await this.userModel.exists({ email: dto.email });
    if (isUserExists) throw new ConflictException('User is already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel({
      ...dto,
      password: hashedPassword,
      userType: UserType.USER,
    });
    return user.save();
  }
}
