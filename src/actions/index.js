require('es6-promise').polyfill();
import axios from 'axios';
export let ROOT_URL;


if(window.location.host == 'localhost:8080'){
    ROOT_URL = 'https://reg.skyservice2017.com/api'
    // ROOT_URL = 'http://192.168.1.189:8080'
}else{
    ROOT_URL = window.location.origin+'/api'
}

// export const ROOT_URL = window.location.hostname;
// export const ROOT_URL = 'https://reg.wgforum.ru/api';
// export const ROOT_URL = 'http://event.dev.4-com.pro/api';
// (`${ROOT_URL}api-token-auth/`, props);
export const SIGN_IN = 'SIGN_IN';
export const REGISTRATION_COMPANY = 'REGISTRATION_COMPANY';
export const REGISTRATION_PEOPLE = 'REGISTRATION_PEOPLE';
export const FETCH_DATA_REGISTRATION = 'FETCH_DATA_REGISTRATION';
export const SWITCH_LANGUAGE = 'SWITCH_LANGUAGE';
export const LKFETCHDATA = 'LKFETCHDATA';
export const PROFILEFETCHDATA = 'PROFILEFETCHDATA';
export const PARTICIPANTSFETCHDATA = 'PARTICIPANTSFETCHDATA';
export const PARTICIPANTSFREEFETCHDATA = 'PARTICIPANTSFREEFETCHDATA';
export const ACCOMMODATIONFETCHDATA = 'ACCOMMODATIONFETCHDATA';
export const DELPARTICIPANTS = 'DELPARTICIPANTS';
export const ADDPARTICIPANTS = 'ADDPARTICIPANTS';
export const FETCHCONTRACTDATA = 'FETCHCONTRACTDATA';
export const FETCHREQUISITES = 'FETCHREQUISITES';
export const ADDREQUISITES = 'ADDREQUISITES';
export const ACCOMODATIONFETCH = 'ACCOMODATIONFETCH';
export const MEMBERFETCHDATA = 'MEMBERFETCHDATA';
export const DOWNLOADCONTRACT = 'DOWNLOADCONTRACT';
export const EMAILCONTRACT = 'EMAILCONTRACT';
export const EMAILCONTRACTDOUBLE = 'EMAILCONTRACTDOUBLE';
export const DOWNLOADBILL = 'DOWNLOADBILL';
export const EMAILBILL = 'EMAILBILL';
export const CHANGEPROFILE = 'CHANGEPROFILE';
export const PACKAGESFETCHDATA = 'PACKAGESFETCHDATA';
export const FETCHHOTELS = 'FETCHHOTELS';
export const ADDHOTELS = 'ADDHOTELS';
export const ADDHOTELSENG = 'ADDHOTELSENG';
export const FETCHPEOPLEWITHHOTEL = 'FETCHPEOPLEWITHHOTEL';
export const FETCHFLIGHTDATA = 'FETCHFLIGHTDATA';
export const ACTIVITYFETCHUSER = 'ACTIVITYFETCHUSER';
export const ADDACTIVITYUSER = 'ADDACTIVITYUSER';
export const FETCHONEFLIGHTDATA = 'FETCHONEFLIGHTDATA';
export const ADDFLIGHTDATA = 'ADDFLIGHTDATA';
export const CHANGEFLIGHTDATA = 'CHANGEFLIGHTDATA';
export const FETCHTRANSPORTCLASS = 'FETCHTRANSPORTCLASS';
export const ADDTRANSPORT = 'ADDTRANSPORT';
export const ADDOWNTRANSPORT = 'ADDOWNTRANSPORT';
export const FETCHOWNTRANSPORT = 'FETCHOWNTRANSPORT';
export const CHANGEOWNTRANSPORT = 'CHANGEOWNTRANSPORT';
export const DELOWNTRANSPORT = 'DELOWNTRANSPORT';
export const FETCHPEOPLEWITHTRANSPORT = 'FETCHPEOPLEWITHTRANSPORT';
export const FETCHCULTURALDATA = 'FETCHCULTURALDATA';
export const ADDCULTURAL = 'ADDCULTURAL';
export const FETCHCULTURALMEMBER = 'FETCHCULTURALMEMBER';
export const FETCHCULTURALONEMEMBER = 'FETCHCULTURALONEMEMBER';
export const ADDCHANGECULTURAL = 'ADDCHANGECULTURAL';
export const FETCHONEFLIGHT = 'FETCHONEFLIGHT';
export const FETCHHEADER = 'FETCHHEADER';
export const FETCHREGISTRLABEL = 'FETCHREGISTRLABEL';
export const FETCHCONTRACTTOPAY = 'FETCHCONTRACTTOPAY';
export const REGISTRATION_MEDIAMASS = 'REGISTRATION_MEDIAMASS';
export const PARTICIPANTSPAYFETCHDATA = 'PARTICIPANTSPAYFETCHDATA';
export const FETCHTICKETS = 'FETCHTICKETS';
export const ADDTICKETSONE = 'ADDTICKETSONE';


