package com.example.doctor_app.data.requests;

import androidx.annotation.Nullable;

import com.example.doctor_app.data.responses.CreatePatientResponse;

public class CreatePatientRequest extends DoctorRequest<CreatePatientResponse> {
    private Integer doctorID;
    private String firstName;
    private String lastName;
    private String height;
    private Integer mobileNumber;
    private String photoDataUrl;
    private String password;
    @Nullable
    private String bslUnit;

    public CreatePatientRequest(Integer doctorID, String firstName, String lastName, String height, Integer mobileNumber, String photoDataUrl, String password, @Nullable String bslUnit) {
        this.doctorID = doctorID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.height = height;
        this.mobileNumber = mobileNumber;
        this.photoDataUrl = photoDataUrl;
        this.password = password;
        this.bslUnit = bslUnit;
    }

    @Override
    public String requestRoute() {
        return "api/createPatient";
    }

    @Override
    public Class responseClass() {
        return CreatePatientResponse.class;
    }
}