import { USERID } from "./actions";

const intial={idOfUser:''}

export function userReducer(state=intial,action){
    switch(action.type)
    {
        case USERID:
            return {...state,idOfUser:action.payload};
            default:
                return state;
    }
}
