import { adminStub,adminStubs, updatedAdminStub } from "../test/stubs/admin.stubs";

export const AdminsService = jest.fn(). mockReturnValue({
    create: jest.fn().mockResolvedValue(adminStub()),
    findAll: jest.fn().mockResolvedValue(adminStubs()),
    update: jest.fn().mockResolvedValue(updatedAdminStub()),
    remove: jest.fn().mockResolvedValue(adminStub()),


})