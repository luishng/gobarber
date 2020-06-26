import { Request, Response } from 'express';
import { container } from 'tsyringe'

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year, day } = request.query;

    const listProviderDayAvailability = container.resolve(ListProviderDayAvailabilityService);

    const availability = await listProviderDayAvailability.execute({ year: Number(year), day: Number(day), month: Number(month), provider_id })

    return response.json(availability);
  }
}
