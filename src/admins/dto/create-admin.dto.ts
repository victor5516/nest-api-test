
import {
    IsString,
    IsUrl,
    IsNotEmpty,
    IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateAdminDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: `admin name` })
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: `admin lastName` })
    readonly lastName: string;


    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ description: `admin email` })
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: `admin role` })
    readonly role: string;


    @IsUrl()
    @ApiProperty({ description: `admin picture url` })
    readonly picture: string;


}
