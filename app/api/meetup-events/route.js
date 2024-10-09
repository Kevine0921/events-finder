import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'script', 'meetup_events.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const events = JSON.parse(jsonData);

    const formattedEvents = events.map(event => {
      return {
        id: event.link.split('/')[5], // Using the event ID from the link
        name: event.title,
        image_url: event.image_url,
        timezone: null, // Meetup doesn't provide timezone in your JSON, defaulting to UTC
        url: event.link,
        city: event.city,
        group_name: `${event.group_name}`, // Only city is available in your JSON
        start_at: null, // Start time not provided in your JSON
        end_at: null, // End time not provided in your JSON
        latitude: event.latitude,
        longitude: event.longitude,
      };
    });

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error('Error reading or parsing meetup events:', error);
    return NextResponse.json({ error: 'Failed to fetch meetup events' }, { status: 500 });
  }
}