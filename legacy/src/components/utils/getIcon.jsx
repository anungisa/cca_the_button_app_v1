import { 
  AlertTriangle, 
  CheckCircle, 
  User, 
  FileText, 
  MessageSquare, 
  Bell,
  Calendar,
  Target
} from 'lucide-react';

export function getIcon(iconType) {
  const iconMap = {
    'task_assigned': Target,
    'approval_request': FileText,
    'compliance_due': AlertTriangle,
    'mention': MessageSquare,
    'case_assigned': User,
    'general_announcement': Bell,
    'calendar_event': Calendar,
    'success': CheckCircle,
    'default': Bell
  };

  return iconMap[iconType] || iconMap.default;
}