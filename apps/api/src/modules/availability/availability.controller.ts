import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { AvailabilityService } from "./availability.service";
@Controller("available-slots")
export class AvailabilityController { constructor(private readonly service:AvailabilityService){} @Get() find(@Query("date") date?:string){if(!date||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date))throw new BadRequestException("Date invalide");return this.service.findForDate(date)} }