export function fethLanguage(props) {
    return{
        type: SWITCH_LANGUAGE,
        payload: props
    }
}
export function fetchHeader() {
    const request = axios.get(`${ROOT_URL}/v0/custom/static/`);

    return{
        type: FETCHHEADER,
        payload: request
    }
}

export function fetchContractToPay(token) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.get(`${ROOT_URL}/v0/contracts/`, config);

    return{
        type: FETCHCONTRACTTOPAY,
        payload: request
    }
}

export function fetchRegistrLabel(lang, type) {
    const request = axios.get(`${ROOT_URL}/v0/custom/user-fields/${lang}/?page=${type}`);

    return{
        type: FETCHREGISTRLABEL,
        payload: request
    }
}

export function signIn(props) {
    const request = axios.post(`${ROOT_URL}/v0/accounts/login/`, props)
        .then((response)=>{
            console.log(response, 'response')
            return response
        })
        .catch((err)=>{
            let result = {
                error_signIn: 'error'
            };
            return result
        });

    return{
        type: SIGN_IN,
        payload: request
    }
}

export function RegistrCompany(props) {
    const data = {
        name_ru: props.organization_ru,
        name_en: props.organization_en
    };

    const request = axios.post(`${ROOT_URL}/v0/organization/create/`, data)
        .then((data)=>{
            props.organization = data.data.id;
            delete props['organization_ru'];
            delete props['organization_en'];
            const subRequest = axios.post(`${ROOT_URL}/v0/accounts/register/`, props)
                .then((data)=>{
                    return data
                })
                .catch((err)=>{
                    let result = {
                        error_email: err.data.email,
                        data: err.data
                    };
                    return result
                });
            return subRequest
        })
        .catch((err) => {
            let result = {
                error_org: 'Bad',
                data: err.data
            };
            return result
        });

    return{
        type: REGISTRATION_COMPANY,
        payload: request
    }
}

export function RegistrPeople(props) {
    const request = axios.post(`${ROOT_URL}/v0/accounts/register/`, props)

    return{
        type: REGISTRATION_PEOPLE,
        payload: request
    }
}
export function RegistrationMediamass(props) {
    const request = axios.post(`${ROOT_URL}/v0/accounts/register/mm/`, props)
        .then((response)=>{
            return response
        }).catch((err) => {
            let result = {
                error_org: 'Bad',
                data: err.data
            };
            return result
        });

    return{
        type: REGISTRATION_MEDIAMASS,
        payload: request
    }
}

export function RegistrFetchData() {
    const request = axios.get(`${ROOT_URL}/v0/countries/`);

    return{
        type: FETCH_DATA_REGISTRATION,
        payload: request
    }
}

export function PackagesFetchData(token, type) {
    let config;
    let request;
    if(token){
        config = {
            headers: {'Authorization': 'Token ' + token}
        };
        request = axios.get(`${ROOT_URL}/v0/packages/${type}/`, config);
    }else{
        request = axios.get(`${ROOT_URL}/v0/packages/${type}/`);
    }


    return{
        type: PACKAGESFETCHDATA,
        payload: request
    }
}

