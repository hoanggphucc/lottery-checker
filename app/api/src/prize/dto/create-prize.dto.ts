import { IsNotEmpty } from 'class-validator';

export class CreatePrizeDto {
  @IsNotEmpty()
  name: string;
}
