package com.example.diabetesapp;

import android.os.Bundle;
import android.text.InputType;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.util.Consumer;

import com.example.diabetesapp.data.requests.StoreWeightRequest;
import com.example.diabetesapp.data.responses.StoreWeightResponse;

import java.sql.Timestamp;

import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.io.FileWriter;
import android.util.Log;

public class Manual extends AppCompatActivity {
    EditText data;

    int mPatientID;

    private static final String filename = "StoredData.txt";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_manual);

        ImageButton enter = findViewById(R.id.enter);
        ImageButton back = findViewById(R.id.back);

        data = findViewById(R.id.enterData);
        data.setInputType(InputType.TYPE_CLASS_NUMBER);

        mPatientID = getIntent().getIntExtra("patientId", -1);

        enter.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                saveData();
            }
        });

        back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                back();
            }
        });
    }

    public void back() {
        this.finish();
    }

    private void saveData() {
        try {
            File textFile = new File(this.getFilesDir(), filename);
            if (!textFile.exists())
                textFile.createNewFile();

            BufferedWriter writer = new BufferedWriter(new FileWriter(textFile, true /*append*/));

            writer.write("W " + mPatientID + " " +  Float.parseFloat(data.getText().toString()) + "\n");
            writer.close();
        } catch (IOException e) {
        Log.e("ReadWriteFile", "Unable to write data.");
        }
        finish();
    }
}
