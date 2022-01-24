import React from "react";
import {Pressable,Text} from 'react-native'

const Mycomp=(props)=>{
    return(
        <Pressable
        style={ [{
          height: 34,
          margin:10,

          alignItems: "stretch"
        }]}
        onPress={props.callfun}

      >
{({pressed})=>(
  <Text
          style={[{
            color: pressed?"white":props.textcolor,
            fontSize: 20,
            textAlign: "center",
            letterSpacing: 10,
            fontFamily:"Rampart One"
          },{...props.style}]}>
          {props.title}
        </Text>
)}
        

      </Pressable>

    )
}
export default Mycomp;