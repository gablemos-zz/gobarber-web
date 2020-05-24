import AppError from '@shared/errors/AppError';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

let updateProfileService: UpdateProfileService;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Another John Doe',
      email: 'anotherjohndoe@exemple.com',
    });

    expect(updatedUser.name).toBe('Another John Doe');
    expect(updatedUser.email).toBe('anotherjohndoe@exemple.com');
  });

  it('should not be able to change to another users email', async () => {
    await fakeUsersRepository.create({
      name: 'First John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Second John Doe',
      email: 'secondjohndoe@exemple.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Another John Doe',
        email: 'johndoe@exemple.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Another John Doe',
      email: 'anotherjohndoe@exemple.com',
      old_password: '123456',
      password: 'new-password',
    });

    expect(updatedUser.password).toBe('new-password');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Another John Doe',
        email: 'johndoe@exemple.com',
        password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Another John Doe',
        email: 'johndoe@exemple.com',
        old_password: 'wrong-old-password',
        password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