export function LKFetchData(props) {
    let config = {
        headers: {'Authorization': 'Token ' + props}
    };
    const request = axios.get(`${ROOT_URL}/v0/accounts/agreement/`, config);

    return{
        type: LKFETCHDATA,
        payload: request
    }
}

export function ProfileFetchData(props) {
    let config = {
        headers: {'Authorization': 'Token ' + props}
    };
    const request = axios.get(`${ROOT_URL}/v0/accounts/profile/`, config);

    return{
        type: PROFILEFETCHDATA,
        payload: request
    }
}

export function LKChangeData(props) {
    let config = {
        headers: {'Authorization': 'Token ' + props}
    };
    const request = axios.post(`${ROOT_URL}/v0/accounts/agreement/`, null, config);

    return{
        type: LKFETCHDATA,
        payload: request
    }
}

export function ParticipantsFetchData(props) {
    let config = {
        headers: {'Authorization': 'Token ' + props}
    };
    const request = axios.get(`${ROOT_URL}/v0/members/`, config);

    return{
        type: PARTICIPANTSFETCHDATA,
        payload: request
    }
}

export function ParticipantsFreeFetchData(props) {
    let config = {
        headers: {'Authorization': 'Token ' + props}
    };

    const request = axios.get(`${ROOT_URL}/v0/members/?is_free=True`, config);


    return{
        type: PARTICIPANTSFREEFETCHDATA,
        payload: request
    }
}

export function ParticipantsPayFetchData(props) {
    let config = {
        headers: {'Authorization': 'Token ' + props}
    };

    const request = axios.get(`${ROOT_URL}/v0/members/?is_free=False`, config);


    return{
        type: PARTICIPANTSPAYFETCHDATA,
        payload: request
    }
}

export function DelParticipants(props, id) {
    let config = {
        headers: {'Authorization': 'Token ' + props}
    };
    const request = axios.delete(`${ROOT_URL}/v0/members/${id}/`, config);

    return{
        type: DELPARTICIPANTS,
        payload: request
    }
}

export function MemberFetchData(props, id) {
    let config = {
        headers: {'Authorization': 'Token ' + props}
    };
    const request = axios.get(`${ROOT_URL}/v0/members/${id}/`, config);

    return{
        type: MEMBERFETCHDATA,
        payload: request
    }
}

export function AddParticipants(props, token) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };

    delete props['organization_ru'];
    delete props['organization_en'];

    console.log(props, 'propsprops')
    const request = axios.post(`${ROOT_URL}/v0/members/`, props, config)
        .then((response)=>{
            return response
        }).catch((err) => {
            let result = {
                error_org: 'Bad',
                data: err.data
            };
            return result
        });

    return{
        type: ADDPARTICIPANTS,
        payload: request
    }
}

export function FetchContractData(props) {
    let config = {
        headers: {'Authorization': 'Token ' + props}
    };
    const request = axios.get(`${ROOT_URL}/v0/contract/`, config);

    return{
        type: FETCHCONTRACTDATA,
        payload: request
    }
}

export function FetchRequisites(id, token) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.get(`${ROOT_URL}/v0/organization/get/${id}/`, config);

    return{
        type: FETCHREQUISITES,
        payload: request
    }
}

export function AddRequisites(props, id, token) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.put(`${ROOT_URL}/v0/organization/get/${id}/`,props, config);

    return{
        type: ADDREQUISITES,
        payload: request
    }
}

export function ChangeProfile(props, token, id) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };

    delete props['organization_ru'];
    delete props['organization_en'];

    const request = axios.put(`${ROOT_URL}/v0/members/${id}/`, props, config)
        .then((response)=>{
            return response
        }).catch((err) => {
            let result = {
                error_org: 'Bad',
                data: err.data
            };
            return result
        });


    return{
        type: CHANGEPROFILE,
        payload: request
    }
}

export function AccomodationFetch() {
    const request = axios.get(`${ROOT_URL}/v0/countries/`);

    return{
        type: ACCOMODATIONFETCH,
        payload: request
    }
}

