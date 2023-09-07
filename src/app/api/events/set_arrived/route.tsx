import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../utils/Mongo';
import { ObjectId } from 'mongodb';
import { auth } from '@clerk/nextjs';

export async function PATCH(req: NextRequest): Promise<NextResponse> {
    try {
        const { eventId, participantId, arrived, updateGuest } = await req.json();
        const db = await connectToDatabase();
        const eventsCollection = db.collection('events');

        // Определяне на полетата, които трябва да бъдат обновени, в зависимост от стойността на updateGuest
        const updateFields = updateGuest 
          ? { 'guestParticipants.$[elem].arrived': arrived } 
          : { 'participants.$[elem].arrived': arrived };
          
        await eventsCollection.updateOne(
            { '_id': new ObjectId(eventId) },
            { $set: updateFields },
            { 
              arrayFilters: [{ 'elem.id': participantId }]
            }
        );

        return NextResponse.json({ message: 'Arrival status updated successfully.' }, {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });

    } catch (err) {
        console.error('Failed to update arrival status:', err);
        return NextResponse.json({ error: 'Failed to update arrival status' }, {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
    }
}

