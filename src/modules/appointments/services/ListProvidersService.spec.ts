// import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';

let listProvidersService: ListProvidersService;
let fakeUsersRepository: FakeUsersRepository;

describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProvidersService = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list providers', async () => {
    const firstUser = await fakeUsersRepository.create({
      name: 'First User',
      email: 'firstuser@exemple.com',
      password: '123456',
    });

    const secondUser = await fakeUsersRepository.create({
      name: 'Second user',
      email: 'seconduser@exemple.com',
      password: '123456',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Logged user',
      email: 'loggeduser@exemple.com',
      password: '123456',
    });

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([firstUser, secondUser]);
  });
});
