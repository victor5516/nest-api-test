import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './shchemas/admin.schema';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  /*****
  Function Name:create
  Description: Create a new admin and store in the database.
  Input Parameter: @Body() type CreateAdminDto
  Outout Values:  Promise<Admin>
  *************/
  @Post()
  async create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return await this.adminsService.create(createAdminDto);
  }

  /*****
  Function Name:findAll
  Description: List all admins with status active and pending.
  Input Parameter: None
  Outout Values:  Promise<Admin[]>
  *************/
  @Get()
  async findAll(): Promise<Admin[]> {
    return await this.adminsService.findAll();
  }
  /*****
  Function Name:update
  Description: update an admin and return these admin.
  Input Parameter:  @Param('id') id type string, @Body() updateAdminDto type UpdateAdminDto,
  Outout Values:  Promise<Admin>
  *************/
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<Admin> {
    return this.adminsService.update(id, updateAdminDto);
  }
  /*****
  Function Name:delete
  Description: delete an admin and return these admin.
  Input Parameter:  @Param('id') id type string
  Outout Values: Promise<Admin>
  *************/
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Admin> {
    return this.adminsService.remove(id);
  }
}
