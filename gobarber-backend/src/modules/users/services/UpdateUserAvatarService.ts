import path from 'path'
import fs from 'fs'
import { injectable, inject } from 'tsyringe'

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError'
import User from '../infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUsersRepository'
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) { }

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("Only autheticated users can change avatar", 401);
    }

    if (user.avatar) {
      //Deletar avatar antigo

      await this.storageProvider.removeFile(user.avatar)
    }

    const filename = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = filename;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
