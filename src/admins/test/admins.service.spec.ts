import { HttpModule } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { AdminsService } from '../admins.service';
import { Admin } from '../shchemas/admin.schema';
import { adminStub, adminStubs } from './stubs/admin.stubs';
import { UpdateAdminDto } from './../dto/update-admin.dto';
import { CreateAdminDto } from './../dto/create-admin.dto';


class AdminsServiceMock {
  create(dto: CreateAdminDto) {
    return adminStub();
  }
  findAll() {
    return adminStubs();
  }
  remove(id: string) {
    return adminStub();
  }
  update(id: string, dto: UpdateAdminDto) {
    return adminStub();
  }
}
describe('AdminsService', () => {
  let adminService: AdminsService;
  let adminModel: Model<Admin>;
  const ApiServiceProvider = {
    provide: AdminsService,
    useClass: AdminsServiceMock,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        AdminsService,
        ApiServiceProvider,
        {
          provide: getModelToken(Admin.name),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
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

  it('should call findAll method with expected params', async () => {
    jest.spyOn(adminModel, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(adminStubs()),
    } as any);
    const admins = await adminService.findAll();

    expect(admins).toEqual(adminStubs());
  });

  it('should call create method with expected params', async () => {
    jest
      .spyOn(adminModel, 'create')
      .mockImplementationOnce(() => Promise.resolve(adminStub()));
    const newAdmin = await adminService.create(adminStub());
    expect(newAdmin).toEqual(adminStub());
  });

  it('should call update method with expected params', async () => {
    const id = '61a0357c3fcb762b9d80f45c';
    jest.spyOn(adminModel, 'findByIdAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(adminStub()),
    } as any);
    const dto = new UpdateAdminDto();
    const admin = await adminService.update(id, dto);
    expect(admin).toEqual(adminStub());
  });

  it('should call remove method with expected params', async () => {
    const id = '61a0357c3fcb762b9d80f45c';
    jest.spyOn(adminModel, 'findByIdAndDelete').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(adminStub()),
    } as any);

    const admin = await adminService.remove(id);
    expect(admin).toEqual(adminStub());
  });
});
