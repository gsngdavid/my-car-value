import { Injectable } from '@nestjs/common';
import { Report } from './reports.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/users.entity';
import { GetEstimateReportDto } from './dtos/get-estimate-report.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async approve(id: number, approved: boolean) {
    const report = await this.repo.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!report) throw new Error('No report found with the provided id');

    report.approved = approved;
    return this.repo.save(report);
  }

  async createEstimate(query: GetEstimateReportDto) {
    const queryBuilder = this.repo
      .createQueryBuilder('report')
      .select('AVG(price)', 'price')
      .leftJoinAndSelect('report.user', 'user')
      .where('approved IS TRUE')
      .andWhere('report.make = :make', { make: query.make })
      .andWhere('report.model = :model', { model: query.model })
      .andWhere('longitude - :longitude BETWEEN -5 AND 5', {
        longitude: query.longitude,
      })
      .andWhere('latitude - :latitude BETWEEN -5 AND 5', {
        latitude: query.latitude,
      })
      .andWhere('year - :year BETWEEN -3 AND 3', { year: query.year })
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage: query.mileage })
      .limit(3);

    const reports = await queryBuilder.getRawOne();
    return reports;
  }
}
