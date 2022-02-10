import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

export function IsPassword (validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsPassword',
      target: object.constructor,
      propertyName,
      // constraints: [property],
      options: validationOptions,
      validator: {
        validate (value: any, args: ValidationArguments): boolean {
          const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$/
          return regex.test(value)
        },
        defaultMessage (args: ValidationArguments): string {
          return 'Sua senha deve ter no mínimo 8 e no máximo 32 caracteres, com pelo menos uma letra e um número'
        }
      }
    })
  }
}
