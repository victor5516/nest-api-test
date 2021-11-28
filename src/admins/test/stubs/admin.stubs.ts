import { Status } from "../../models/status";
import { Admin } from "../../shchemas/admin.schema";

export const adminStub = (): Admin =>{
    return{

        name:'Alberto',
        lastName:'Suarez',
        email:'alberto@email.com',
        role:'admin.fleetrw',
        status:Status.Pending,
        picture:'fine.com'
    }
}

export const updatedAdminStub = (): Admin =>{
    return{

        name:'Alberto',
        lastName:'Suarez',
        email:'newemail@email.com',
        role:'admin.fleetrw',
        status:Status.Active,
        picture:'fine.com'
    }
}

export const adminStubs = (): Admin[] =>{
    return [
        {
        name:'Alberto',
        lastName:'Suarez',
        email:'alberto@email.com',
        role:'admin.fleetrw',
        status:Status.Pending,
        picture:'fine.com'
       },
       {
        name:'Mariana',
        lastName:'Moreno',
        email:'mariana@email.com',
        role:'admin.fleetrw',
        status:Status.Pending,
        picture:'fine.com'
       },
       {
        name:'Ricardo',
        lastName:'Perez',
        email:'ricardo@email.com',
        role:'admin.fleetrw',
        status:Status.Active,
        picture:'fine.com'
       },
       {
        name:'Yennifer',
        lastName:'Angarita',
        email:'yennifer@email.com',
        role:'admin.fleetrw',
        status:Status.Disable,
        picture:'fine.com'
       },
    ]


}

export const adminCorrectStubs = (): Admin[] =>{
    return [
        {
        name:'Alberto',
        lastName:'Suarez',
        email:'alberto@email.com',
        role:'admin.fleetrw',
        status:Status.Pending,
        picture:'fine.com'
       },
       {
        name:'Mariana',
        lastName:'Moreno',
        email:'mariana@email.com',
        role:'admin.fleetrw',
        status:Status.Pending,
        picture:'fine.com'
       },
       {
        name:'Ricardo',
        lastName:'Perez',
        email:'ricardo@email.com',
        role:'admin.fleetrw',
        status:Status.Active,
        picture:'fine.com'
       }
    ]


}



