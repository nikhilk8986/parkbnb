import React from 'react';
import Navbar from '@/components/Navbar';
import Map from '@/components/Map';
import { MapProvider } from '@/contexts/MapContext';

const page = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <MapProvider>
        <div className="flex justify-center items-center p-8">
          <div className="w-full max-w-2xl">
            <div className="h-96 rounded-xl overflow-hidden shadow-lg border border-slate-800">
              <Map latitude={25.609000} longitude={85.134300} />
            </div>
          </div>
        </div>
      </MapProvider>
    </div>
  );
};

export default page;