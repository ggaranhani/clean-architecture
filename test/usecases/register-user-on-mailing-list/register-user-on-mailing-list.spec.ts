import { UserData } from '../../../src/entities'
import { UserRepository } from '../../../src/usecases/register-user-on-mailing-list/ports'
import { RegisterUserOnMailingList } from '../../../src/usecases/register-user-on-mailing-list'
import { InMemoryUserRepository } from './repository'

describe('Register user on mailing list use case', () => {
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name = 'any_name'
    const email = 'any@email.com'
    const response = await usecase.registerUserOnMailingList({ name, email })
    const user = repo.findUserByEmail('any@email.com')
    expect((await user).name).toBe('any_name')
    expect(response.value.name).toBe('any_name')
  })

  test('should not add user with invalid email', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name = 'any_name'
    const invalidemail = 'invalid_email'
    const response = (await usecase.registerUserOnMailingList({ name: name, email: invalidemail })).value as Error
    const user = await repo.findUserByEmail(invalidemail)
    expect(user).toBeNull()
    expect(response.name).toEqual('InvalidEmailError')
  })

  test('should not add user with invalid name', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const invalidname = ''
    const validmail = 'valid@mail.com'
    const response = (await usecase.registerUserOnMailingList({ name: invalidname, email: validmail })).value as Error
    const user = await repo.findUserByEmail(validmail)
    expect(user).toBeNull()
    expect(response.name).toEqual('InvalidNameError')
  })
})
