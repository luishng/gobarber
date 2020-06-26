import AppError from '@shared/errors/AppError'

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'

import UpdateProfileService from './UpdateProfileService'

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
  })

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Jaja',
      email: 'johnjaja@example.com'
    })

    expect(updatedUser.name).toBe('John Jaja')
    expect(updatedUser.email).toBe('johnjaja@example.com')
  })

  it('should be not able to update the profile from non-existing user', async () => {
    await expect(updateProfile.execute({
      user_id: 'non-existing-user-id',
      name: 'Test',
      email: 'test@test.com'
    })).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to change email to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'test@example.com',
      password: '123456',
    })

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Jaja',
      email: 'johndoe@example.com'
    })).rejects.toBeInstanceOf(AppError);
  })

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Jaja',
      email: 'johnjaja@example.com',
      old_password: '123456',
      password: '123123'
    })

    expect(updatedUser.password).toBe('123123')
  })

  it('should be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Jaja',
      email: 'johnjaja@example.com',
      password: '123123'
    })).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to update the password wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Jaja',
      email: 'johnjaja@example.com',
      old_password: 'wrong-old-password',
      password: '123123'
    })).rejects.toBeInstanceOf(AppError)
  })
})


