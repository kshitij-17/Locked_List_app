export const USERID="USERID"

export const useID=idOfUser=>dispatch=>{
    dispatch({
        type:USERID,
        payload:idOfUser,
    })
}