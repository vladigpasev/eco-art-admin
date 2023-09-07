import Image from 'next/image'
import { auth } from '@clerk/nextjs';

export default function Home() {
  const {userId, getToken} = auth();
  if(userId != 'user_2V1byctNqwkR0Zwhps5BIn1WRX2'){
    return <div>Your account doesn't have admin permissions!</div>;
  }

  return (
   <div>Hello there</div>
  )
}
