'use client'
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../utils/Mongo';
import { clerkClient } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';

   //@ts-ignore
export default function Validate({ params, searchParams }) {
    const { userId } = useAuth();

    if(userId != 'user_2V1byctNqwkR0Zwhps5BIn1WRX2'){
      return <div>Your account doesn't have admin permissions!</div>;
    }

    const [event, setEvent] = useState(null);
    const [mainUser, setMainUser] = useState(null);
    const [userName, setUserName] = useState(null);
    const mainUserId = searchParams.user_id;

    useEffect(() => {
        async function fetchUser() {
            // Зареждане на данни за евента
            const userResponse = await axios.get(`/api/users/get?user_id=${mainUserId}`);
            const userFirsLastName = userResponse.data.mainUser.firstName + ' ' + userResponse.data.mainUser.lastName;
               //@ts-ignore
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
   //@ts-ignore
    const getArrivalStatus = (participantId, isGuest) => {
           //@ts-ignore
        const participantList = isGuest ? event.guestParticipants : event.participants;
           //@ts-ignore
        const participant = participantList.find(p => p.id === participantId);
        return participant?.arrived;
    };

   //@ts-ignore
    function setArrivedFunc(participantId, updateGuest) {
        axios.patch('/api/events/set_arrived', {
            eventId: searchParams.event_id,
            participantId,
            arrived: true,
            updateGuest
        })
            .then(response => {
                console.log('Success:', response);
                setEvent(prevState => {
                       //@ts-ignore
                    const updatedEvent = { ...prevState };
                    if (updateGuest) {
                           //@ts-ignore
                        const guestIndex = updatedEvent.guestParticipants.findIndex(guest => guest.id === participantId);
                        if (guestIndex !== -1) {
                            updatedEvent.guestParticipants[guestIndex].arrived = true;
                        }
                    } else {
                           //@ts-ignore
                        const participantIndex = updatedEvent.participants.findIndex(participant => participant.id === participantId);
                        if (participantIndex !== -1) {
                            updatedEvent.participants[participantIndex].arrived = true;
                        }
                    }
                    return updatedEvent;
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }




    if (!event || !userName) {
        return <div>Loading...</div>;
    }
   //@ts-ignore
    const guests = event?.guestParticipants?.filter(guest => guest.mainParticipant === searchParams.user_id) || [];



    return (
        <div className="bg-gray-100 min-h-screen p-4">
            <div className="max-w-full mx-auto bg-white rounded-xl shadow-md p-8 md:max-w-md">
                {/* @ts-ignore */}
                <h1 className="text-3xl font-semibold text-gray-900 mb-4">{event.title}</h1>
                <div className="text-lg text-gray-700 mb-6">
                    {/* @ts-ignore */}
                    <p className="mb-2"><span className="font-semibold">Price:</span> {event.price} BGN</p>
                    {/* @ts-ignore */}
                    <p className="mb-2"><span className="font-semibold">Date:</span> {event.date} </p>
                    {/* @ts-ignore */}
                    <p className="mb-2"><span className="font-semibold">Mentor:</span> {event.mentor}</p>
                    <p className="mb-2"><span className="font-semibold">Payment Type:</span> Dummy Payment Type</p>
                    <p className="mb-2"><span className="font-semibold">Payment Status:</span> Dummy Payment Status</p>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Organizer:</h2>
                <li className="mb-2 flex items-center justify-between">
                    <span className='text-black'>{userName}</span>
                    <button
                        onClick={() => setArrivedFunc(mainUserId, false)}
                        disabled={getArrivalStatus(mainUserId, false)}  // Disable button based on arrival status
                        className={`btn btn-sm ${getArrivalStatus(mainUserId, false) ? 'bg-gray-400' : 'bg-[#32A852] hover:bg-[#32a852ca]'} text-white border-none`}
                    >
                        {getArrivalStatus(mainUserId, false) ? 'Arrived' : 'Arrive'}  {/* Change button text based on arrival status */}
                    </button>
                </li>

                {/* Guest Participants */}
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Guest Participants:</h2>
                <ul className="list-disc list-inside text-gray-700">
                {guests.length > 0 && (
    <>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Guest Participants:</h2>
        <ul className="list-disc list-inside text-gray-700">
            {/* @ts-ignore */}
            {guests.map((guest, index) => (
                <li key={index} className="mb-2 flex items-center justify-between">
                    <span className='text-black'>{guest.name}</span>
                    <button
                        onClick={() => setArrivedFunc(guest.id, true)}
                        disabled={getArrivalStatus(guest.id, true)} 
                        className={`btn btn-sm ${getArrivalStatus(guest.id, true) ? 'bg-gray-400' : 'bg-[#32A852] hover:bg-[#32a852ca]'} text-white border-none`}
                    >
                        {getArrivalStatus(guest.id, true) ? 'Arrived' : 'Arrive'} 
                    </button>
                </li>
            ))}
        </ul>
    </>
)}
                </ul>
            </div>
        </div>
    );

}

