import mysql from 'mysql';
import fs from 'fs';
import * as requests from './models/requests';
import * as responses from './models/responses';

let db: mysql.Connection;

fs.readFile('dbconfig.json', 'utf8', (error, data) => {
  if (error) {
    console.log('dbconfig.json is missing, put it in root of project');
    throw error;
  }
  const mysqlConfig = JSON.parse(data);
  db = mysql.createConnection(mysqlConfig);
  db.connect();
});

export const createPatient = async (
  request: requests.ICreatePatient
): Promise<responses.ICreatePatient> => {
  const query = `INSERT INTO Patients (DoctorID, FirstName, LastName, MobileNumber, PhotoLink, Password)
  VALUES ('${request.doctorID}','${request.firstName}','${request.lastName}','${request.mobileNumber}','${request.photoDataUrl}','${request.password}');`;

  const result = await new Promise<responses.ICreatePatient>(resolve => {
    db.query(query, (error, results, fields) => {
      if (error) {
        console.error(error);
        resolve({ success: false });
      }
      resolve({ patientID: results.insertId, success: true });
    });
  });

  return result;
};

export const getPatientProfile = async (
  request: requests.IGetPatientProfile
): Promise<responses.IGetPatientProfile> => {
  const query = `SELECT * FROM Patients WHERE PatientID='${request.patientID}';`;

  const result = await new Promise<responses.IGetPatientProfile>(resolve => {
    db.query(query, (error, results, fields) => {
      if (error) {
        console.error(error);
        resolve({ success: false });
      }
      if (!results[0]) {
        resolve({ success: false });
      } else {
        resolve({
          success: true,
          doctorID: results[0].DoctorID,
          firstName: results[0].FirstName,
          lastName: results[0].LastName,
          mobileNumber: results[0].MobileNumber,
          photoDataUrl: results[0].PhotoLink,
        });
      }
    });
  });

  return result;
};

export const updatePatient = async (
  request: requests.IUpdatePatient
): Promise<responses.IUpdatePatient> => {
  let updateCount = 0;

  const query = `UPDATE Patients 
  SET
  ${
    request.doctorID
      ? `${updateCount++ ? ',' : ''}DoctorID='${request.doctorID}'`
      : ''
  }
  ${
    request.firstName
      ? `${updateCount++ ? ',' : ''}FirstName='${request.firstName}'`
      : ''
  }
  ${
    request.lastName
      ? `${updateCount++ ? ',' : ''}LastName='${request.lastName}'`
      : ''
  }
  ${
    request.mobileNumber
      ? `${updateCount++ ? ',' : ''}MobileNumber='${request.mobileNumber}'`
      : ''
  }
  ${
    request.photoDataUrl
      ? `${updateCount++ ? ',' : ''}PhotoLink='${request.photoDataUrl}'`
      : ''
  }
  WHERE PatientID='${request.patientID}';`;

  const result = await new Promise<responses.IUpdatePatient>(resolve => {
    db.query(query, (error, results, fields) => {
      if (error) {
        console.error(error);
        resolve({ success: false });
      }
      resolve({ success: true });
    });
  });

  return result;
};

export const storeRBP = async (
  request: requests.IStoreRBP
): Promise<responses.IStoreRBP> => {
  const query = `INSERT INTO RBP (TimeTaken, PatientID, Systole, Diastole)
  VALUES ('${request.time}','${request.patientID}','${request.systole}','${request.diastole}');`;

  const result = await new Promise<responses.IStoreRBP>(resolve => {
    db.query(query, (error, results, fields) => {
      if (error) {
        console.error(error);
        resolve({ success: false });
      }
      resolve({ success: true });
    });
  });

  return result;
};

export const storeBSL = async (
  request: requests.IStoreBSL
): Promise<responses.IStoreBSL> => {
  const query = `INSERT INTO BSL (TimeTaken, PatientID, BSLmgDL)
  VALUES ('${request.time}','${request.patientID}','${request.BSLmgDL}')`;

  const result = await new Promise<responses.IStoreBSL>(resolve => {
    db.query(query, (error, results, fields) => {
      if (error) {
        console.error(error);
        resolve({ success: false });
      }
      resolve({ success: true });
    });
  });

  return result;
};

export const createDoctor = async (
  request: requests.ICreateDoctor
): Promise<responses.ICreateDoctor> => {
  const query = `INSERT INTO Doctors (FirstName, LastName, LicenseNo, ClinicID, Email, UserName,Password)
  VALUES ('${request.firstName}','${request.lastName}','${request.licenseNumber}','${request.clinicID}','${request.email}','${request.userName}','${request.password}');`;

  const result = await new Promise<responses.ICreateDoctor>(resolve => {
    db.query(query, (error, results, fields) => {
      if (error) {
        console.error(error);
        resolve({ success: false });
      }
      resolve({ doctorID: results.insertId, success: true });
    });
  });

  return result;
};

export const getDoctorProfile = async (
  request: requests.IGetDoctorProfile
): Promise<responses.IGetDoctorProfile> => {
  const query = `SELECT * FROM Doctors WHERE DoctorID='${request.doctorID}';`;

  const result = await new Promise<responses.IGetDoctorProfile>(resolve => {
    db.query(query, (error, results, fields) => {
      if (error) {
        console.error(error);
        resolve({ success: false });
      }
      if (results.length < 1) {
        resolve({ success: false });
      } else {
        resolve({
          success: true,
          doctorID: results[0].DoctorID,
          firstName: results[0].FirstName,
          lastName: results[0].LastName,
          licenseNumber: results[0].LicenseNo,
          clinicID: results[0].ClinicID,
          email: results[0].Email,
          userName: results[0].UserName,
        });
      }
    });
  });

  return result;
};

export const listDoctorsPatients = async (
  request: requests.IListDoctorsPatients
): Promise<responses.IListDoctorsPatients> => {
  const query = `SELECT PatientID FROM Patients WHERE DoctorID='${request.doctorID}';`;

  const result = await new Promise<responses.IListDoctorsPatients>(resolve => {
    db.query(query, (error, results, fields) => {
      if (error) {
        console.error(error);
        resolve({ success: false });
      }
      if (results.length === 0) {
        resolve({ success: false });
      } else {
        resolve({
          success: true,
          patientIDs: results,
        });
      }
    });
  });

  return result;
};

export const getAllClinics = async (
  request: requests.IGetAllClinics
): Promise<responses.IGetAllClinics> => {
  const query = `SELECT * FROM Clinics;`;

  const result = await new Promise<responses.IGetAllClinics>(resolve => {
    db.query(query, (error, results, fields) => {
      if (error) {
        console.error(error);
        resolve({ success: false });
      }
      if (results.length < 1) {
        resolve({ success: false });
      } else {
        const clinics: { clinicID: number; clinicName: string }[] = [];
        for (const clinic of results) {
          clinics.push({
            clinicID: clinic.ClinicID,
            clinicName: clinic.ClinicName,
          });
        }
        resolve({
          success: true,
          clinics,
        });
      }
    });
  });

  return result;
};
