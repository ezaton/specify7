import React from 'react';
import ContentLoader from 'react-content-loader';

import { userPreferences } from '../Preferences/userPreferences';

export function AttachmentPluginSkeleton(): JSX.Element {
  const [motionPref] = userPreferences.use('general', 'ui', 'reduceMotion');
  return (
    <div className="h-full w-full">
      <ContentLoader
        animate={motionPref !== 'reduce'}
        backgroundColor="#333"
        foregroundColor="#999"
        speed={3}
        viewBox="0 0 220 400"
      >
        <rect height="140" rx="2" ry="2" width="120" x="7" y="0" />
        <rect height="7" rx="2" ry="2" width="36" x="135" y="0" />
        <rect height="12" rx="2" ry="2" width="12" x="191" y="0" />
        <rect height="5" rx="2" ry="2" width="68" x="135" y="18" />
        <rect height="5" rx="2" ry="2" width="68" x="135" y="28" />
        <rect height="5" rx="2" ry="2" width="68" x="135" y="38" />
        <rect height="5" rx="2" ry="2" width="68" x="135" y="48" />
        <rect height="5" rx="2" ry="2" width="68" x="135" y="58" />
        <rect height="5" rx="2" ry="2" width="33" x="135" y="68" />
        <rect height="5" rx="2" ry="2" width="68" x="135" y="78" />
        <rect height="5" rx="2" ry="2" width="68" x="135" y="88" />
        <rect height="5" rx="2" ry="2" width="68" x="135" y="98" />
        <rect height="15" rx="2" ry="2" width="30" x="135" y="125" />
        <rect height="15" rx="2" ry="2" width="30" x="173" y="125" />
      </ContentLoader>
    </div>
  );
}
