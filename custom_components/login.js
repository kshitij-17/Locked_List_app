import React, { useState, useEffect } from "react";
import { View, Text,ScrollView, Keyboard, TextInput, Alert, ToastAndroid, Modal, Animated, Pressable,  FlatList} from "react-native";
import { TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import Mycomp from "./presscomp";
import sqlite from "react-native-sqlite-storage";
import { useID } from "./redux/actions";
import { useDispatch } from "react-redux";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const db = sqlite.openDatabase(
    {
        name: 'list',
        location: "default",
    }
)



const createUsers = () => {
    try {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS USERS"
                + "(USER_ID INTEGER PRIMARY KEY AUTOINCREMENT,USER_NAME TEXT,PASSWORD TEXT);",
                [],
                () => {
                    console.log('table users is created')
                },
                error => { console.error(error) }

            )
        })
    } catch (error) {
        console.error(error)
    }
}

const createEntry = () => {
    try {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS ITEMS"
                + "(ID INTEGER PRIMARY KEY AUTOINCREMENT,ITEM_NAME TEXT,USER_ID INTEGER," +
                "CONSTRAINT FK_USR FOREIGN KEY(USER_ID) REFERENCES USERS(USER_ID) ON DELETE CASCADE);"
                ,
                [],
                () => {
                    console.log('table items is created')
                },
                error => { console.error(error) }

            )
        })
    } catch (error) {
        console.error(error)
    }
}



