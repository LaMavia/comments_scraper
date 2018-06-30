import { IsString, IsInt, IsUrl, Validate } from 'class-validator'
import { UserValidator } from "./user.dto"
import { User } from "../interfaces/user.interface"

export class GetCommentDto {
  @IsString() readonly Content: string;
  @IsInt() readonly Likes: number;
  @Validate(UserValidator) readonly User: User;
}