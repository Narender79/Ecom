package com.narender.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;

public class PlaceOrderRequest {
    @NotBlank private String fullName;
    @NotBlank private String phone;
    @NotBlank private String street;
    @NotBlank private String city;
    @NotBlank private String state;
    @NotBlank private String pincode;

    
    public void setFullName(String fullName){
        this.fullName = fullName;
    }

    public void setPhone(String phone){
        this.phone = phone;
    }
    public void setStreet(String street){
        this.street = street;
    }
    public void setCity(String city){
        this.city = city;
    }
    public void setState(String state){
        this.state = state;
    }
    public void setPincode(String pincode){
        this.pincode = pincode;
    }

    
    public String getFullName(){return fullName;}
    public String getPhone(){return phone;}
    public String getStreet(){return street;}
    public String getCity(){return city;}
    public String getState(){return state;}
    public String getPincode(){return pincode;}
    
}
