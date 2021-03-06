import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        createUser = new CreateUserService(
            fakeUserRepository,
            fakeHashProvider,
        );
        authenticateUser = new AuthenticateUserService(
            fakeUserRepository,
            fakeHashProvider,
        );
    });

    it('should be able to authenticate', async () => {
        await createUser.execute({
            name: 'jhon Doe',
            email: 'jhondoe@gmail.com',
            password: '123456',
        });

        const response = await authenticateUser.execute({
            email: 'jhondoe@gmail.com',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
    });

    it('should not be able authenticate with non existing user', async () => {
        expect(
            authenticateUser.execute({
                email: 'jhondoe@gmail.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with wrong password', async () => {
        await createUser.execute({
            name: 'jhon Doe',
            email: 'jhondoe@gmail.com',
            password: '123456',
        });

        await expect(
            authenticateUser.execute({
                email: 'jhondoe@gmail.com',
                password: 'wrong-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
