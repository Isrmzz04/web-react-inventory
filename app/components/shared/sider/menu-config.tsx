import React from 'react';
import {
  IconLayout2,
  IconFolderOpen,
  IconDirectionHorizontal,
} from '@tabler/icons-react';
import type { IconName } from '~/types/global.types';

export const iconMap: Record<IconName, React.ComponentType> = {
  IconLayout2,
  IconFolderOpen,
  IconDirectionHorizontal,
};

export const getIconComponent = (iconName: string, className?: string): React.ReactElement | null => {
  const IconComponent = iconMap[iconName as IconName];
  
  if (!IconComponent) return null;
  
  return (
    <div className={className || 'w-5 h-5'}>
      <IconComponent  />
    </div>
  );
};

