import React from 'react';
import QuickBooksIntegration from './QuickBooksIntegration';
import BudgytIntegration from './BudgytIntegration';

export default function AccountsReconciliationHub() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QuickBooksIntegration />
            <BudgytIntegration />
        </div>
    );
}