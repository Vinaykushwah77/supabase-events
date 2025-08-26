/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

type Event = {
  id: string;
  title: string;
  description?: string;
  date: string;
  city?: string;
  created_by?: string;
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .order("date") as { data: Event[] | null; error: any };

      setEvents(data || []);
    };
    fetchEvents();
  }, []);

  return (
    <div className="events-container">
      <h1 className="events-title">Upcoming Events</h1>
      {events.length === 0 && <p className="no-events">No upcoming events.</p>}

      <ul className="events-list">
        {events.map((event) => (
          <li key={event.id} className="event-item">
            <h3 className="event-title">{event.title}</h3>
            <p className="event-description">{event.description}</p>
            <p className="event-info">
              Date: {event.date} | City: {event.city || "N/A"}
            </p>
            <Link href={`/rsvp/${event.id}`}>
              <button className="rsvp-button">RSVP</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
