import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UpdateAdminDto } from './../src/admins/dto/update-admin.dto';
import { CreateAdminDto } from './../src/admins/dto/create-admin.dto';
import {
  adminStub,
  adminStubs,
  adminCorrectStubs,
  updatedAdminStub,
} from './../src/admins/test/stubs/admin.stubs';
import { Admin, AdminDocument } from './../src/admins/shchemas/admin.schema';
import { AdminsModule } from './../src/admins/admins.module';
import { Status } from '../src/admins/models/status';
import { AppModule } from './../src/app.module';

describe('JoycarTest (e2e)', () => {
  let app: INestApplication;
  let adminModel;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            const mongod = await MongoMemoryServer.create();
            const uri = await mongod.getUri();
            return {
              uri: uri,
            };
          },
        }),
        AppModule,
        AdminsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    adminModel = moduleFixture.get<Model<AdminDocument>>(
      getModelToken(Admin.name),
    );
    await app.init();
  });
  beforeEach(() => {
    const mockAdmins = adminStubs();
    return adminModel.create(mockAdmins);
  });
  describe('List all admins', () => {
    it('should return an array of admins with active and pending status', async () => {
      const response = await request(app.getHttpServer()).get('/admins');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(adminCorrectStubs());
    });
  });
  describe('Create an admin', () => {
    it('should create an admin', async () => {
      const createAdminDto: CreateAdminDto = {
        name: 'Federico',
        lastName: 'Fernandez',
        email: 'federico@email.com',
        role: 'admin',
        picture: 'www.image.com',
      };
      const response = await request(app.getHttpServer())
        .post('/admins')
        .send(createAdminDto);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(createAdminDto);

      const admin = await adminModel.findOne({ email: createAdminDto.email });
      expect(admin).toMatchObject(createAdminDto);
    });
  });
  describe('When create a Admin using duplicate email', () => {
    it('should throw an exception', async () => {
      const createAdminDto: CreateAdminDto = {
        name: 'Federico',
        lastName: 'Fernandez',
        email: adminStub().email,
        role: 'admin',
        picture: 'www.image.com',
      };
      const response = await request(app.getHttpServer())
        .post('/admins')
        .send(createAdminDto);

      expect(response.status).toBe(400);
    });
  });

  describe('Update an admin', () => {
    let admin;
    beforeEach(async () => {
      admin = await adminModel.findOne({ email: adminStub().email });
    });

    it('should update the email and return status code 200', async () => {
      const updateAdminDto: UpdateAdminDto = {
        status: Status.Active,
        email: updatedAdminStub().email,
      };

      const response = await request(app.getHttpServer())
        .patch(`/admins/${admin.id}`)
        .send(updateAdminDto);

      expect(response.status).toBe(200);
      const updatedAdmin = await adminModel.findById(admin.id);
      expect(updateAdminDto.email).toBe(updatedAdmin.email);
    });
  });

  describe('When try to update email user with status no pending', () => {
    let admin;
    beforeEach(async () => {
      admin = await adminModel.create(updatedAdminStub());
    });

    it('should throw an execption', async () => {
      const updateAdminDto: UpdateAdminDto = {
        status: Status.Active,
        email: updatedAdminStub().email,
      };

      const response = await request(app.getHttpServer())
        .patch(`/admins/${admin.id}`)
        .send(updateAdminDto);

      expect(response.status).toBe(400);
    });
  });

  describe('Delete a admin', () => {
    let admin;
    beforeEach(async () => {
      admin = await adminModel.findOne({ email: adminStub().email });
    });

    it('should delete the admin return code 200', async () => {
      const response = await request(app.getHttpServer()).delete(
        `/admins/${admin.id}`,
      );

      expect(response.status).toBe(200);
      const deletedAdmin = await adminModel.findById(admin.id);
      expect(deletedAdmin).toBe(null);
    });
  });

  describe('When try to delete a admin with status different a pending', () => {
    let admin;
    beforeEach(async () => {
      admin = await adminModel.create(updatedAdminStub());
    });

    it('should throw an exception', async () => {
      const response = await request(app.getHttpServer()).delete(
        `/admins/${admin.id}`,
      );

      expect(response.status).toBe(400);
    });
  });
});
