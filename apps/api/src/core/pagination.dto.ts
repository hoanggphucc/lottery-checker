import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number) // Converts string to number
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number) // Converts string to number
  @IsInt()
  @Min(1)
  limit?: number;
}
