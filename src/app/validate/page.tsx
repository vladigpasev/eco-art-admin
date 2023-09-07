'use client'
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../utils/Mongo';
import { clerkClient } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Validate({ params, searchParams }) {
    const [event, setEvent] = useState(null);
    const [mainUser, setMainUser] = useState(null);
    const [userName, setUserName] = useState(null);
    const mainUserId = searchParams.user_id;
    //console.log("Clerk Client" + await clerkClient);
    //console.log("Clerk Client Users" + await clerkClient.users);

    useEffect(() => {
        async function fetchUser() {
          // Зареждане на данни за евента
          const userResponse = await axios.get(`/api/users/get?user_id=${mainUserId}`);
          const userFirsLastName = userResponse.data.mainUser.firstName + ' ' + userResponse.data.mainUser.lastName;
          setUserName(userFirsLastName);
          //setEvent(eventResponse.data.events);
          
          // Зареждане на данни за главния потребител
          //const mainUser = await clerkClient.users.getUser(mainUserId);
          //console.log(mainUser);
          //setMainUser(mainUser);
  
        }
    
        fetchUser();
      }, [mainUserId, searchParams.event_id]);

    useEffect(() => {
      async function fetchData() {
        // Зареждане на данни за евента
        const eventId = searchParams.event_id;  // Replace with actual event_id
        const eventResponse = await axios.get(`/api/events/get?event_id=${eventId}`);
        setEvent(eventResponse.data.events);
  
        // Зареждане на данни за главния потребител
        //const mainUser = await clerkClient.users.getUser(mainUserId);
        //console.log(mainUser);
        //setMainUser(mainUser);

      }
  
      fetchData();
    }, [mainUserId]);
  
    if (!event || !userName) {
      return <div>Loading...</div>;
    }

    const guests = event.guestParticipants.filter(guest => guest.mainParticipant === searchParams.user_id);

    function setArrivedFunc(){
        console.log()
    }
    return (
  <div className="bg-gray-100 min-h-screen p-4">
    <div className="max-w-full mx-auto bg-white rounded-xl shadow-md p-8 md:max-w-md">
      <h1 className="text-3xl font-semibold text-gray-900 mb-4">{event.title}</h1>
      <div className="text-lg text-gray-700 mb-6">
        <p className="mb-2"><span className="font-semibold">Price:</span> {event.price} BGN</p>
        <p className="mb-2"><span className="font-semibold">Date:</span> {event.date} </p>
        <p className="mb-2"><span className="font-semibold">Mentor:</span> Dummy Mentor</p>
        <p className="mb-2"><span className="font-semibold">Payment Type:</span> Dummy Payment Type</p>
        <p className="mb-2"><span className="font-semibold">Payment Status:</span> Dummy Payment Status</p>
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Organizer:</h2>
      <li className="mb-2 flex items-center justify-between">
            <span className='text-black'>{userName} {/*(<a href={`mailto:${guest.email}`} className="text-blue-500 underline">{guest.email}</a>)*/}</span>
            <button className="btn btn-sm bg-[#32A852] hover:bg-[#32a852ca] text-white border-none" >Arrive</button>
          </li>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Guest Participants:</h2>
      <ul className="list-disc list-inside text-gray-700">
        {guests.map((guest, index) => (
          <li key={index} className="mb-2 flex items-center justify-between">
            <span className='text-black'>{guest.name} {/*(<a href={`mailto:${guest.email}`} className="text-blue-500 underline">{guest.email}</a>)*/}</span>
            <button className="btn btn-sm bg-[#32A852] hover:bg-[#32a852ca] text-white border-none" >Arrive</button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
}

