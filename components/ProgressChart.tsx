'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProgressChart({ data }: { data: any[] }) {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{fontSize: 12}} />
          <YAxis tick={{fontSize: 12}} domain={[0, 100]} />
          <Tooltip cursor={{fill: '#f3f4f6'}} />
          <Bar dataKey="progress" fill="#1d4ed8" radius={[4, 4, 0, 0]} name="Progress (%)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}