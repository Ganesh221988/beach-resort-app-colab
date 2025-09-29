import React from "react";
import { useEvents } from "../contexts/EventContext";
import EventForm from "../components/events/EventForm";

const EventsPage: React.FC = () => {
  const { events, deleteEvent } = useEvents();

  return (
    <div className="p-6 space-y-6">
      <EventForm />

      <h2 className="text-xl font-bold">All Events</h2>
      {events.length === 0 ? (
        <p>No events found. Add some!</p>
      ) : (
        <ul className="space-y-3">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow"
            >
              <div>
                <h3 className="font-semibold">{event.name}</h3>
                <p className="text-sm text-gray-600">{event.date}</p>
                <p>{event.description}</p>
              </div>
              <button
                onClick={() => deleteEvent(event.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventsPage;
