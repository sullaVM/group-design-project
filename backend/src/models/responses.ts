/**
 * User responses
 */

export interface ICreatePatient {
  success: boolean;
  patientID?: number;
}

export interface IUpdatePatient {
  success: boolean;
}

export interface IGetPatientProfile {
  success: boolean;
  doctorID?: number;
  firstName?: string;
  lastName?: string;
  height?: string;
  pregnant?: string;
  mobileNumber?: number;
  photoDataUrl?: string;
  bslUnit?: string;
}

export interface IStoreRBP {
  success: boolean;
}

export interface IStoreBSL {
  success: boolean;
}

export interface IStoreWeight {
  success: boolean;
}

export interface IGetGraphingData {
  success: boolean;
  RBP?: { time: string; systole: number; diastole: number }[];
  BSL?: { time: string; value: number }[];
  Weight?: { time: string; value: number }[];
}

/**
 * Doctor responses
 */

export interface ICreateDoctor {
  success: boolean;
  doctorID?: number;
}

export interface IDeleteDoctor {
  success: boolean;
  doctorID?: number;
}

export interface IUpdateDoctor {
  success: boolean;
}

export interface IGetDoctorID {
  success: boolean;
  doctorID?: number;
}

export interface IListDoctorsPatients {
  success: boolean;
  patientIDs?: number[];
}

export interface IGetDoctorProfile {
  success: boolean;
  doctorID?: number;
  firstName?: string;
  lastName?: string;
  licenseNumber?: number;
  email?: string;
  userName?: string;
}

export interface IGetAllDoctorsAtClinic {
  success: boolean;
  doctors?: {
    doctorID: number;
    firstName: string;
    lastName: string;
  }[];
}

export interface IGetAllClinics {
  success: boolean;
  clinics?: { clinicID: number; clinicName: string }[];
}

export interface IAddDoctorToClinic {
  success: boolean;
}

export interface ICreateClinic {
  success: boolean;
  clinicID?: number;
}
