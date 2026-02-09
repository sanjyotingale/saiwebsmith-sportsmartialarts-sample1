import React, { useEffect, useState } from 'react';
import { fetchBranches } from '../services/dataService';
import { Branch } from '../types';
import { ACADEMY_PHONE, ACADEMY_ADDRESS } from '../constants';

export const Contact: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const loadBranches = async () => {
      const data = await fetchBranches();
      const updated = data.map(b => ({
        ...b,
        name: "Main Academy Center",
        address: ACADEMY_ADDRESS,
        contactNumber: ACADEMY_PHONE
      }));
      setBranches(updated);
    };
    loadBranches();
  }, []);

  return (
    <div className="pt-32 pb-24 bg-transparent">
      <div className="max-container mx-auto px-6">
        <div className="mb-20">
          <h1 className="text-[#FFD700] text-5xl font-black uppercase tracking-tighter mb-4 text-center">Contact Us</h1>
          <div className="w-24 h-1 bg-[#B33F00] mx-auto mb-8"></div>
          <p className="text-center text-gray-400 tracking-widest text-xs uppercase font-bold">Visit us at our Pune location</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {branches.map(branch => (
            <div key={branch.id} className="glass overflow-hidden group hover:border-[#FFD700]/30 transition-all duration-500 md:col-span-2">
              <div className="aspect-[21/9] overflow-hidden">
                 <img src={branch.image} alt={branch.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[2000ms]" />
              </div>
              <div className="p-10">
                <h3 className="text-white text-2xl font-bold uppercase tracking-widest mb-4 group-hover:text-[#FFD700] transition-colors">{branch.name}</h3>
                <div className="space-y-4 mb-8">
                  <p className="text-gray-400 text-[11px] uppercase tracking-widest font-bold leading-relaxed flex gap-3">
                    <span className="text-[#FFD700] shrink-0">ADDRESS:</span>
                    {branch.address}
                  </p>
                  <p className="text-gray-400 text-[11px] uppercase tracking-widest font-bold flex gap-3">
                    <span className="text-[#FFD700] shrink-0">CONTACT:</span>
                    {branch.contactNumber}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href={`tel:${branch.contactNumber.replace(/\s+/g, '')}`}
                    className="inline-block bg-[#B33F00] text-white px-10 py-4 font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all shadow-xl"
                  >
                    Call Academy
                  </a>
                  <a 
                    href="https://maps.google.com/?q=Shiv+Foundation+Sports+Martial+Arts+Academy+Narhe" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-[#FFD700] text-black px-10 py-4 font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-xl"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};