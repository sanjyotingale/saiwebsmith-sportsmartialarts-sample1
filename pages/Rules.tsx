
import React from 'react';

export const Rules: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-[#1A1A1A] min-h-screen px-6">
      <div className="max-container mx-auto max-w-3xl">
        <h1 className="text-[#FFD700] text-4xl font-black uppercase tracking-tighter mb-4">Rules & Regulations</h1>
        <div className="w-24 h-1 bg-[#B33F00] mb-12"></div>
        
        <div className="space-y-8 text-gray-300 text-sm leading-relaxed uppercase tracking-widest">
          <section>
            <h2 className="text-white font-bold mb-4">1. Discipline</h2>
            <p>Students must maintain high standards of discipline both inside and outside the academy. Respect for masters and fellow students is mandatory.</p>
          </section>
          
          <section>
            <h2 className="text-white font-bold mb-4">2. Attendance</h2>
            <p>Punctuality is a sign of respect. Students should arrive at least 10 minutes before the scheduled class time.</p>
          </section>
          
          <section>
            <h2 className="text-white font-bold mb-4">3. Fees & Refund</h2>
            <p>Admission fees are non-refundable. Monthly fees must be cleared by the 5th of every month.</p>
          </section>
          
          <section>
            <h2 className="text-white font-bold mb-4">4. Health & Safety</h2>
            <p>Martial arts involve physical risk. The academy is not responsible for any accidental injuries. Students must have their own medical insurance.</p>
          </section>
          
          <section>
            <h2 className="text-white font-bold mb-4">5. Uniform</h2>
            <p>Prescribed academy uniform must be worn at all times during training sessions.</p>
          </section>
        </div>
      </div>
    </div>
  );
};
