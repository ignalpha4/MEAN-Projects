import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor() { }

  getUsers(){
    let users = localStorage.getItem('users')
    return users ? JSON.parse(users) : []; 
  }

  addUser(newUser:IUser){
    let users = this.getUsers();

    let user = users.find((user:IUser)=>user.email === newUser.email);

    if(user){
      return false;
    }

    users.push(newUser);
    localStorage.setItem('users',JSON.stringify(users));
    return true;
  }

  userLogin(loginUser:IUser){

    let users = this.getUsers();

    let user =  users.find((user:IUser)=>user.email === loginUser.email && user.password ===loginUser.password);

    if(user){
      return true;
    }
    return false;
  }

  setCurrentUser(loginUser:IUser){
    localStorage.setItem('currentUser',loginUser.email);
  }

  getCurrentUser(){

    let users =  this.getUsers();

    let currentuser = localStorage.getItem('currentUser');

    let user = users.find((user:IUser)=>user.email === currentuser);

    return user;
  }

  logout(){
    localStorage.removeItem('currentUser');
  }

}
