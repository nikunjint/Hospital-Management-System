import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

//Screens
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import RegisterDoctorScreen from '../screens/RegisterDoctorScreen';
import DoctorListScreen from '../screens/DoctorListScreen';
import DoctorProfileInformationScreen from '../screens/DoctorProfileInformationScreen';
import UsersListScreen from '../screens/UsersListScreen';
import UserProfileInformationScreen from '../screens/UserProfileInformationScreen';
import MyProfileInformationScreen from '../screens/MyProfileInformationScreen';
import PatientsAppointmentListScreen from '../screens/PatientsAppointmentListScreen';
import ManagementAppointmentScreen from '../screens/ManagementAppointmentScreen';
import AppointmentMakerScreen from '../screens/AppointmentMakerScreen';
import SearchDoctorScreen from '../screens/SearchDoctorScreen';
import SelectedDoctorAppointmentScreen from '../screens/SelectedDoctorAppointmentScreen';
import SelectedDoctorAppointmentDetailScreen from '../screens/SelectedDoctorAppointmentDetailScreen';
import MyAppointmentListScreen from '../screens/MyAppointmentListScreen';
import BedManagementListScreen from '../screens/BedManagementListScreen';
import BedMakerScreen from '../screens/BedMakerScreen';
import PatientAppointmentDetailScreen from '../screens/PatientAppointmentDetailScreen';
import PatientBedListScreen from '../screens/PatientBedListScreen';
import PatientBookBedScreen from '../screens/PatientBookBedScreen';
import PatientReservedBedScreen from '../screens/PatientReservedBedScreen';
import BookedBedsScreen from '../screens/BookedBedsScreen';
import PatientBloodBankScreen from '../screens/PatientBloodBankScreen';
import PatientDonateBloodScreen from '../screens/PatientDonateBloodScreen';
import PatientAmbulanceServiceScreen from '../screens/PatientAmbulanceServiceScreen';
import AdminBloodBankListScreen from '../screens/AdminBloodBankListScreen';
import AdminBloodDonationFormListScreen from '../screens/AdminBloodDonationFormListScreen';
import AdminAmbulanceServiceListScreen from '../screens/AdminAmbulanceServiceListScreen';
import AdminAmbulanceServiceMakerScreen from '../screens/AdminAmbulanceServiceMakerScreen';
import AdminBloodBankMakerScreen from '../screens/AdminBloodBankMakerScreen';
import PatientReportScreen_Add from '../screens/PatientReportScreen_add';
import ImageViewer from '../screens/ImageViewer';
import KhaltiPaymentInitiate from '../screens/KhaltiPaymentInitiate';
import KhaltiPaymentConfirmation from '../screens/KhaltiPaymentConfirmation';

const Stack = createStackNavigator();

