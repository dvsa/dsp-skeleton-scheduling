import { RefServiceType } from "./serviceType"

export enum RefService {
  car_premium = 'f1cc36f1-b3f7-ec11-82e6-002248428f64',
  car_standard = '45e49ccb-b3f7-ec11-82e6-002248428f64',
  extended_car_premium = 'ac293884-b9f7-ec11-82e6-002248428f64',
  extended_car_standard = '726df864-b9f7-ec11-82e6-002248428f64',
  special_extended_car_premium = '45b6d2c8-b7f7-ec11-82e6-002248428f64',
  special_extended_car_standard = '1b892c1b-b4f7-ec11-82e6-002248428f64',
  special_extra_time_car_premium = 'a14b5d9e-b3f7-ec11-82e6-002248428f64',
  special_extra_time_car_standard = '7fefaa95-b0f7-ec11-82e6-002248428f64',
  special_extra_time_extended_car_premium = '0a600347-b9f7-ec11-82e6-002248428f64',
  special_extra_time_extended_car_standard = '733ce4db-b8f7-ec11-82e6-002248428f64',
  special_car_premium = '733ce4db-b8f7-ec11-82e6-002248428f64',
  special_car_standard = 'fbadfb35-c2ec-ec11-bb3c-6045bd113d55',
  large_goods_premium = 'f57d856c-67f8-ec11-82e6-0022484289f6',
  large_goods_standard = 'e4cbcf1f-a9f7-ec11-82e6-0022484289f6',
  special_large_goods_premium = '8261b427-67f8-ec11-82e6-0022484289f6',
  special_large_goods_standard = '9b14a015-66f8-ec11-82e6-0022484289f6'
}

export type Service = {
  service_id: RefService
  display_name: string
  service_type_id: RefServiceType
  duration: number
  price: number
}
