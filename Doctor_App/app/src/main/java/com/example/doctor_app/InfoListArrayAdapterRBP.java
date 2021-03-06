package com.example.doctor_app;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.core.content.ContextCompat;

import com.example.doctor_app.data.responses.RBPRecord;

import java.util.ArrayList;

class InfoListArrayAdapterRBP extends ArrayAdapter<RBPRecord> {
    private ArrayList<RBPRecord> RBPRecords;
    private final String TYPE = "RBP Reading";

    public InfoListArrayAdapterRBP(Context context,
                                int resource,
                                ArrayList<RBPRecord> objects) {
        super(context, resource, objects);
        this.RBPRecords = objects;
    }

    @Override
    public int getCount() {
        return super.getCount();
    }

    @Override
    public View getView(int position, View v, ViewGroup parent) {
        LayoutInflater inflater = (LayoutInflater)
                getContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE);

        v = inflater.inflate(R.layout.info_list_item, null);

        // Get UI components
        TextView type = v.findViewById(R.id.textView);
        TextView value = v.findViewById(R.id.textView2);
        ImageView flag = v.findViewById(R.id.imageView2);

        // Get reading
        RBPRecord reading = RBPRecords.get(position);

        // Fill components
        type.setText(TYPE + ": " + reading.time.substring(0,16));
        value.setText("Systole: " + reading.systole + ". Disastole: " + reading.diastole);

        // Check systole and diastole and set flag

        if(reading.systole < 120) {
            // Optimal
            flag.setColorFilter(ContextCompat.getColor(getContext(), R.color.design_default_color_secondary_variant));
        } else if(reading.systole >= 120 && reading.systole <= 129) {
            // Normal
            flag.setColorFilter(ContextCompat.getColor(getContext(), R.color.design_default_color_secondary_variant));
        } else if(reading.systole >= 130 && reading.systole <= 139) {
            // High normal
            flag.setColorFilter(ContextCompat.getColor(getContext(), R.color.pomegranate));
        } else {
            // Hypertension
            flag.setColorFilter(ContextCompat.getColor(getContext(), R.color.design_default_color_error));
        }

        if(reading.diastole < 80) {
            // Optimal
            flag.setColorFilter(ContextCompat.getColor(getContext(), R.color.design_default_color_secondary_variant));
        } else if(reading.diastole >= 80 && reading.diastole <= 84) {
            // Normal
            flag.setColorFilter(ContextCompat.getColor(getContext(), R.color.design_default_color_secondary_variant));
        } else if(reading.diastole >= 85 && reading.diastole <= 89) {
            // High normal
            flag.setColorFilter(ContextCompat.getColor(getContext(), R.color.pomegranate));
        } else {
            // Hypertension
            flag.setColorFilter(ContextCompat.getColor(getContext(), R.color.design_default_color_error));
        }

        return v;
    }
}