export default function Routes(){
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="LoginScreen" component={LoginScreen} options={{title: "Login", headerShown:false}}/>
                <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{title: "Forgot Password", headerShown:true}}/>
                <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{title: "Register New User", headerShown:true}}/>
                <Stack.Screen name="DashboardScreen" component={DashboardScreen} options={{title: "Dashbaord", headerShown:false}}/>
                <Stack.Screen name="RegisterDoctorScreen" component={RegisterDoctorScreen} options={{title: "Register Doctor", headerShown:true}}/>
                <Stack.Screen name="Edit_RegisterDoctorScreen" component={RegisterDoctorScreen} options={{title: "Edit Doctor Information", headerShown:true}}/>
                <Stack.Screen name="DoctorListScreen" component={DoctorListScreen} options={{title: "Doctors List", headerShown:true}}/>
                <Stack.Screen name="DoctorProfileInformationScreen" component={DoctorProfileInformationScreen} options={{title: "Doctor Information", headerShown:true}}/>
                <Stack.Screen name="UsersListScreen" component={UsersListScreen} options={{title: "Users List", headerShown:true}}/>
                <Stack.Screen name="UserProfileInformationScreen" component={UserProfileInformationScreen} options={{title: "User Profile Information", headerShown:true}}/>
                <Stack.Screen name="MyProfileInformationScreen" component={MyProfileInformationScreen} options={{title: "My profile", headerShown:true}}/>
                <Stack.Screen name="PatientsAppointmentListScreen" component={PatientsAppointmentListScreen} options={{title: "Patient Appointments", headerShown:true}}/>
                <Stack.Screen name="ManagementAppointmentScreen" component={ManagementAppointmentScreen} options={{title: "Manage Appointment", headerShown:true}}/>
                <Stack.Screen name="Create_AppointmentMakerScreen" component={AppointmentMakerScreen} options={{title: "Create Appointment", headerShown:true}}/>
                <Stack.Screen name="Edit_AppointmentMakerScreen" component={AppointmentMakerScreen} options={{title: "Edit Appointment", headerShown:true}}/>
                <Stack.Screen name="SearchDoctorScreen" component={SearchDoctorScreen} options={{title: "Search Doctor", headerShown:true}}/>
                <Stack.Screen name="SelectedDoctorAppointmentScreen" component={SelectedDoctorAppointmentScreen} options={{title: "Appointment List", headerShown:true}}/>
                <Stack.Screen name="SelectedDoctorAppointmentDetailScreen" component={SelectedDoctorAppointmentDetailScreen} options={{title: "Appointment Detail", headerShown:true}}/>
                <Stack.Screen name="MyAppointmentListScreen" component={MyAppointmentListScreen} options={{title: "My Appointments", headerShown:true}}/>
                <Stack.Screen name="BedManagementListScreen" component={BedManagementListScreen} options={{title: "Bed Management", headerShown:true}}/>
                <Stack.Screen name="Add_BedMakerScreen" component={BedMakerScreen} options={{title: "Add Bed Information", headerShown:true}}/>
                <Stack.Screen name="Edit_BedMakerScreen" component={BedMakerScreen} options={{title: "Edit Bed Information", headerShown:true}}/>
                <Stack.Screen name="PatientAppointmentDetailScreen" component={PatientAppointmentDetailScreen} options={{title: "Patient Appointment Details", headerShown:true}}/>
                <Stack.Screen name="PatientBedListScreen" component={PatientBedListScreen} options={{title: "Bed List", headerShown:true}}/>
                <Stack.Screen name="PatientBookBedScreen" component={PatientBookBedScreen} options={{title: "Book Bed", headerShown:true}}/>
                <Stack.Screen name="PatientReservedBedScreen" component={PatientReservedBedScreen} options={{title: "My Reserved Bed", headerShown:true}}/>
                <Stack.Screen name="BookedBedsScreen" component={BookedBedsScreen} options={{title: "Booked Bed Lists", headerShown:true}}/>
                <Stack.Screen name="PatientBloodBankScreen" component={PatientBloodBankScreen} options={{title: "Blood Banks", headerShown:true}}/>
                <Stack.Screen name="PatientDonateBloodScreen" component={PatientDonateBloodScreen} options={{title: "Donate Blood Form", headerShown:true}}/>
                <Stack.Screen name="PatientAmbulanceServiceScreen" component={PatientAmbulanceServiceScreen} options={{title: "Ambulance Service", headerShown:true}}/>
                <Stack.Screen name="AdminBloodBankListScreen" component={AdminBloodBankListScreen} options={{title: "Blood Bank List", headerShown:true}}/>
                <Stack.Screen name="AdminBloodDonationFormListScreen" component={AdminBloodDonationFormListScreen} options={{title: "Blood Donation Form List", headerShown:true}}/>
                <Stack.Screen name="AdminAmbulanceServiceListScreen" component={AdminAmbulanceServiceListScreen} options={{title: "Ambulance Service List", headerShown:true}}/>
                <Stack.Screen name="AdminAmbulanceServiceMakerScreen" component={AdminAmbulanceServiceMakerScreen} options={{title: "Create Ambulance Service", headerShown:true}}/>
                <Stack.Screen name="AdminBloodBankMakerScreen" component={AdminBloodBankMakerScreen} options={{title: "Create Blood Bank Info", headerShown:true}}/>
                <Stack.Screen name="PatientReportScreen_Add" component={PatientReportScreen_Add} options={{title: "Add Report", headerShown:true}}/>
                <Stack.Screen name="PatientReportScreen" component={PatientReportScreen_Add} options={{title: "Reports", headerShown:true}}/>
                <Stack.Screen name="ImageViewer" component={ImageViewer} options={{title: "Image Viewer", headerShown:true}}/>
                <Stack.Screen name="KhaltiPaymentInitiate" component={KhaltiPaymentInitiate} options={{title: "Khalti Payment Preview", headerShown:true}}/>
                <Stack.Screen name="KhaltiPaymentConfirmation" component={KhaltiPaymentConfirmation} options={{title: "Khalti Payment Confirmation", headerShown:true}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}