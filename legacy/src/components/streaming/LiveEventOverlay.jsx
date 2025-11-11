import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StreamingEvent } from '@/api/entities'; // Assuming you have a way to get current event

const MessageOverlay = ({ message }) => {
    if (!message || !message.text) return null;

    const messageStyles = {
        info: "bg-blue-600/80 border-blue-400",
        sponsor: "bg-amber-500/80 border-amber-300",
        alert: "bg-red-600/80 border-red-400",
    };

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className={`absolute bottom-20 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-xl text-white text-lg font-semibold border-2 ${messageStyles[message.type] || messageStyles.info} backdrop-blur-md`}
        >
            {message.text}
        </motion.div>
    );
};

export default function LiveEventOverlay({ eventId }) {
    const [liveMessage, setLiveMessage] = useState(null);
    
    useEffect(() => {
        if (!eventId) return;

        const fetchLiveEventData = async () => {
            try {
                const event = await StreamingEvent.get(eventId);
                if (event?.live_message && new Date(event.live_message.active_until) > new Date()) {
                    setLiveMessage(event.live_message);
                } else {
                    setLiveMessage(null);
                }
            } catch (error) {
                console.error("Failed to fetch live event data:", error);
                setLiveMessage(null);
            }
        };

        fetchLiveEventData(); // Initial fetch
        const interval = setInterval(fetchLiveEventData, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, [eventId]);

    return (
        <div className="absolute inset-0 pointer-events-none">
            <AnimatePresence>
                {liveMessage && <MessageOverlay message={liveMessage} />}
            </AnimatePresence>
            {/* Other overlay components like polls or trivia would go here */}
        </div>
    );
}