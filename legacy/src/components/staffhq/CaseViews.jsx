import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, MapPin, MessageSquare, MoreHorizontal } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
  urgent: 'bg-purple-500'
};

const caseTypeConfig = {
  pledge_follow_up: { label: 'Pledge Follow-up', icon: '🤝' },
  club_support: { label: 'Club Support', icon: '🏒' },
  survey_issue: { label: 'Survey Issue', icon: '📊' },
  sponsor_outreach: { label: 'Sponsor Outreach', icon: '💼' },
  technical_issue: { label: 'Technical Issue', icon: '🔧' },
  general_inquiry: { label: 'General Inquiry', icon: '❓' }
};

// Kanban View Component
export const KanbanView = ({ cases, onDragEnd, onCardClick }) => {
  const columns = {
    new: cases.filter(c => c.status === 'new'),
    in_progress: cases.filter(c => c.status === 'in_progress'),
    on_hold: cases.filter(c => c.status === 'on_hold'),
    resolved: cases.filter(c => c.status === 'resolved')
  };

  const CaseCard = ({ caseItem, index }) => (
    <Draggable draggableId={caseItem.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-brand-charcoal p-3 rounded-lg mb-3 shadow-md hover:bg-brand-border/50 cursor-pointer"
          onClick={() => onCardClick(caseItem)}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-sm">{caseTypeConfig[caseItem.case_type]?.icon}</span>
              <h4 className="text-sm font-medium text-brand-text-primary truncate">{caseItem.case_title}</h4>
            </div>
            <Badge className={`${priorityColors[caseItem.priority]} text-white text-xs ml-2 flex-shrink-0`}>
              {caseItem.priority}
            </Badge>
          </div>
          <p className="text-xs text-brand-text-secondary mb-2 truncate">
            {caseItem.club_name || caseItem.ma_region}
          </p>
          <div className="flex justify-between items-center text-xs">
            <span className="text-brand-text-secondary truncate flex-1 min-w-0 mr-2">
              {caseItem.assigned_staff_name || 'Unassigned'}
            </span>
            <span className="text-brand-text-secondary flex-shrink-0">
              {caseItem.case_id || caseItem.id.slice(-6)}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );

  const CaseColumn = ({ title, cases, droppableId }) => (
    <div className="bg-brand-card-bg rounded-lg p-4 min-h-[600px] flex-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-brand-text-primary">{title}</h3>
        <Badge variant="secondary" className="text-xs">
          {cases.length}
        </Badge>
      </div>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {cases.map((caseItem, index) => (
              <CaseCard key={caseItem.id} caseItem={caseItem} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col md:flex-row gap-4 overflow-x-auto">
        <CaseColumn title="New" cases={columns.new} droppableId="new" />
        <CaseColumn title="In Progress" cases={columns.in_progress} droppableId="in_progress" />
        <CaseColumn title="On Hold" cases={columns.on_hold} droppableId="on_hold" />
        <CaseColumn title="Resolved" cases={columns.resolved} droppableId="resolved" />
      </div>
    </DragDropContext>
  );
};

// List View Component
export const ListView = ({ cases, onCardClick }) => (
  <div className="space-y-3">
    {cases.map((caseItem) => (
      <Card 
        key={caseItem.id} 
        className="bg-brand-card-bg border-brand-border hover:shadow-md cursor-pointer transition-all"
        onClick={() => onCardClick(caseItem)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-sm">{caseTypeConfig[caseItem.case_type]?.icon}</span>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-brand-text-primary truncate">
                  {caseItem.case_title}
                </h4>
                <p className="text-xs text-brand-text-secondary truncate">
                  {caseItem.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <div className="text-right">
                <div className="text-xs text-brand-text-secondary">
                  {caseItem.ma_region}
                </div>
                <div className="text-xs text-brand-text-secondary">
                  {caseItem.assigned_staff_name || 'Unassigned'}
                </div>
              </div>
              
              <Badge className={`${priorityColors[caseItem.priority]} text-white text-xs`}>
                {caseItem.priority}
              </Badge>
              
              <Badge variant="outline" className="text-xs capitalize">
                {caseItem.status.replace('_', ' ')}
              </Badge>
              
              <div className="text-xs text-brand-text-secondary">
                {caseItem.case_id || caseItem.id.slice(-6)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Grid View Component
export const GridView = ({ cases, onCardClick }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {cases.map((caseItem) => (
      <Card 
        key={caseItem.id} 
        className="bg-brand-card-bg border-brand-border hover:shadow-lg cursor-pointer transition-all"
        onClick={() => onCardClick(caseItem)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-sm">{caseTypeConfig[caseItem.case_type]?.icon}</span>
              <Badge className={`${priorityColors[caseItem.priority]} text-white text-xs`}>
                {caseItem.priority}
              </Badge>
            </div>
            <Badge variant="outline" className="text-xs capitalize ml-2 flex-shrink-0">
              {caseItem.status.replace('_', ' ')}
            </Badge>
          </div>
          
          <h4 className="text-sm font-medium text-brand-text-primary mb-2 line-clamp-2 min-h-[2.5rem]">
            {caseItem.case_title}
          </h4>
          
          <p className="text-xs text-brand-text-secondary mb-3 line-clamp-2 min-h-[2rem]">
            {caseItem.description}
          </p>
          
          <div className="space-y-1 text-xs text-brand-text-secondary">
            <div className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{caseItem.ma_region}</span>
            </div>
            <div className="flex items-center gap-1 truncate">
              <User className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{caseItem.assigned_staff_name || 'Unassigned'}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{new Date(caseItem.created_date).toLocaleDateString()}</span>
              </div>
              <span>{caseItem.case_id || caseItem.id.slice(-6)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Main CaseViews component that wraps the different view types
export const CaseViews = ({ prefilter }) => {
  // This is a placeholder component that can be used to manage different case views
  // For now, it just returns the ListView by default
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-brand-text-primary">My Cases</h3>
      <ListView cases={[]} onCardClick={() => {}} />
    </div>
  );
};

// Default export for backwards compatibility
export default CaseViews;