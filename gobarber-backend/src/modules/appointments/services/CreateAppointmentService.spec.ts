import AppError from '@shared/errors/AppError'

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

import CreateAppointmentService from './CreateAppointmentService'

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(fakeAppointmentsRepository, fakeNotificationsRepository, fakeCacheProvider);
  })

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    })

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: 'user_id',
      provider_id: 'provider_id',
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('provider_id')
  })

  it('should not be able to create two appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 11).getTime();
    });

    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      date: appointmentDate,
      user_id: 'user_id',
      provider_id: 'provider_id',
    })

    await expect(createAppointment.execute({
      date: appointmentDate,
      user_id: 'user_id',
      provider_id: 'provider_id',
    })).rejects.toBeInstanceOf(AppError);
  })

  it('should not be able to create an appointment on the past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    })

    await expect(createAppointment.execute({
      date: new Date(2020, 4, 10, 11),
      user_id: 'user_id',
      provider_id: 'provider_id',
    })).rejects.toBeInstanceOf(AppError);
  })

  it('should not be able to create an appointment with same user provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    })

    await expect(createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: 'user_id',
      provider_id: 'user_id',
    })).rejects.toBeInstanceOf(AppError);
  })

  it('should not be able to create an appointment before 8am adn after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    })

    await expect(createAppointment.execute({
      date: new Date(2020, 4, 11, 7),
      user_id: 'user_id',
      provider_id: 'provider_id',
    })).rejects.toBeInstanceOf(AppError);

    await expect(createAppointment.execute({
      date: new Date(2020, 4, 11, 18),
      user_id: 'user_id',
      provider_id: 'provider_id',
    })).rejects.toBeInstanceOf(AppError);
  })
})
