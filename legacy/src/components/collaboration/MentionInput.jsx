import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@/api/entities';
import { AtSign } from 'lucide-react';

export default function MentionInput({ 
    value, 
    onChange, 
    onMentionsChange, 
    placeholder, 
    className 
}) {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [mentionStart, setMentionStart] = useState(-1);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const textareaRef = useRef(null);
    const suggestionsRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!showSuggestions) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(prev => Math.max(prev - 1, 0));
                    break;
                case 'Enter':
                case 'Tab':
                    e.preventDefault();
                    if (suggestions[selectedIndex]) {
                        insertMention(suggestions[selectedIndex]);
                    }
                    break;
                case 'Escape':
                    setShowSuggestions(false);
                    break;
            }
        };

        const textarea = textareaRef.current;
        if (textarea) {
            textarea.addEventListener('keydown', handleKeyDown);
            return () => textarea.removeEventListener('keydown', handleKeyDown);
        }
    }, [showSuggestions, suggestions, selectedIndex]);

    const searchUsers = async (query) => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            // In a real app, this would be a more efficient search endpoint
            const users = await User.list('full_name', 10);
            const filtered = users.filter(user => 
                user.full_name?.toLowerCase().includes(query.toLowerCase()) ||
                user.email?.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5);
            
            setSuggestions(filtered);
            setSelectedIndex(0);
        } catch (error) {
            console.error('Failed to search users:', error);
            setSuggestions([]);
        }
    };

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        const cursorPos = e.target.selectionStart;
        
        onChange(newValue);

        // Check for @ mention
        const beforeCursor = newValue.substring(0, cursorPos);
        const mentionMatch = beforeCursor.match(/@(\w*)$/);
        
        if (mentionMatch) {
            const query = mentionMatch[1];
            setMentionStart(cursorPos - mentionMatch[0].length);
            setShowSuggestions(true);
            searchUsers(query);
        } else {
            setShowSuggestions(false);
        }
    };

    const insertMention = (user) => {
        const beforeMention = value.substring(0, mentionStart);
        const afterCursor = value.substring(textareaRef.current.selectionStart);
        const mentionText = `@${user.full_name}`;
        const newValue = beforeMention + mentionText + ' ' + afterCursor;
        
        onChange(newValue);
        
        // Update mentions list
        const currentMentions = onMentionsChange ? [] : [];
        const newMention = {
            user_id: user.id,
            user_name: user.full_name,
            position: mentionStart
        };
        
        if (onMentionsChange) {
            onMentionsChange([...currentMentions, newMention]);
        }

        setShowSuggestions(false);
        
        // Focus back to textarea
        setTimeout(() => {
            const newCursorPos = mentionStart + mentionText.length + 1;
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    return (
        <div className="relative">
            <Textarea
                ref={textareaRef}
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                className={className}
            />
            
            {showSuggestions && suggestions.length > 0 && (
                <div 
                    ref={suggestionsRef}
                    className="absolute z-50 w-full mt-1 bg-brand-card-bg border border-brand-border rounded-md shadow-lg max-h-48 overflow-y-auto"
                >
                    {suggestions.map((user, index) => (
                        <div
                            key={user.id}
                            className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${
                                index === selectedIndex ? 'bg-brand-border' : 'hover:bg-brand-border/50'
                            }`}
                            onClick={() => insertMention(user)}
                        >
                            <AtSign className="w-4 h-4 text-brand-text-secondary" />
                            <div>
                                <div className="font-medium text-brand-text-primary">
                                    {user.full_name}
                                </div>
                                <div className="text-xs text-brand-text-secondary">
                                    {user.email}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}