import {createSlice} from "@reduxjs/toolkit"

export const counterSlice=createSlice({
    name:"count",
    initialState:{count:0},
    reducers:{
     incrementCount:(state)=>{
        state.count+=1
     },
      decrementCount:(state)=>{
        state.count-=1
     }
    }
})
export default counterSlice.reducer;
export const {incrementCount,decrementCount}=counterSlice.actions