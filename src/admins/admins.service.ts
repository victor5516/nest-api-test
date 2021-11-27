import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './shchemas/admin.schema';

import { Status } from './models/status';

import { HttpService } from '@nestjs/axios';


@Injectable()
export class AdminsService {

  private apiNotificationsUrl: string = process.env.API_NOTIFICATION_URL;

  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private httpService: HttpService

  ) { }

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {

    await this.isEmailUnique(createAdminDto.email);
    const newAdmin = await this.adminModel.create(createAdminDto);

    await this.sendNotification(newAdmin.id);

    return newAdmin;

  }

  async findAll(): Promise<Admin[]> {
    return await this.adminModel.find({ $or: [{ status: Status.Active }, { status: Status.Pending }] }).exec();
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {

    if (updateAdminDto.email) {
      await this.isPendingAdmin(id);
    }

    const admin = await this.adminModel
      .findByIdAndUpdate(id, { $set: updateAdminDto }, { new: true })
      .exec();
    if (!admin) {
      throw new NotFoundException(`The requested resource or path can not be found`);
    }
    if (updateAdminDto.status === Status.Active) {
     await this.confirmNotification(admin.id);
    }
    if (updateAdminDto.status === Status.Disable) {
     await this.rejectNotification(admin.id);
    }
    return admin;
  }

  async remove(id: string): Promise<Admin> {

    await this.isPendingAdmin(id);
    return await this.adminModel.findByIdAndDelete(id).exec();;
  }


  private async isEmailUnique(email: string):Promise<void> {
    const admin = await this.adminModel.findOne({ email });
    if (admin) {
      throw new BadRequestException(`Given attributes are invalid for requested action`);
    }

  }

  private async isPendingAdmin(id: string):Promise<void> {
    const admin = await this.adminModel.findById(id).where({ status: Status.Pending }).exec();

    if (!admin) {
      throw new BadRequestException(`Given attributes are invalid for requested action`);
    }
  }


async rejectNotification(id:string):Promise<void> {

    const body = { id: id, message: 'reject' }
    await this.pushNotification(body);
}

async confirmNotification(id:string):Promise<void>{
    const body = { id: id, message: 'confirm' }
    await this.pushNotification(body);
}


async sendNotification(id:string):Promise<void>{
    const body = { id: id, message: 'send' }

    await this.pushNotification(body);
}

private async pushNotification(body:any):Promise<any> {

    return await new Promise(resolve => {
      this.httpService.post(this.apiNotificationsUrl, body).subscribe(res => {

        resolve(res.data.status)
      })
    });

  }


}
