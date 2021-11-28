import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    private httpService: HttpService,
  ) {}

  /*****
  Function Name:create
  Description: Create a new admin and store in the database.
  Input Parameter: createAdminDto type CreateAdminDto
  Outout Values:  Promise<Admin>
  *************/
  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    //check if the email is duplicated
    await this.isEmailUnique(createAdminDto.email);
    //create and store the new admin
    const newAdmin = await this.adminModel.create(createAdminDto);
    //send a message to the notificications API
    await this.sendNotification(newAdmin.id);

    return newAdmin;
  }

  /*****
  Function Name:findAll
  Description: List all admins with status active and pending.
  Input Parameter: None
  Outout Values:  Promise<Admin[]>
  *************/
  async findAll(): Promise<Admin[]> {
    //filter the admins with status active and pending.
    return await this.adminModel
      .find({ $or: [{ status: Status.Active }, { status: Status.Pending }] })
      .exec();
  }

  /*****
  Function Name:update
  Description: Update an admin and return these admin.
  Input Parameter: id type string, updateAdminDto type UpdateAdminDto,
  Outout Values:  Promise<Admin>
  *************/
  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    //if the email is going to be updated, check if the status is pending
    if (updateAdminDto.email) {
      await this.isPendingAdmin(id);
    }
    //update the admin with the new data.
    const admin = await this.adminModel
      .findByIdAndUpdate(id, { $set: updateAdminDto }, { new: true })
      .exec();
    //if the admins does not exits return a NotFoundException
    if (!admin) {
      throw new NotFoundException(
        `The requested resource or path can not be found`,
      );
    }
    //if the new status is active send a confirm message to the notifications API.
    if (updateAdminDto.status === Status.Active) {
      await this.confirmNotification(admin.id);
    }
    //if the new status is Disable send a reject message to the notifications API.
    if (updateAdminDto.status === Status.Disable) {
      await this.rejectNotification(admin.id);
    }
    return admin;
  }

  /*****
  Function Name:remove
  Description: delete an admin and return these admin.
  Input Parameter: id type string
  Outout Values: Promise<Admin>
  *************/
  async remove(id: string): Promise<Admin> {
    //checks if the user to be deleted has pending status
    await this.isPendingAdmin(id);

    const deleted = await this.adminModel.findByIdAndDelete(id).exec();

    //if the admins does not exits return a NotFoundException
    if (!deleted) {
      throw new NotFoundException(
        `The requested resource or path can not be found`,
      );
    }
    return deleted;
  }

  /*****
  Function Name:isEmailUnique
  Description: Check in the database if the email already exists in admins collection.
  Input Parameter: email type string
  Outout Values: Promise<void>
  *************/
  private async isEmailUnique(email: string): Promise<void> {
    const admin = await this.adminModel.findOne({ email });

    //if there is an administrator with the email, throw an exception
    if (admin) {
      throw new BadRequestException(
        `Given attributes are invalid for requested action`,
      );
    }
  }
  /*****
  Function Name:isPendingAdmin
  Description: Check in the database if the administrator has the pending status
  Input Parameter: id type string
  Outout Values: Promise<void>
  *************/
  private async isPendingAdmin(id: string): Promise<void> {
    const admin = await this.adminModel
      .findById(id)
      .where({ status: Status.Pending })
      .exec();

    //if the administrator has a status other than pending throw an exception
    if (!admin) {
      throw new BadRequestException(
        `Given attributes are invalid for requested action`,
      );
    }
  }
  /*****
  Function Name:pushNotification
  Description: send a message to the notifications API.
  Input Parameter: body type any
  Outout Values: Promise<any>
  *************/
  private async pushNotification(body: any): Promise<any> {
    //return a promise with the response of the API.
    return await new Promise((resolve) => {
      this.httpService.post(this.apiNotificationsUrl, body).subscribe((res) => {
        resolve(res.data.status);
      });
    });
  }
  /*****
  Function Name:rejectNotification
  Description: Send a reject message to the notifications API.
  Input Parameter: id type string
  Outout Values: Promise<void>
  *************/
  private async rejectNotification(id: string): Promise<void> {
    //build the body with the id of admin and the message
    const body = { id: id, message: 'reject' };
    //send the message
    await this.pushNotification(body);
  }
  /*****
  Function Name:confirmNotification
  Description: Send a confirm message to the notifications API.
  Input Parameter: id type string
  Outout Values: Promise<void>
  *************/
  private async confirmNotification(id: string): Promise<void> {
    //build the body with the id of the admin and the message
    const body = { id: id, message: 'confirm' };
    //send the message
    await this.pushNotification(body);
  }
  /*****
  Function Name:sendNotification
  Description: Send a 'send' message to the notifications API.
  Input Parameter: id type string
  Outout Values: Promise<void>
  *************/
  private async sendNotification(id: string): Promise<void> {
    //build the body with the id of the admin and the message
    const body = { id: id, message: 'send' };
    //send the message
    await this.pushNotification(body);
  }
}
