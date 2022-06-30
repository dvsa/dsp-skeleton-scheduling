import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { injectable } from 'inversify';
import {
  Slot,
  CreateSlotRequest,
  SlotResponse,
  SlotUpdateData,
  SlotUpdateRequest,
  ServiceType,
  RefServiceType,
  GetSlotsRequest,
} from '../types/slot';

@injectable()
export class RequestToSlotMapper {
  mapToSlot(request: CreateSlotRequest): Slot {
    const startTime = new Date(request.StartTime);
    const endTime = new Date(request.EndTime);
    return {
      slot_id: request.SlotID,
      start_time: startTime,
      end_time: endTime,
      service: request.Service.toLowerCase(),
      service_type_id: RefServiceType[request.ServiceType],
      test_centre: request.TestCentre.toLowerCase(),
      price: request.Price,
      available: request.Available.toLowerCase() === 'true',
    };
  }

  mapToSlotUpdateData(body: CreateSlotRequest | SlotUpdateRequest): SlotUpdateData {
    const slotUpdateData: SlotUpdateData = {};

    if (body.StartTime) {
      slotUpdateData.start_time = new Date(body.StartTime);
    }

    if (body.EndTime) {
      slotUpdateData.end_time = new Date(body.EndTime);
    }

    if (body.Service) {
      slotUpdateData.service = body.Service.toLowerCase();
    }

    if (body.ServiceType) {
      slotUpdateData.service_type_id = RefServiceType[body.ServiceType];
    }

    if (body.TestCentre) {
      slotUpdateData.test_centre = body.TestCentre.toLowerCase();
    }

    if (body.Available.toLowerCase()) {
      slotUpdateData.available = (body.Available.toLowerCase() === 'true');
    }

    return slotUpdateData;
  }

  public mapToSlotResponse(slot: Slot): SlotResponse {
    return {
      SlotID: slot.slot_id,
      StartTime: slot.start_time,
      EndTime: slot.end_time,
      Service: slot.service,
      ServiceType: ServiceType[RefServiceType[slot.service_type_id]] as ServiceType,
      TestCentre: slot.test_centre,
      Price: slot.price,
      Available: slot.available ? 'true' : 'false',
    };
  }

  public mapToGetSlotsRequest(queryParams?: APIGatewayProxyEventQueryStringParameters): GetSlotsRequest {
    const request: GetSlotsRequest = {};

    if (queryParams?.StartDate) {
      request.StartDate = new Date(queryParams.StartDate);
    }

    if (queryParams?.EndDate) {
      request.EndDate = new Date(queryParams.EndDate);
    }

    if (queryParams?.Service) {
      request.Service = queryParams.Service.toLowerCase();
    }

    if (queryParams?.ServiceType) {
      request.ServiceType = queryParams.ServiceType as ServiceType;
    }

    if (queryParams?.TestCentre) {
      request.TestCentre = queryParams.TestCentre.toLowerCase();
    }

    return request;
  }
}
