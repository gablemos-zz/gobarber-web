import AppError from '@shared/errors/AppError';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

let showProfileService: ShowProfileService;
let fakeUsersRepository: FakeUsersRepository;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    const userProfile = await showProfileService.execute({
      user_id: user.id,
    });

    expect(userProfile).toBe(user);
  });

  it('should not be able to find unknown user', async () => {
    await expect(
      showProfileService.execute({
        user_id: 'wrong-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
