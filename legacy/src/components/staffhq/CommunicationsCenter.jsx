import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Inbox, Send, Edit, Archive, Trash2, Star, Search, Plus, User, Users, MoreVertical
} from 'lucide-react';
import { useXP } from '../XPContext';
import { UserMessage } from '@/api/entities';
import { User as UserEntity } from '@/api/entities';

const ComposeModal = ({ isOpen, onClose, onSendSuccess, currentUser }) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!recipientEmail || !subject || !content) return;
    setIsSending(true);
    try {
      // Find recipient user by email
      const recipients = await UserEntity.filter({ email: recipientEmail });
      if (recipients.length === 0) {
        alert("Recipient not found.");
        setIsSending(false);
        return;
      }
      
      await UserMessage.create({
        sender_id: currentUser.id,
        receiver_id: recipients[0].id,
        subject,
        content
      });

      onSendSuccess();
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
      setRecipientEmail('');
      setSubject('');
      setContent('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>New Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            placeholder="Recipient's Email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
          <Input 
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Textarea 
            placeholder="Compose your message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isSending}>Cancel</Button>
            <Button onClick={handleSend} disabled={isSending || !recipientEmail || !subject || !content}>
              {isSending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MessageItem = ({ message, onSelect, isSelected }) => (
  <div
    className={`p-3 cursor-pointer rounded-lg border-l-4 ${
      isSelected ? 'bg-brand-red/10 border-brand-red' : 'border-transparent hover:bg-brand-charcoal/50'
    }`}
    onClick={() => onSelect(message)}
  >
    <div className="flex items-center justify-between mb-1">
      <span className="font-semibold text-sm text-brand-text-primary truncate">{message.sender_name || 'System'}</span>
      <span className="text-xs text-brand-text-secondary">{new Date(message.created_date).toLocaleDateString()}</span>
    </div>
    <p className="text-sm text-brand-text-primary truncate font-medium">{message.subject}</p>
    <p className="text-xs text-brand-text-secondary truncate">{message.content}</p>
    {!message.is_read && <div className="w-2 h-2 bg-brand-red rounded-full mt-2"></div>}
  </div>
);

export default function CommunicationsCenter() {
  const { user } = useXP();
  const [messages, setMessages] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const loadMessages = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      let query;
      if (selectedFolder === 'inbox') {
        query = { receiver_id: user.id };
      } else {
        query = { sender_id: user.id };
      }
      
      const messageData = await UserMessage.filter(query, '-created_date', 100);
      
      // We need sender names, fetch them if not present
      const senderIds = [...new Set(messageData.map(m => m.sender_id))];
      const senders = await UserEntity.filter({ id: { $in: senderIds } });
      const senderMap = new Map(senders.map(s => [s.id, s.full_name]));

      const populatedMessages = messageData.map(m => ({
        ...m,
        sender_name: senderMap.get(m.sender_id) || 'Unknown User'
      }));

      setMessages(populatedMessages);
      setSelectedMessage(populatedMessages[0] || null);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedFolder]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSelectMessage = async (message) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      try {
        await UserMessage.update(message.id, { is_read: true });
        loadMessages(); // Refresh list to update read status
      } catch (error) {
        console.error("Failed to mark message as read:", error);
      }
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading communications...</div>;
  }
  
  if (!user) {
    return <div className="text-center p-8">Please log in to view messages.</div>;
  }

  return (
    <Card className="h-[75vh] flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4 lg:w-1/5 bg-brand-card-bg/50 border-r border-brand-border p-4">
        <Button className="w-full mb-6" onClick={() => setIsComposeOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Compose
        </Button>
        <div className="space-y-2">
          <Button
            variant={selectedFolder === 'inbox' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setSelectedFolder('inbox')}
          >
            <Inbox className="w-4 h-4 mr-2" /> Inbox
          </Button>
          <Button
            variant={selectedFolder === 'sent' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setSelectedFolder('sent')}
          >
            <Send className="w-4 h-4 mr-2" /> Sent
          </Button>
        </div>
      </div>

      {/* Message List */}
      <div className="w-1/3 lg:w-2/5 border-r border-brand-border overflow-y-auto">
        <div className="p-4 border-b border-brand-border">
          <Input placeholder="Search messages..." />
        </div>
        <div className="p-2 space-y-1">
          {messages.map(msg => (
            <MessageItem
              key={msg.id}
              message={msg}
              onSelect={handleSelectMessage}
              isSelected={selectedMessage?.id === msg.id}
            />
          ))}
        </div>
      </div>

      {/* Message View */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedMessage ? (
          <div>
            <div className="border-b border-brand-border pb-4 mb-4">
              <h2 className="text-xl font-bold text-brand-text-primary mb-2">{selectedMessage.subject}</h2>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{(selectedMessage.sender_name || 'U').charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-brand-text-primary">{selectedMessage.sender_name}</p>
                  <p className="text-sm text-brand-text-secondary">To: You</p>
                </div>
              </div>
            </div>
            <div className="prose prose-invert max-w-none text-brand-text-primary">
              <p>{selectedMessage.content}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-brand-text-secondary">
            <p>Select a message to read</p>
          </div>
        )}
      </div>

      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSendSuccess={loadMessages}
        currentUser={user}
      />
    </Card>
  );
}