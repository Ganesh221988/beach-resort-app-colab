import React from "react";
import { useEvents, EventType } from "../contexts/EventContext";

const EventPropertiesPage: React.FC = () => {
  const { events } = useEvents();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Event Properties</h2>
      {events.map((e: EventType) => (
        <div key={e.id} style={{ marginBottom: "10px" }}>
          <strong>{e.title}</strong> – {e.date}
        </div>
      ))}
    </div>
  );
};

export default EventPropertiesPage;
