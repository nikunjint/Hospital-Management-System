import { Alert, Linking } from 'react-native';

export default class Utils{
    static khalti_payment_init = "https://khalti.com/api/v2/payment/initiate/";
    static khalti_payment_confirm = "https://khalti.com/api/v2/payment/confirm/";
    static khalti_public_secret = "test_public_key_af256c4df1bb4c0ebda731a66c8b38cb"; //test_public_key_af256c4df1bb4c0ebda731a66c8b38cb

    

    static serverUrl = () => {
        return "http://192.168.1.67:5000/";
    }

    static handleUrl = (url) => {
        Linking.canOpenURL(url).then(supported => {if(supported){Linking.openURL(url);}else{Alert.alert("Error", "Can't open this url");} });
    }

    static getTwoCharacterFromString(s){
        if (typeof s !== 'string' || s == "") return '';
        let cString = ""; const splitted = s.split(" ");
        if(splitted.length >=2 ){
            cString = splitted[0].length>0?splitted[0].charAt(0).toUpperCase():"";
            cString += splitted[1].length>0?splitted[1].charAt(0).toUpperCase():"";
        }
        else if(splitted.length == 1){
            const split_data = splitted[0];
            if(split_data.length <= 1) cString = split_data.toUpperCase();
            else cString = (split_data[0] + split_data[1]).toUpperCase();
        }
        return cString;
    }

    static generateRandomUserImage(){
        const number = this.random(1, 100);
        return "https://randomuser.me/api/portraits/men/" + number +".jpg"
    }

    static random(min, max){
        return Math.trunc(min + Math.random() * (max - min));
    }

    static getAge(dob){
        var today = new Date();
        var birthDate = new Date(dob);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) { age--; }
        return age;
    }

    static getDepartment(){
        return([
            "All Department",
            "Anesthetics",
            "Breast Screening",
            "Cardiology",
            "Central Sterile Services Department (CSSD)",
            "Chaplaincy",
            "Coronary Care Unit (CCU)",
            "Critical Care",
            "Diagnostic Imaging",
            "Discharge Lounge",
            "Elderly services",
            "Finance Department",
            "Gastroenterology",
            "General Services",
            "General Surgery",
            "Gynecology",
            "Haematology",
            "Health and Safety",
            "Intensive Care Unit (ICU)",
            "Human Resources",
            "Infection Control",
            "Information Management",
            "Maternity",
            "Medical Records",
            "Microbiology",
            "Neonatal",
            "Nephrology",
            "Neurology",
            "Nutrition and Dietetics",
            "Obstetrics/Gynecology",
            "Occupational Therapy",
            "Oncology",
            "Ophthalmology",
            "Orthopaedics",
            "Otolaryngology (Ear, Nose, and Throat)",
            "Pain Management",
            "Patient Accounts",
            "Patient Services",
            "Pharmacy",
            "Physiotherapy",
            "Radiology",
            "Radiotherapy",
            "Renal",
            "Rheumatology",
            "Sexual Health",
            "Social Work",
            "Urology"
        ])
    }

    static searchStr(_needle, _sentence){
        const needle = _needle.toLowerCase();
        const sentence = _sentence.toLowerCase();
        const splitNeedle = needle.split(" ");
        for(const w of splitNeedle){
            const needleWord = w.trim();
            if(needleWord != ""){ 
                let reg = new RegExp("[A-Za-z0-9]*" + needleWord +"[A-Za-z0-9]*");
                return sentence.search(reg);
            }
        }
        return -1;
    }
}