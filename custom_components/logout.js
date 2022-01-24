import React from "react";
import { View,  Keyboard,   Alert,StyleSheet } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import Mycomp from "./presscomp";
import { useSelector } from "react-redux";
import sqlite from "react-native-sqlite-storage";

const db = sqlite.openDatabase(
    {
        name: 'list',
        location: "default",
    }
)

export default function Logout_screen({navigation}) {
    
    const {idOfUser}=useSelector(state=>state.userReducer)

    const Gotolists=()=>{
        Alert.alert('Confirmation','Are you sure you want to logout?',[
            {text:'Yes' ,onPress:()=>{navigation.replace('login')}},
            {text:"No"}
        ])
        
    }

    const remove=()=>{
        Alert.alert('Confirmation','Are you sure you want to delete list?',[
            {text:'Yes' ,onPress:()=>{
                try {
                    db.transaction((tx)=>{
                        tx.executeSql(
                            'DELETE FROM USERS WHERE USER_ID=?',
                            [idOfUser],
                            ()=>{console.log("user removed...")},
                            error=>console.log(error)
                        )
                    })
                } catch (error) {
                    console.log(error)
                }
                try {
                    db.transaction((tx)=>{
                        tx.executeSql(
                            'DELETE FROM ITEMS WHERE USER_ID=?',
                            [idOfUser],
                            ()=>{console.log("items removed...")},
                            error=>console.log(error)
                        )
                    })
                } catch (error) {
                    console.log(error)
                }
                navigation.replace('login')
            }},
            {text:"No"}
        ])
        
    }
    
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={Styles.settingItem}>
                <Mycomp title={'profile'} style={{fontWeight:'500'}} />
                </View>
                <View style={Styles.settingItem}>
                <Mycomp title={'Delete List'} style={{fontWeight:'500'}} callfun={remove}/> 
                </View>
                <View style={Styles.settingItem}>
                <Mycomp title={'logout'} style={{fontWeight:'500'}} callfun={Gotolists} textcolor={'red'}/>
                    
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}
const Styles=StyleSheet.create({
    settingItem:
    {
        borderBottomWidth:2,
        borderColor:"white",
        marginLeft:20,
        marginRight:20,
        borderWidth:5,
        backgroundColor:"#D5DBDB"
    }
})