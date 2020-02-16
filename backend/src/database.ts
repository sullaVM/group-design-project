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
  const query = `INSERT INTO Patients (DoctorID, FirstName, LastName, MobileNumber, PhotoLink, Password, BslUnit)
  VALUES ('${request.doctorID}','${request.firstName}','${request.lastName}','${
    request.mobileNumber
  }','${request.photoDataUrl}','${request.password}','${
    request.bslUnit === 'mgDL' ? 1 : 0
  }');`;

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
          bslUnit: results[0].BslUnit === 1 ? 'mgDL' : 'mmolL',
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
  ${
    request.bslUnit
      ? `${updateCount++ ? ',' : ''}BslUnit='${
          request.bslUnit === 'mgDL' ? 1 : 0
        }'`
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
  const mmolL =
    request.unit && request.unit === 'mgDL'
      ? request.value / 18
      : request.value;

  const query = `INSERT INTO BSL (TimeTaken, PatientID, MmolL)
  VALUES ('${request.time}','${request.patientID}','${mmolL}')`;

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

export const getGraphingData = async (
  request: requests.IGetGraphingData
): Promise<responses.IGetGraphingData> => {
  const BSLQuery = `SELECT TimeTaken, MmolL FROM BSL WHERE
  PatientID='${request.patientID}' AND
  TimeTaken BETWEEN '${request.intervalStart}' AND '${request.intervalEnd}'
  ORDER BY TimeTaken ASC;`;

  const RBPQuery = `SELECT TimeTaken, Systole, Diastole FROM RBP WHERE
  PatientID='${request.patientID}' AND
  TimeTaken BETWEEN '${request.intervalStart}' AND '${request.intervalEnd}'
  ORDER BY TimeTaken ASC;`;

  const result = await new Promise<responses.IGetGraphingData>(resolve => {
    db.query(BSLQuery, (BSLError, BSLResults, BSLfields) => {
      if (BSLError) {
        console.error(BSLError);
        resolve({ success: false });
      }
      db.query(RBPQuery, (RBPError, RBPResults, RBPfields) => {
        if (RBPError) {
          console.error(RBPError);
          resolve({ success: false });
        }
        const RBP: { time: string; systole: number; diastole: number }[] = [];
        const BSL: { time: string; value: number }[] = [];

        for (const entry of BSLResults) {
          BSL.push({
            time: entry.TimeTaken,
            value:
              request.bslUnit && request.bslUnit === 'mgDL'
                ? entry.MmolL * 18
                : entry.MmolL,
          });
        }

        for (const entry of RBPResults) {
          RBP.push({
            time: entry.TimeTaken,
            systole: entry.Systole,
            diastole: entry.Diastole,
          });
        }

        resolve({ success: true, RBP, BSL });
      });
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
