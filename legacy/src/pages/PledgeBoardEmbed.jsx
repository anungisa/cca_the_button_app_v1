import React from 'react';
import PledgeBoard from './PledgeBoard';

export default function PledgeBoardEmbed() {
  // Get URL parameters for customization
  const urlParams = new URLSearchParams(window.location.search);
  const campaignTag = urlParams.get('campaign') || 'TryCurling2025';
  const redirectUrl = urlParams.get('redirect');
  const customTitle = urlParams.get('title');
  const customSubtitle = urlParams.get('subtitle');

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {customTitle && (
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{customTitle}</h1>
            {customSubtitle && <p className="text-gray-600">{customSubtitle}</p>}
          </div>
        )}
        <PledgeBoard 
          isEmbedded={true}
          campaignTag={campaignTag}
          redirectUrl={redirectUrl}
        />
      </div>
    </div>
  );
}