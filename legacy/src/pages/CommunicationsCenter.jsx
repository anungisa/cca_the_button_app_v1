import React, { useState, useEffect } from 'react';
import { UserMessage } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Send, Mail, Users, Star, Archive } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const mockMessages = [
  { id: 1, sender_id: 'coach_dave', sender_name: 'Coach Dave', subject: 'Practice tomorrow', content: 'Hey team, just a reminder that practice is at 7pm tomorrow. We will be working on takeout weight.', created_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), is_read: false },
  { id: 2, sender_id: 'jenna_p', sender_name: 'Jenna P.', subject: 'Re: Spares list', content: 'I can spare for your team on Tuesday night if you still need someone!', created_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), is_read: true },
  { id: 3, sender_id: 'club_admin', sender_name: 'Calgary Curling Club', subject: 'Club Championship Registration', content: 'Registration for the Club Championship is now open. Please register your team by Friday.', created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), is_read: true },
];

const ConversationList = ({ conversations, onSelect, selectedConversationId }) => (
  <div className="space-y-2">
    {conversations.map(convo => (
      <button 
        key={convo.id}
        onClick={() => onSelect(convo)}
        className={`w-full text-left p-3 rounded-lg transition-colors ${selectedConversationId === convo.id ? 'bg-brand-red/10' : 'hover:bg-brand-border'}`}
      >
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{convo.sender_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-sm text-brand-text-primary truncate">{convo.sender_name}</p>
              <p className="text-xs text-brand-text-secondary flex-shrink-0">{formatDistanceToNow(new Date(convo.created_date), { addSuffix: true })}</p>
            </div>
            <p className="font-medium text-sm text-brand-text-secondary truncate">{convo.subject}</p>
            {!convo.is_read && <div className="w-2 h-2 bg-brand-red rounded-full absolute top-3 left-1"></div>}
          </div>
        </div>
      </button>
    ))}
  </div>
);

const MessageView = ({ message }) => {
  if (!message) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-brand-text-secondary">
        <Mail className="w-16 h-16 mb-4" />
        <p>Select a conversation to read</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-brand-border">
        <h2 className="text-lg font-bold text-brand-text-primary">{message.subject}</h2>
        <p className="text-sm text-brand-text-secondary">From: {message.sender_name}</p>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        <p className="text-brand-text-primary whitespace-pre-wrap">{message.content}</p>
      </div>
      <CardFooter className="p-4 border-t border-brand-border">
        <div className="w-full space-y-2">
          <Textarea placeholder="Reply..." />
          <Button className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Send Reply
          </Button>
        </div>
      </CardFooter>
    </div>
  );
};

export default function CommunicationsCenter() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    // In a real app, fetch messages for the user
    setMessages(mockMessages);
  }, []);

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    const updatedMessages = messages.map(m => m.id === message.id ? { ...m, is_read: true } : m);
    setMessages(updatedMessages);
  };

  return (
    <div className="p-4 md:p-8 h-[calc(100vh-120px)]">
      <div className="flex items-center gap-4 mb-8">
        <Mail className="w-8 h-8 text-brand-red" />
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">Communications Center</h1>
          <p className="text-brand-text-secondary">Your central hub for all messages and announcements.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full">
        <Card className="lg:col-span-1 xl:col-span-1 bg-brand-card-bg border-brand-border h-full flex flex-col">
          <CardHeader>
            <div className="relative">
              <Input placeholder="Search messages..." className="pl-8" />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <ConversationList conversations={messages} onSelect={handleSelectMessage} selectedConversationId={selectedMessage?.id} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 xl:col-span-3 bg-brand-card-bg border-brand-border h-full flex flex-col">
          <MessageView message={selectedMessage} />
        </Card>
      </div>
    </div>
  );
}