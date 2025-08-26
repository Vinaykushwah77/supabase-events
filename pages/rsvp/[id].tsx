/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Event = {
  id: string;
  title: string;
  description?: string;
  date: string;
  city?: string;
  created_by?: string;
};

export default function RSVPPage() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventNotFound, setEventNotFound] = useState(false);
  const [status, setStatus] = useState("Yes");
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpError, setRsvpError] = useState("");

  const existingUserId = "831b9c88-9a8a-495b-80dc-b8455e231fcb";

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchEvent = async () => {
      setLoading(true);

      const response = await supabase
        .from("events")
        .select("*")
        .eq("id", id.toString())
        .maybeSingle();

      const data = response.data as Event | null;
      const error = response.error;

      if (error || !data) {
        setEventNotFound(true);
      } else {
        setEvent(data);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [router.isReady, id]);

  const handleRSVP = async () => {
    if (!id) return;
    setRsvpError("");

    const { error } = await supabase.from("rsvps").insert({
      user_id: existingUserId,
      event_id: id,
      status,
    });

    if (error) {
      setRsvpError(error.message);
    } else {
      setRsvpSubmitted(true);
    }
  };

  if (loading)
    return (
      <div className="rsvp-container">
        <p>Loading event details...</p>
      </div>
    );

  if (eventNotFound)
    return (
      <div className="rsvp-container">
        <h2>Event Not Found</h2>
        <p>The event you&apos;re looking for does not exist.</p>
      </div>
    );

  return (
    <div className="rsvp-container">
      {event && (
        <>
          <h2 className="rsvp-title">{event.title}</h2>
          <p className="rsvp-description">{event.description}</p>

          {rsvpSubmitted ? (
            <p style={{ color: "green", fontWeight: "bold" }}>
               Your RSVP has been submitted!
            </p>
          ) : (
            <>
              <label htmlFor="status" className="rsvp-label">
                Choose your RSVP:
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rsvp-select"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Maybe">Maybe</option>
              </select>

              <button
                onClick={handleRSVP}
                className="rsvp-button"
                disabled={rsvpSubmitted}
              >
                Submit RSVP
              </button>
              {rsvpError && (
                <p style={{ color: "red", marginTop: "5px" }}>{rsvpError}</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
