import {FETCHCONTRACTDATA, DOWNLOADCONTRACT, FETCHREQUISITES, FETCHCONTRACTTOPAY, DOWNLOADBILL} from '../actions/index';

const INITIAL_STATE = {contract: [], requisites:{}, link: '', contractPay: []};

export default function (state = INITIAL_STATE, action) {
    switch (action.type){
        case FETCHCONTRACTDATA:
            return {...state, contract: action.payload.data}; 
        case FETCHREQUISITES:
            return {...state, requisites: action.payload.data};
        case DOWNLOADCONTRACT:
            return {...state, link: action.payload.data};
        case DOWNLOADBILL:
            return {...state, link_bill: action.payload.data};
        case FETCHCONTRACTTOPAY:
            return {...state, contractPay: action.payload.data};
    }
    return state;
}