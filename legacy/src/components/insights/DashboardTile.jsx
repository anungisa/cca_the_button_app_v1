import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Lock } from 'lucide-react';
import { useEmbedPermissions } from '../hooks/useEmbedPermissions';

export default function DashboardTile({ 
  title, 
  description, 
  url, 
  icon: Icon, 
  requiredRole,
  dashboardKey,
  onClick 
}) {
  const { hasAccess } = useEmbedPermissions();
  const canAccess = hasAccess(dashboardKey);

  return (
    <Card className={`bg-brand-card-bg border-brand-border hover:shadow-lg transition-all duration-200 ${canAccess ? 'cursor-pointer' : 'opacity-60'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 bg-brand-red/10 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-brand-red" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg text-brand-text-primary">{title}</CardTitle>
              {requiredRole && (
                <Badge variant="outline" className="text-xs mt-1 border-brand-border text-brand-text-secondary">
                  {requiredRole}
                </Badge>
              )}
            </div>
          </div>
          {!canAccess && <Lock className="w-5 h-5 text-brand-text-secondary" />}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-brand-text-secondary text-sm mb-4 line-clamp-2">
          {description}
        </p>
        <Button
          onClick={canAccess ? onClick : undefined}
          disabled={!canAccess}
          className={`w-full ${canAccess ? 'bg-brand-red hover:bg-red-700' : 'bg-gray-500 cursor-not-allowed'}`}
        >
          {canAccess ? (
            <>
              View Dashboard <ChevronRight className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Access Restricted
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}