import {User} from "./user.interface"

export interface Comment {
  readonly Content: string;
  readonly Likes: number;
  readonly Author: User;
}