import { Test, TestingModule } from '@nestjs/testing';

import { AdminsController } from '../admins.controller';
import { AdminsService } from '../admins.service';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { Status } from '../models/status';
import { Admin } from '../shchemas/admin.schema';
import { adminStub, adminStubs, updatedAdminStub } from './stubs/admin.stubs';

jest.mock('../admins.service');
describe('AdminsController', () => {
  let adminController: AdminsController;
  let adminsService: AdminsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminsController],
      providers: [AdminsService],
    }).compile();

    adminController = module.get<AdminsController>(AdminsController);
    adminsService = module.get<AdminsService>(AdminsService);
    jest.clearAllMocks();
  });


  describe('create', () => {
    describe('when create is called', () => {
      let admin: Admin;
      let createAdminDto: CreateAdminDto;

      beforeEach(async () => {
        createAdminDto = {
          name: adminStub().name,
          lastName: adminStub().lastName,
          email: adminStub().email,
          role: adminStub().role,
          picture: adminStub().picture

        }
        admin = await adminController.create(createAdminDto);
      })

      test('then it should call adminsService', () => {
        expect(adminsService.create).toHaveBeenCalledWith(createAdminDto);
      })

      test('then it should return a new admin', () => {
        expect(admin).toEqual(adminStub())
      })
    })
  })


  describe('findAll', () => {
    describe('when findAll is called', () => {
      let admins: Admin[];

      beforeEach(async () => {
        admins = await adminController.findAll();
        })

      test('then it should call adminsService', () => {
        expect(adminsService.findAll).toBeCalledWith();
      })

      test('then is should return admins', () => {

        expect(admins).toEqual(adminStubs());
      })
    })
  })

  describe('updateAdmin', () => {
    describe('when updateAdmin is called', () => {
      let admin: Admin;
      let updateAdminDto: UpdateAdminDto;
      const id = '61a0357c3fcb762b9d80f45c'
      beforeEach(async () => {
        updateAdminDto = {
         email:'newemail@email.com',
         status: Status.Active

        }
        admin = await adminController.update(id, updateAdminDto);
      })

      test('then it should call usersService', () => {
        expect(adminsService.update).toHaveBeenCalledWith(id, updateAdminDto);
      })

      test('then it should return a user', () => {
        expect(admin).toEqual(updatedAdminStub())
      })
    })
  })

  describe('removeAdmin', () => {
    describe('when removeAdmin is called', () => {
      let admin: Admin;
       const id = '61a0357c3fcb762b9d80f45c'
      beforeEach(async () => {

        admin = await adminController.remove(id);
      })

      test('then it should call usersService', () => {
        expect(adminsService.remove).toHaveBeenCalledWith(id);
      })

      test('then it should return a deleted user', () => {
        expect(admin).toEqual(adminStub())
      })
    })
  })
});
