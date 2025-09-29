// src/contexts/EventContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { Event } from "../types/event";

interface EventContextType {
  events: Event[];
  fetchEvents: () => Promise<void>;
  addEvent: (event: Event) => void;
  deleteEvent: (id: number) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    try {
      const res = await axiosClient.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.warn("Using mock events since API failed");

      setEvents([
        { id: 1, name: "Sunset Beach Party", date: "2025-09-15", description: "Evening fun at the beach" },
        { id: 2, name: "Yoga Retreat", date: "2025-09-20", description: "Relaxing yoga session by the sea" },
      ]);
    }
  };

  const addEvent = (event: Event) => {
    setEvents((prev) => [...prev, event]);
  };

  const deleteEvent = (id: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <EventContext.Provider value={{ events, fetchEvents, addEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error("useEvents must be used within EventProvider");
  return context;
};