export function DownloadContract(token, id) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    let request;
    if(id != null){
        request = axios.get(`${ROOT_URL}/v0/contract/${id}`, config).then((response)=>{
            return response
        });
    }else{
        request = axios.post(`${ROOT_URL}/v0/contract/`, null, config).then((response)=>{
            return response
        });
    }
    return{
        type: DOWNLOADCONTRACT,
        payload: request
    }
}
export function DownloadBill(token, id) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    let request;
    if(id != null){
        request = axios.get(`${ROOT_URL}/v0/contract/bill/${id}`, config).then((response)=>{
            return response
        });
    }else{
        request = axios.post(`${ROOT_URL}/v0/contract/bill/`, null, config).then((response)=>{
            return response
        });
    }
    return{
        type: DOWNLOADBILL,
        payload: request
    }
}

export function EmailContract(token, id) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    let request;
    if(id != null){
        request = axios.post(`${ROOT_URL}/v0/contract/email/${id}`, null, config).then((response)=>{
            return response
        });
    }else{
        request = axios.post(`${ROOT_URL}/v0/contract/email/`, null, config).then((response)=>{
            return response
        });
    }

    return{
        type: EMAILCONTRACT,
        payload: request
    }
}

export function EmailContractDouble(token, url) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.post(`${url}`, null, config).then((response)=>{
        return response
    });

    return{
        type: EMAILCONTRACTDOUBLE,
        payload: request
    }
}

// export function DownloadBill(props, id, token) {
//     let config = {
//         headers: {'Authorization': 'Token ' + token}
//     };
//     const request = axios.put(`${ROOT_URL}/v0/organization/get/${id}/`,props, config).then((response)=>{
//         return response
//     });
//
//     return{
//         type: DOWNLOADCONTRACT,
//         payload: request
//     }
// }

export function EmailBill(props, id, token) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.put(`${ROOT_URL}/v0/organization/get/${id}/`,props, config).then((response)=>{
        return response
    });

    return{
        type: EMAILCONTRACT,
        payload: request
    }
}

export function FetchTickets(token){
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.get(`${ROOT_URL}/v0/tickets/`, config).then((response)=>{
        return response
    });

    return{
        type: FETCHTICKETS,
        payload: request
    }
}

export function AddTicketsOne(props, token) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.post(`${ROOT_URL}/v0/tickets/`, props, config).then((response)=>{
        return response
    });

    return{
        type: ADDTICKETSONE,
        payload: request
    }
}


export function FetchHotel(token){
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.get(`${ROOT_URL}/v0/hotels/`, config).then((response)=>{
        return response
    });

    return{
        type: FETCHHOTELS,
        payload: request
    }
}

export function AddHotel(props, token) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.post(`${ROOT_URL}/v0/accomodation/`, props, config).then((response)=>{
        return response
    });

    return{
        type: ADDHOTELS,
        payload: request
    }
}

export function AddTransport(props, token) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.post(`${ROOT_URL}/v0/transports/`, props, config).then((response)=>{
        return response
    });

    return{
        type: ADDTRANSPORT,
        payload: request
    }
}

export function AddOwnTransport(props, token) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.post(`${ROOT_URL}/v0/auto/create/`, props, config).then((response)=>{
        return response
    }).catch((err)=>{
            let result = {
                error_auto: 'error'
            };
            return result
        });

    return{
        type: ADDOWNTRANSPORT,
        payload: request
    }
}

export function FetchOwnTransport(token, id) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.get(`${ROOT_URL}/v0/auto/${id}/`, config).then((response)=>{
        return response
    });

    return{
        type: FETCHOWNTRANSPORT,
        payload: request
    }
}

export function ChangeOwnTransport(token, props, id) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.patch(`${ROOT_URL}/v0/auto/${id}/`, props, config).then((response)=>{
        return response
    });

    return{
        type: CHANGEOWNTRANSPORT,
        payload: request
    }
}


