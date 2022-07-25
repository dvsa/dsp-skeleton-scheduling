import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { inject, injectable } from 'inversify';
import { RefTestType } from '../types/reference/product';
import { RefServiceType } from '../types/reference/serviceType';
import { Slot, SlotUpdateData } from '../types/slots/slot';
import { Service } from '../types/reference/service';
import { RefTestCentre } from '../types/reference/testCentre';
import { CreateSlotRequest } from '../types/slots/createSlotRequest';
import { GetSlotsRequest } from '../types/slots/getSlotRequest';
import { types } from '../ioc/types'
import { ReleaseWindowCalculator } from '../services/releaseWindowCalculator';
import { SlotResponse } from '../types/slots/slotResponse';

@injectable()
export class RequestToSlotMapper {
  constructor(
    @inject(types.ReleaseWindowCalculator) private calculator: ReleaseWindowCalculator,
  ) {}

  mapToSlot(request: CreateSlotRequest): Slot {
    const startTime = new Date(request.StartTime);
    const endTime = new Date(request.EndTime);

    return {
      slot_id: request.SlotID,
      start_time: startTime,
      end_time: endTime,
      test_type_id: request.TestType,
      service_id: request.Service,
      service_type_id: request.ServiceType,
      test_centre_id: request.TestCentre,
      price: request.Price,
      extendable: request.Extendable,
      released: this.calculator.isReleased(request.TestType, startTime, new Date()),
      slot_status_id: request.Status,
      premium: request.Premium
    };
  }

  mapToSlotUpdateData(body: CreateSlotRequest): SlotUpdateData {
    const slotUpdateData: SlotUpdateData = {};

    if (body.StartTime) {
      slotUpdateData.start_time = new Date(body.StartTime);
    }

    if (body.EndTime) {
      slotUpdateData.end_time = new Date(body.EndTime);
    }

    if (body.TestType) {
      slotUpdateData.test_type_id = body.TestType;
    }

    if (body.Service) {
      slotUpdateData.service_id = body.Service;
    }

    if (body.ServiceType) {
      slotUpdateData.service_type_id = body.ServiceType;
    }

    if (body.TestCentre) {
      slotUpdateData.test_centre_id = body.TestCentre;
    }

    if (body.Extendable) {
      slotUpdateData.extendable = body.Extendable
    }

    if (body.Premium) {
      slotUpdateData.premium = body.Premium
    }

    if (body.Status) {
      slotUpdateData.slot_status_id = body.Status
    }

    return slotUpdateData;
  }

  public mapToSlotResponse(slot: Slot): SlotResponse {
    return {
      SlotID: slot.slot_id,
      StartTime: slot.start_time,
      EndTime: slot.end_time,
      TestType: slot.test_type_id,
      ServiceType: slot.service_type_id,
      TestCentre: slot.test_centre_id,
      Price: slot.price,
      Released: slot.released,
      Extendable: slot.extendable,
      Status: slot.slot_status_id
    };
  }

  public mapToSlotResponseFromService(slot: Slot, service: Service): SlotResponse {
    return {
      SlotID: slot.slot_id,
      StartTime: slot.start_time,
      EndTime: slot.end_time,
      TestType: slot.test_type_id,
      ServiceType: slot.service_type_id,
      TestCentre: slot.test_centre_id,
      Price: `${service.price}`,
      Released: slot.released,
      Extendable: slot.extendable,
      Status: slot.slot_status_id
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

    if (queryParams?.Product) {
      request.Product = <RefTestType><unknown>queryParams.Product;
    }

    if (queryParams?.ServiceType) {
      request.ServiceType = <RefServiceType><unknown>queryParams.ServiceType;
    }

    if (queryParams?.TestCentre) {
      request.TestCentre = <RefTestCentre><unknown>queryParams.TestCentre;
    }

    if (queryParams?.SpecialAccommodations) {
      request.SpecialAccommodations = queryParams.SpecialAccommodations === 'true' ? true : false;
    }

    if (queryParams?.ExtraTime) {
      request.ExtraTime = queryParams.ExtraTime === 'true' ? true : false;
    }

    if (queryParams?.Extended) {
      request.Extended = queryParams.ExtraTime === 'true' ? true : false;
    }

    return request;
  }
}
