import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../utils/Mongo';
import { ObjectId } from 'mongodb';


export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)

const event_id = searchParams.get('event_id');
    try {
        const db = await connectToDatabase();

        const eventsCollection = db.collection('events');
        {/* @ts-ignore */}
        const events = await eventsCollection.findOne({ '_id': new ObjectId(event_id) });

        // Create a new response with headers
        return new NextResponse(JSON.stringify({ events }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (err) {
        console.error('Failed to fetch data:', err);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}