export function DelOwnTransport(props, id) {
    let config = {
        headers: {'Authorization': 'Token ' + props}
    };
    const request = axios.delete(`${ROOT_URL}/v0/auto/${id}/`, config);

    return{
        type: DELOWNTRANSPORT,
        payload: request
    }
}

export function AddHotelEng(props, token) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.post(`${ROOT_URL}/v0/accomodation/en/`, props, config).then((response)=>{
        return response
    });

    return{
        type: ADDHOTELSENG,
        payload: request
    }
}

export function FetchBookingHotel(token) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.get(`${ROOT_URL}/v0/accomodation/`, config).then((response)=>{
        return response
    });

    return{
        type: FETCHPEOPLEWITHHOTEL,
        payload: request
    }
}

export function FetchBookingTransport(token) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.get(`${ROOT_URL}/v0/transports/`, config).then((response)=>{
        return response
    });

    return{
        type: FETCHPEOPLEWITHTRANSPORT,
        payload: request
    }
}

export function FetchTransportClass(token) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.get(`${ROOT_URL}/v0/tranposrts/classes/`, config).then((response)=>{
        return response
    });

    return{
        type: FETCHTRANSPORTCLASS,
        payload: request
    }
}

export function FetchFlightData(token) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.get(`${ROOT_URL}/v0/flightdata/`, config).then((response)=>{
        return response
    });

    return{
        type: FETCHFLIGHTDATA,
        payload: request
    }
}

export function ActivityFetchUser(token, id) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.get(`${ROOT_URL}/v0/quiz/questions/?id=${id}`, config).then((response)=>{
        return response
    });

    return{
        type: ACTIVITYFETCHUSER,
        payload: request
    }
}

export function AddActivityUser(props, token) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.post(`${ROOT_URL}/v0/quiz/answer/`, props, config).then((response)=>{
        return response
    });

    return{
        type: ADDACTIVITYUSER,
        payload: request
    }
}

export function FetchOneFlightData(token, id) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.get(`${ROOT_URL}/v0/flightdata/user/${id}/`, config).then((response)=>{
        return response
    });

    return{
        type: FETCHONEFLIGHTDATA,
        payload: request
    }
}

export function FetchOneUser(token, id) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.get(`${ROOT_URL}/v0/members/${id}/`, config).then((response)=>{
        return response
    });

    return{
        type: FETCHONEFLIGHT,
        payload: request
    }
}

export function AddFlightData(props, token) {
      let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.post(`${ROOT_URL}/v0/flightdata/`, props, config).then((response)=>{
        return response
    });

    return{
        type: ADDFLIGHTDATA,
        payload: request
    }
}

export function ChangeFlightData(props, token, id) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.patch(`${ROOT_URL}/v0/flightdata/${id}/`, props, config).then((response)=>{
        return response
    });

    return{
        type: CHANGEFLIGHTDATA,
        payload: request
    }
}

export function FetchCulturalData(token) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.get(`${ROOT_URL}/v0/events/`,config).then((response)=>{
        return response
    });

    return{
        type: FETCHCULTURALDATA,
        payload: request
    }
}

export function FetchCulturalMember(token) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.get(`${ROOT_URL}/v0/events/members/`,config).then((response)=>{
        return response
    });

    return{
        type: FETCHCULTURALMEMBER,
        payload: request
    }
}

export function FetchCulturalOneMember(token, id) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.get(`${ROOT_URL}/v0/events/members/${id}/`,config).then((response)=>{
        return response
    });

    return{
        type: FETCHCULTURALONEMEMBER,
        payload: request
    }
}

export function AddCultural(token, props, id) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.post(`${ROOT_URL}/v0/events/members/`, props, config).then((response)=>{
        return response
    });

    return{
        type: ADDCULTURAL,
        payload: request
    }
}

export function AddChangeCultural(token, props, id) {
    let config = {
        headers: {'Authorization': 'Token ' + token}
    };
    const request = axios.patch(`${ROOT_URL}/v0/events/members/${id}/`, props, config).then((response)=>{
        return response
    });

    return{
        type: ADDCHANGECULTURAL,
        payload: request
    }
}

