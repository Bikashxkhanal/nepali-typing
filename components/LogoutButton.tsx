'use client';
import {signOut} from 'next-auth/react';
export function LogoutButton(){return <button className="btn btn-quiet" onClick={()=>signOut({callbackUrl:'/'})}>Log out</button>}
