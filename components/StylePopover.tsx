import React from 'react';
import type { Substyle } from '../constants';
import { ImageWithFallback } from './ImageWithFallback';

export const StylePopover: React.FC<{ substyle: Substyle }> = ({ substyle }) => (
    <div className="flex items-start gap-3">
        <ImageWithFallback
            name={substyle.name}
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
        />
        <div className="min-w-0">
            <h5 className="font-semibold text-text-primary dark:text-dark-text-primary">{substyle.shortDescription || substyle.name}</h5>
            <p className="text-text-secondary dark:text-dark-text-secondary text-sm">{substyle.longDescription || substyle.description}</p>
        </div>
    </div>
);