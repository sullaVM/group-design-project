package com.example.doctor_app.data.responses;

import androidx.annotation.Nullable;

public class GetPatientProfileResponse extends PatientResponse {
    @Nullable
    public Integer doctorID;
    @Nullable
    public String firstName;
    @Nullable
    public String lastName;
    @Nullable
    public String userName;
    @Nullable
    public String height;
    @Nullable
    public Integer mobileNumber;
    @Nullable
    public String photoDataUrl;
    @Nullable
    public String password;
    @Nullable
    public Integer pregnant;
    @Nullable
    public String bslUnit;
    @Nullable
    public boolean toCall;
}
