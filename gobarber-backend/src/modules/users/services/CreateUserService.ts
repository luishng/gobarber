import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'

import IUsersRepository from '../repositories/IUsersRepository'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

import User from '../infra/typeorm/entities/User';

interface IRequestDTO {
  name: string;
  password: string;
  email: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject("CacheProvider")
    private cacheProvider: ICacheProvider,
  ) { }

  public async execute({ name, password, email }: IRequestDTO): Promise<User> {
    const checkUserEmailExists = await this.usersRepository.findByEmail(email);

    if (checkUserEmailExists) {
      throw new AppError('Email address already used')
    }

    const haskedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: haskedPassword,
    })

    await this.cacheProvider.invalidatePrefix(`providers-list`)

    return user;
  }
}

export default CreateUserService;
