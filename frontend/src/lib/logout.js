'use server'
 
import { cookies } from 'next/headers'
 
export async function deleteCookie(data) {
  (await cookies()).delete('token')
}