import { Transform } from 'class-transformer';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class GetEstimateReportDto {
  @IsString()
  make: string;
  @IsString()
  model: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(2024)
  year: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  longitude: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  latitude: number;
}