export default function Login_screen({ navigation }) {
    const [name, setName] = useState('');
    const [newname, setnewname] = useState('');
    const [pass, updatepass] = useState('');
    const [newpass, updatenewpass] = useState('');
    const [modal1, modal1switch] = useState(false)
    const [modal2, modal2switch] = useState(false)
    const [dropList, setDropList] = useState([]);
    const value = useState(new Animated.Value(0))[0];

    const move = (user_val) => {
        Animated.timing(value, {
            toValue: 1000,
            duration: 2000,
            useNativeDriver: false
        }).start(() => {
            ToastAndroid.show('logged in successfully!', ToastAndroid.SHORT)
            dispatch(useID(user_val))
            navigation.replace('lists', {
                screen: 'showlists',
                params: { Userid: user_val }
            }
            )
        })

    }

    const dispatch = useDispatch();





    const Gotolists = () => {
        Keyboard.dismiss();
        if (name.length <= 2) {
            Alert.alert('Warning', 'Enter Listname of minimum 3 character long', [
                { text: 'ok' }
            ])
        }
        else {
            if (pass.length == 0) {
                Alert.alert('Warning', 'Enter password', [
                    { text: 'ok' }
                ])
            }
            else {

                try {
                    db.transaction((tx) => {
                        tx.executeSql(
                            "SELECT* FROM USERS WHERE USER_NAME=?",
                            [name],
                            (tx, results) => {
                                console.log('checking in Lists')
                                let len = results.rows.length;
                                if (len > 0) {
                                    if (pass === results.rows.item(0).PASSWORD) {
                                        move(results.rows.item(0).USER_ID);

                                    }
                                    else {
                                        ToastAndroid.show('Incorrect password', ToastAndroid.LONG)
                                    }
                                }
                                else {

                                    modal1switch(true)
                                }
                            },
                            error => { console.error(error) }

                        )
                    })
                } catch (error) {
                    console.error(error)
                }
            }
        }
    }

    const newuser = () => {
        setName('')
        updatepass('')
        if (newname.length <= 2) {
            Alert.alert('Warning', 'Enter a Listname of minimum 3 character long', [
                { text: 'ok' }
            ])
        }
        else {
            try {
                db.transaction((tx) => {
                    tx.executeSql(
                        "SELECT USER_NAME FROM USERS WHERE USER_NAME=?",
                        [newname],
                        (tx, results) => {
                            let len = results.rows.length;
                            if (len == 0) {
                                try {
                                    db.transaction((tx) => {
                                        tx.executeSql(
                                            "INSERT INTO USERS (USER_NAME,PASSWORD) VALUES(?,?)",
                                            [newname, newpass],
                                            () => {
                                                ToastAndroid.show('sucessfully registered!', ToastAndroid.LONG)
                                                showDropList()
                                                modal1switch(false)

                                            },
                                            error => { console.error(error) }
                                        )
                                    })
                                } catch (error) {
                                    console.error(error)
                                }
                            }
                            else {
                                modal1switch(false);
                                ToastAndroid.show('List already exists', ToastAndroid.LONG)
                            }
                        },
                        error => { console.error(error) }
                    )
                })
            } catch (error) {
                console.error(error);
            }

        }
    }

    const showDropList = () => {
        try {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT* FROM USERS;',
                    [],
                    (_, results) => {
                        let len = results.rows.length;
                        let listArr = [];
                        if (len > 0) {
                            for (let i = 0; i < len; ++i) {
                                listArr.push(results.rows.item(i).USER_NAME);
                            }

                        }
                        setDropList(listArr);

                    },
                    error => console.log(error)
                )
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        createEntry();
        createUsers();
        showDropList();
    }, [])
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            {/* <ScrollView> */}
            <View style={{ flex: 1, backgroundColor: '#D5DBDB', justifyContent: "flex-end" }}>
                <Modal animationType="slide" visible={modal1} onRequestClose={() => modal1switch(false)}>
                    <View style={{ flexDirection: "row", justifyContent: "center", flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View style={{ height: 300, width: 300, alignSelf: "center", backgroundColor: 'white', borderRadius: 20, borderWidth: 3 }}>
                            <View style={{ alignItems: "center" }}>
                                <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginTop: 10 }}>
                                    Enter Listname
                                </Text>
                                <TextInput
                                    placeholder="e.g list1"
                                    style={{ borderWidth: 1, alignSelf: "center", width: 270, marginTop: 15, marginBottom: 4 }}
                                    onChangeText={(value) => setnewname(value)}
                                />
                                <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
                                    Enter password
                                </Text>
                                <TextInput
                                    secureTextEntry
                                    style={{ borderWidth: 1, alignSelf: "center", width: 270, marginTop: 15, marginBottom: 25 }}
                                    onChangeText={(value) => updatenewpass(value)}
                                />
                                <View style={{ width: 200, flexDirection: "row", justifyContent: "space-between" }}>

                                    <TouchableOpacity onPress={() => modal1switch(false)} >
                                        <View style={{
                                            backgroundColor: "#D5DBDB", width: 90, shadowOffset: { height: 3, width: 0 }, shadowOpacity: 0.3, shadowRadius: 4.3,
                                            shadowColor: "#000"
                                            , borderWidth: 1.6,
                                            borderColor: "grey",
                                            alignItems: "center", elevation: 3
                                        }}

                                        >
                                            <Text style={{ fontSize: 20 }}>
                                                Not now
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={newuser}>
                                        <View style={{
                                            backgroundColor: "#D5DBDB", width: 90, shadowOpacity: 2, shadowRadius: 2,
                                            shadowColor: "#000"
                                            , borderWidth: 1.6,
                                            borderColor: "grey",
                                            alignItems: "center", elevation: 3
                                        }}
                                        >
                                            <Text style={{ fontSize: 20 }}>
                                                Create
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    </View>
                </Modal>
                <Modal visible={modal2} transparent onRequestClose={() => { modal2switch(false) }}>

                    <TouchableWithoutFeedback onPress={() => modal2switch(false)}>
                        <View style={{
                            flex: 1, opacity: 1, position: "absolute",
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            backgroundColor: "black",
                            opacity: 0.5
                        }}>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <View style={{  width: 300, alignSelf: "center" ,}}>
                            <FlatList
                                data={dropList}
                                renderItem={({ item }) => (
                                    <>
                                    <Pressable onPress={()=>{setName(item);modal2switch(false)}}>
                                        {({pressed})=>(
                                            <View style={{ height: 50, borderColor: "white" ,backgroundColor:pressed?"#D5DBDB":"white",borderWidth:5,borderColor:"white",borderRadius:5}}> 
                                        <Text style={{ fontSize: 30, textAlignVertical: "center", textAlign: "center", }}>
                                            {item}
                                        </Text>
                                       
                                    </View>
                                        )}
                                    
                                    </Pressable>
                                    </>
                                )}
                            >

                            </FlatList>
                        </View>

                    </View>

                </Modal>
               
                <Text style={{ fontSize: 20, fontWeight: '800', textAlign: "center", margin: 5 }}>
                    Enter Listname OR
                </Text>
                <Pressable onPress={() => (dropList.length>0)?modal2switch(true): ToastAndroid.show('No lists exists! Create one.',ToastAndroid.LONG) }>
                    {({ pressed }) => (
                        <>
                            <Text style={{ color: pressed ? "white" : "grey", fontSize: 20, fontWeight: '800', textAlign: "center", marginBottom: 5 }}>select
                                <FontAwesome5 name="caret-down" size={25} color={pressed ? "white" : "grey"} /></Text>
                        </>
                    )

                    }

                </Pressable>
                <View style={{ alignItems: "center" }} >
                    <TextInput
                        value={name}
                        placeholder="eg.list1"
                        style={{ backgroundColor: 'white', borderRadius: 20, borderWidth: 2, width: 250, textAlign: "center" }}
                        onChangeText={(value) => setName(value)}
                    />
                    <Text style={{ fontSize: 20, fontWeight: '800', textAlign: "center", margin: 15 }}>
                        Enter password
                    </Text>
                    <TextInput
                        value={pass}
                        secureTextEntry={true}
                        style={{ backgroundColor: 'white', borderRadius: 20, borderWidth: 2, width: 250, textAlign: "center" }}
                        onChangeText={(value) => updatepass(value)}
                    />
                    <Pressable onPress={()=>{ToastAndroid.show("still to add this feature.....",ToastAndroid.LONG)}}>
                        
                        {
                            ({pressed})=>(
                            <Text style={{color:pressed?"white":"blue"}}>
                            Forgot password? 
                        </Text>
                            )
                        }
               
                    </Pressable>



                </View>


                <View style={{ marginTop: 100 }}>
                    <Mycomp title={'login'} style={{ fontWeight: '500' }} callfun={Gotolists} />
                    <Mycomp title={'New List'} style={{ fontWeight: '500' }} callfun={() => modal1switch(true)} />
                </View>

                <Animated.View style={{ backgroundColor: "black", height: 35, width: value, position: "absolute" }}>


                </Animated.View>
                <View style={{ flex: 0.4, justifyContent: "flex-end", marginBottom: 5 }}>
                    <Text style={{ letterSpacing: 10, alignSelf: "center", fontSize: 20, color: "#D5DBDB" }}>Your list is secure</Text>
                </View>

            </View>
            {/* </ScrollView> */}
            
        </TouchableWithoutFeedback>
    )
}