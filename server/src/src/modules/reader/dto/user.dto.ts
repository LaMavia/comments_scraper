import {
  IsString,
  IsUrl,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { User } from '../interfaces/user.interface';
import axios from 'axios';

@ValidatorConstraint({ async: true })
export class UserValidator implements ValidatorConstraintInterface {
  async validate(user: User, atgs: ValidationArguments) {
    const validUrl = await axios
      .get(user.Url)
      .then(res => res.status)
      .catch(res => false);

    const validName = !!user.Name;

    const validImage = await axios
      .get(user.Image)
      .then(res => res.status)
      .catch(res => false);

    return Boolean(validUrl && validName && validImage);
  }

  defaultMessage(args: ValidationArguments) {
    return 'User ($value) is invalid!';
  }
}

export class GetUser {
  @IsString() readonly Name: string;
  @IsUrl() readonly Image: string;
  @IsUrl() readonly Url: string;
}
