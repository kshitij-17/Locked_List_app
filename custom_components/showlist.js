import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, TouchableWithoutFeedback, TouchableOpacity,Keyboard,  FlatList, ToastAndroid } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import sqlite from "react-native-sqlite-storage";
import { useSelector } from "react-redux";
const db = sqlite.openDatabase(
    {
        name: 'list',
        location: "default",
    }
)

export default function List_screen({route}) {
    useEffect(() => {
        displayList();
    }, [])

    const [Item, UpdateItem] = useState('')
    const [ItemList, SetItemList] = useState([])
    const [insert,switchInsert]=useState(true)
    const [index,switchIndex]=useState(0)
    const {idOfUser}=useSelector(state=>state.userReducer)
    const Enteritem = async () => {
        try {
            if (Item.length > 0) {
                await db.transaction(async (tx) => {
                    tx.executeSql(
                        "INSERT INTO ITEMS (ITEM_NAME,USER_ID) VALUES(?,?)",
                        [Item,route.params.Userid],
                        () => {
                            console.log('value inserted');
                            displayList();
                        },
                        error => {
                            console.error(error);
                        }
                    )
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    const displayList = () => {
        try {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT* FROM ITEMS WHERE USER_ID=?",
                    [route.params.Userid],
                    (tx, results) => {
                        console.log(results.rows.item(0))
                        console.log('displayed')
                        let len = results.rows.length;
                        let listarray = [];
                        if (len > 0) {
                            for (let i = 0; i < len; i++) {
                                listarray.push({ name: results.rows.item(i).ITEM_NAME, id: results.rows.item(i).ID })
                                
                            }   
                        }
                        SetItemList(listarray);
                        

                    },
                    error => { console.error(error) }
                )
            })
        } catch (error) {
            console.error(error)
        }
    }

        const deleteItem=(value)=>{
            try {
                db.transaction((tx)=>{
                    tx.executeSql(
                        "DELETE FROM ITEMS WHERE ID=?",
                        [value],
                        ()=>{
                            console.log('value is deleted')
                            displayList();
                        },
                        error=>{console.error(error)}
                    )
                })
            } catch (error) {
                console.error(error)
            }
        }

        const update=(value)=>{
            try {
                db.transaction((tx)=>{
                    tx.executeSql(
                        "UPDATE ITEMS SET ITEM_NAME=? WHERE ID=?",
                        [Item,value],
                        ()=>{
                            console.log('value is UPDATED')
                            displayList();
                        },
                        error=>{console.error(error)}
                    )
                })
            } catch (error) {
                console.error(error)
            }
            switchInsert(true)
        }

        const changeItem=()=>{
console.log(index)
    insert?Enteritem():update(ItemList[index].id);
        }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10,justifyContent:"space-evenly" }}>
                    <TextInput
                    value={Item}
                        placeholder="Enter new item."
                        style={{ backgroundColor: 'white', width: "78%", marginLeft: 10 }}
                        onChangeText={(value) => UpdateItem(value)}
                    />
                    
                    <Pressable
                        hitSlop={{ top: 12, bottom: 12, left: 15 }}
                        onPress={()=>changeItem()}
                    >

                        {({ pressed }) => (
                            <FontAwesome5Icon name={'plus'} size={34} color={pressed ? "white" : "black"} />
                        )}

                    </Pressable>

                </View>
                
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={ItemList}
                    renderItem={({ item }) => (
                        
                        <View style={{backgroundColor: "#D5DBDB", margin: 10,borderRadius: 12,flexDirection:"row",justifyContent:"space-between"}}>
                            <TouchableOpacity onPress={()=>{switchInsert(false); switchIndex(ItemList.findIndex(Itemm=>Itemm.id===item.id));UpdateItem(item.name);}}>
                            <View style={{width:350}}>
                                <Text style={{ fontSize: 20 ,marginLeft:5,marginRight:50}}>
                                    {item.name} 
                                </Text>
                                </View>
                            </TouchableOpacity>
                            
                            <Pressable style={{flexDirection:"column",alignSelf:"center"}}
                            onPress={()=>{ToastAndroid.show("long press to delete",ToastAndroid.LONG)}}
                            onLongPress={()=>deleteItem(item.id)}
                            >
                           
                                {({pressed})=>(
                                     <View >
                                    <FontAwesome5Icon
                                    name={'trash-alt'}
                                    size={30}
                                    color={pressed?"red":"black"}
                                />
                                 </View>
                                )}
                                
                           
                            </Pressable>
                           
                        </View>
                    )
                    }

                />

            </View>
        </TouchableWithoutFeedback>
    )
}