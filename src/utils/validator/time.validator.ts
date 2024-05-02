import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsTimeValidator implements ValidatorConstraintInterface {
  validate(time: string, args: ValidationArguments) {
    const regex = /^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/;
    return typeof time === 'string' && regex.test(time);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Time must be in the format HH:MM:SS (24-hour format)';
  }
}

// Custom decorator function
export function IsTime(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTimeValidator,
    });
  };
}
