import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/users.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateReportDto } from './dtos/get-estimate-report.dto';
import { ReportUserDto } from './dtos/report-user.dto';

@UseGuards(AuthGuard)
@Serialize(ReportDto)
@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Get()
  @Serialize(ReportUserDto)
  estimate(@Query() query: GetEstimateReportDto) {
    return this.reportService.createEstimate(query);
  }

  @Post()
  create(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.create(body, user);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  approve(@Param('id') id: number, @Body() body: ApproveReportDto) {
    return this.reportService.approve(id, body.approved);
  }
}
