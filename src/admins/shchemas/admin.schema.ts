import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Status } from '../models/status';


export type AdminDocument = Admin & Document;
@Schema()
export class Admin  {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true, default: Status.Pending  })
    status: Status;

    @Prop({ required: true })
    role: string;

    @Prop({ required: false })
    picture: string;




}



export const AdminSchema = SchemaFactory.createForClass(Admin);