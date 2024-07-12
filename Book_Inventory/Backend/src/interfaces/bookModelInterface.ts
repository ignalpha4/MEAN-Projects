import { ObjectId } from "mongoose"

export interface IBookModel{
    title:string,

    author:ObjectId,
    category:ObjectId,
    ISBN:string,
    description:string,
    price:number
}