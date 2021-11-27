import { HttpModule, HttpService } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { AdminsService } from '../admins.service';
import { Status } from '../models/status';

import { Admin } from '../shchemas/admin.schema';
import { adminStub, adminStubs } from './stubs/admin.stubs';


const adminMock = {
id: '61a0357c3fcb762b9d80f45c',
name:'Alberto',
lastName:'Suarez',
email:'newemail@email.com',
role:'admin.fleetrw',
status:Status.Active,
picture:'fine.com'}

describe('AdminsService', () => {
  let adminService: AdminsService;
  let adminModel: Model<Admin>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule,],
      providers: [AdminsService,
        {
        provide: getModelToken(Admin.name),
        useValue: {
          new: jest.fn().mockResolvedValue(adminStub()),
          constructor: jest.fn().mockResolvedValue(adminStub()),
          find: jest.fn(),
          findOne: jest.fn(),
          findById:jest.fn(),
          create: jest.fn(),
          findByIdAndUpdate: jest.fn(),
          findByIdAndDelete: jest.fn(),
          where:jest.fn(),
          exec: jest.fn(),
        },
      },
    ],

    }).compile();



    adminService = module.get<AdminsService>(AdminsService);
    adminModel = module.get<Model<Admin>>(getModelToken(Admin.name));

  });

  it('should be defined', () => {
    expect(adminService).toBeDefined();
  });

  it('should return all admins', async () => {
    jest.spyOn(adminModel, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(adminStubs()),
    } as any);
    const admins = await adminService.findAll();

    expect(admins).toEqual(adminStubs());
  });

  it('should insert a new admin', async () => {
    jest.spyOn(adminModel, 'create').mockImplementationOnce(() =>
      Promise.resolve(adminStub()),
    );
    const newAdmin = await adminService.create(adminStub());
     expect(newAdmin).toEqual(adminStub());
  });

  it('should update a  admin', async () => {
    const id = '61a0357c3fcb762b9d80f45c';
    jest.spyOn(adminModel, 'findByIdAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(adminStub()),
    } as any);
    const newAdmin = await adminService.update(id,adminStub());
     expect(newAdmin).toEqual(adminStub());
  });


})

