
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
    @ApiProperty({ description: `admins's name` })
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: `admins's lastName` })
    readonly lastName: string;


    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ description: `admins's email` })
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: `admins's role` })
    readonly role: string;


    @IsUrl()
    @ApiProperty({ description: `admin's picture url` })
    readonly picture: string;


}
