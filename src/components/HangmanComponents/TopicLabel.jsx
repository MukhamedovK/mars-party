import React from 'react';

export const TopicLabel = ({ topic }) => {
  return (
    <div className="px-8 py-2 bg-gradient-to-r from-primary to-cyan-700 flex items-center gap-5 rounded-full text-center text-white shadow-md">
      <p className="text-xs uppercase tracking-wide">Topic:</p>
      <p className="text-lg font-bold uppercase">{topic}</p>
    </div>
  );
};