import React, { useState, useEffect, useRef } from 'react';
import { Comment } from '@/api/entities';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Reply, Edit2, Send, AtSign, Paperclip } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useXP } from '../XPContext';
import { NotificationService } from '../utils/NotificationService';
import MentionInput from './MentionInput';

function CommentItem({ comment, onReply, level = 0 }) {
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useXP();
    
    const canEdit = user && user.id === comment.author_id;
    const marginLeft = Math.min(level * 20, 60); // Max indent of 3 levels

    const handleReplySubmit = async (content, mentions) => {
        await onReply(comment.id, content, mentions);
        setIsReplying(false);
    };

    return (
        <div className="space-y-3" style={{ marginLeft: `${marginLeft}px` }}>
            <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://avatar.vercel.sh/${comment.author_name}.png`} />
                            <AvatarFallback>{comment.author_name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-brand-text-primary">{comment.author_name}</span>
                                <span className="text-xs text-brand-text-secondary">
                                    {formatDistanceToNow(new Date(comment.created_date), { addSuffix: true })}
                                </span>
                                {comment.is_internal && (
                                    <Badge variant="outline" className="text-xs">Internal</Badge>
                                )}
                                {comment.is_edited && (
                                    <span className="text-xs text-brand-text-secondary">(edited)</span>
                                )}
                            </div>
                            <div className="text-brand-text-primary whitespace-pre-wrap">
                                {comment.content}
                            </div>
                            {comment.attachments && comment.attachments.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    {comment.attachments.map((attachment, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-brand-text-secondary">
                                            <Paperclip className="w-4 h-4" />
                                            <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                {attachment.filename}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center gap-2 mt-3">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => setIsReplying(!isReplying)}
                                    className="text-xs"
                                >
                                    <Reply className="w-3 h-3 mr-1" />
                                    Reply
                                </Button>
                                {canEdit && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="text-xs"
                                    >
                                        <Edit2 className="w-3 h-3 mr-1" />
                                        Edit
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            {isReplying && (
                <div className="ml-4">
                    <CommentInput 
                        onSubmit={handleReplySubmit}
                        onCancel={() => setIsReplying(false)}
                        placeholder={`Reply to ${comment.author_name}...`}
                        compact
                    />
                </div>
            )}
        </div>
    );
}

function CommentInput({ onSubmit, onCancel, placeholder = "Add a comment...", compact = false }) {
    const [content, setContent] = useState('');
    const [mentions, setMentions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) return;
        
        setIsSubmitting(true);
        try {
            await onSubmit(content, mentions);
            setContent('');
            setMentions([]);
        } catch (error) {
            console.error('Failed to submit comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className={`${compact ? 'p-3' : 'p-4'}`}>
                <MentionInput 
                    value={content}
                    onChange={setContent}
                    onMentionsChange={setMentions}
                    placeholder={placeholder}
                    className={compact ? 'min-h-[60px]' : 'min-h-[80px]'}
                />
                <div className="flex justify-end gap-2 mt-3">
                    {onCancel && (
                        <Button variant="outline" size="sm" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                    <Button 
                        size="sm" 
                        onClick={handleSubmit} 
                        disabled={!content.trim() || isSubmitting}
                    >
                        <Send className="w-4 h-4 mr-1" />
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function CommentSystem({ entityType, entityId, title }) {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useXP();

    useEffect(() => {
        loadComments();
    }, [entityType, entityId]);

    const loadComments = async () => {
        setIsLoading(true);
        try {
            const data = await Comment.filter({ 
                entity_type: entityType, 
                entity_id: entityId 
            }, 'created_date');
            setComments(buildCommentTree(data));
        } catch (error) {
            console.error('Failed to load comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const buildCommentTree = (flatComments) => {
        const commentMap = {};
        const rootComments = [];

        // First pass: create map
        flatComments.forEach(comment => {
            commentMap[comment.id] = { ...comment, replies: [] };
        });

        // Second pass: build tree
        flatComments.forEach(comment => {
            if (comment.parent_comment_id) {
                const parent = commentMap[comment.parent_comment_id];
                if (parent) {
                    parent.replies.push(commentMap[comment.id]);
                }
            } else {
                rootComments.push(commentMap[comment.id]);
            }
        });

        return rootComments;
    };

    const createComment = async (content, mentions, parentId = null) => {
        if (!user) return;

        try {
            const newComment = await Comment.create({
                content,
                author_id: user.id,
                author_name: user.full_name || user.email,
                entity_type: entityType,
                entity_id: entityId,
                parent_comment_id: parentId,
                mentions,
                is_internal: false
            });

            // Send notifications for mentions
            if (mentions && mentions.length > 0) {
                for (const mention of mentions) {
                    await NotificationService.create({
                        user_id: mention.user_id,
                        title: 'You were mentioned in a comment',
                        message: `${user.full_name || user.email} mentioned you in a comment on ${title || entityType}`,
                        notification_type: 'mention',
                        link_to: window.location.pathname,
                        icon: 'AtSign'
                    });
                }
            }

            loadComments();
        } catch (error) {
            console.error('Failed to create comment:', error);
        }
    };

    const renderComments = (commentList, level = 0) => {
        return commentList.map(comment => (
            <div key={comment.id} className="space-y-3">
                <CommentItem 
                    comment={comment} 
                    onReply={(parentId, content, mentions) => createComment(content, mentions, parentId)}
                    level={level}
                />
                {comment.replies && comment.replies.length > 0 && (
                    <div className="space-y-3">
                        {renderComments(comment.replies, level + 1)}
                    </div>
                )}
            </div>
        ));
    };

    if (isLoading) {
        return <div className="text-center py-4">Loading comments...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-text-secondary" />
                <h3 className="font-semibold text-brand-text-primary">
                    Comments ({comments.length})
                </h3>
            </div>

            <CommentInput 
                onSubmit={(content, mentions) => createComment(content, mentions)}
            />

            <div className="space-y-4">
                {comments.length === 0 ? (
                    <div className="text-center py-8 text-brand-text-secondary">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No comments yet. Be the first to add one!</p>
                    </div>
                ) : (
                    renderComments(comments)
                )}
            </div>
        </div>
    );
}