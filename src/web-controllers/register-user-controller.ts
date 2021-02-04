import { UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { MissingParamError } from './errors/missing-param-error'
import { HttpRequest, HttpResponse } from './ports'
import { badRequest, created } from './util'

export class RegisterUserController {
  private readonly usecase: RegisterUserOnMailingList

  constructor (usecase: RegisterUserOnMailingList) {
    this.usecase = usecase
  }

  public async handle (request: HttpRequest): Promise<HttpResponse> {
    if (!request.body.name || !request.body.email) {
      let missingParam = !(request.body.name) ? 'name' : ''
      missingParam += !(request.body.email) ? 'email' : ''
      return badRequest(new MissingParamError(missingParam))
    }

    const userData: UserData = request.body
    const response = await this.usecase.registerUserOnMailingList(userData)

    if (response.isRight()) {
      return created(response.value)
    }

    if (response.isLeft()) {
      return badRequest(response.value)
    }
  }
}
