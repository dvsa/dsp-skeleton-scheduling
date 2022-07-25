export enum RefTestCentre {
  barking = '0d439f3a-acf7-ec11-82e6-0022484289f6',
  goodmayes = 'af8b374e-ebf6-ec11-82e6-002248428f64',
  hornchurch = 'dfa600c9-b8ec-ec11-bb3c-6045bd1138c0'
}

export type TestCentre = {
  test_centre_id: RefTestCentre
  display_name: string
  special_accommodation_slots_per_day: number
  extended_tests_slots_per_day: number
}