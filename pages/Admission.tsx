import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AdmissionFormData } from '../types';
import { submitAdmissionForm } from '../services/dataService';
import { ACADEMY_NAME } from '../constants';

const STEPS = [
  { num: 0, label: "Info" },
  { num: 1, label: "Personal" },
  { num: 2, label: "Family" },
  { num: 3, label: "Health" },
  { num: 4, label: "Documents" },
  { num: 5, label: "Payment" }
];

const INITIAL_DATA: AdmissionFormData = {
  studentFullName: '', dob: '', gender: 'Male', bloodGroup: '', maritalStatus: 'Single', permanentAddress: '', pinCode: '', aadhaarNumber: '', photoFile: null, aadhaarFile: null,
  fatherFirstName: '', fatherContact: '', fatherEmail: '', motherFirstName: '', motherContact: '', motherEmail: '', 
  personalContact: '', personalEmail: '', spouseName: '', spouseContact: '', spouseEmail: '',
  guardianFullName: '', alternateContact: '',
  medicalConcerns: '', previousSportsExp: '', previousMartialArtsExp: '', nationalParticipation: '', meritDetails: '', medicalInsurance: '', additionalCertificates: null,
  declarationChecked: false, rulesChecked: false, utrNumber: ''
};

const Label = ({ text, required = false }: { text: string, required?: boolean }) => (
  <label className="text-[8px] sm:text-[9px] uppercase text-gray-500 font-black tracking-[0.2em] mb-2 block">
    {text} {required && <span className="text-[#B33F00]">*</span>}
  </label>
);

const StableInput = ({ label, required, value, onChange, placeholder, type = "text", error }: any) => (
  <div className="w-full">
    <Label text={label} required={required} />
    <input 
      type={type}
      required={required}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-[#1A1A1A] border ${error ? 'border-[#B33F00]' : 'border-white/10'} px-5 py-4 text-white outline-none focus:border-[#FFD700] text-sm rounded-sm transition-all placeholder:text-gray-600`}
    />
  </div>
);

const FileUploadField = ({ label, required, onChange, file }: { label: string, required?: boolean, onChange: (f: File | null) => void, file: File | null }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="w-full">
      <Label text={label} required={required} />
      <div 
        onClick={() => inputRef.current?.click()}
        className={`w-full bg-[#1A1A1A] border-2 border-dashed border-white/10 hover:border-[#FFD700]/50 px-5 py-8 text-center cursor-pointer rounded-sm transition-all group`}
      >
        <input 
          type="file" 
          ref={inputRef} 
          className="hidden" 
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          accept="image/*,.pdf"
        />
        <div className="flex flex-col items-center gap-2">
          <svg className="w-6 h-6 text-gray-600 group-hover:text-[#FFD700] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
          <p className="text-[10px] uppercase tracking-widest font-black text-gray-500 group-hover:text-white">
            {file ? file.name : `Tap to upload ${label}`}
          </p>
          {file && <p className="text-[8px] text-[#FFD700] font-bold">{(file.size / 1024).toFixed(1)} KB</p>}
        </div>
      </div>
    </div>
  );
};

const Checkbox = ({ label, checked, onChange }: { label: React.ReactNode, checked: boolean, onChange: (v: boolean) => void }) => (
  <div className="flex items-start gap-3 group cursor-pointer" onClick={() => onChange(!checked)}>
    <div className={`w-5 h-5 border flex items-center justify-center transition-all ${checked ? 'bg-[#FFD700] border-[#FFD700]' : 'bg-transparent border-white/20'}`}>
      {checked && (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      )}
    </div>
    <span className="text-[10px] sm:text-[11px] uppercase text-gray-400 font-bold tracking-widest leading-tight select-none">
      {label}
    </span>
  </div>
);

export const Admission: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<AdmissionFormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  const updateField = (field: keyof AdmissionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const next = () => {
    setStep(s => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const submit = async () => {
    if (!formData.rulesChecked || !formData.declarationChecked || !formData.utrNumber) return;
    setIsSubmitting(true);
    await submitAdmissionForm(formData);
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => navigate('/'), 3000);
  };

  const progressPercentage = (step / (STEPS.length - 1)) * 100;

  // Deep link for mobile UPI apps
  const upiLink = "upi://pay?pa=academy@upi&pn=AcademyName&am=500&cu=INR";

  return (
    <div className="pt-24 sm:pt-40 pb-24 bg-[#121212] min-h-screen px-4">
      {showSuccess && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 bg-black/98 backdrop-blur-3xl">
          <div className="text-center animate-scale-up">
            <div className="w-20 h-20 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(255,215,0,0.4)]">
              <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h2 className="text-[#FFD700] text-3xl font-black uppercase tracking-widest mb-4">Application Success</h2>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-black">Your journey starts now. Redirecting...</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-[#FFD700] text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-12">Registration</h1>
          
          {/* Visual Step Indicators */}
          <div className="grid grid-cols-6 gap-2 relative max-w-3xl mx-auto px-2 mb-8">
            <div className="absolute top-4 left-0 w-full h-[1px] bg-white/5 -z-10"></div>
            {STEPS.map(s => (
              <div key={s.num} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-700 mb-3 border ${step >= s.num ? 'bg-[#FFD700] text-black border-[#FFD700] scale-110 shadow-[0_0_20px_rgba(255,215,0,0.2)]' : 'bg-[#0a0a0a] text-gray-800 border-white/5'}`}>
                  {s.num + 1}
                </div>
                <span className={`hidden sm:block text-[8px] uppercase font-black tracking-widest text-center transition-colors ${step >= s.num ? 'text-white' : 'text-gray-900'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Dynamic Progress Bar */}
          <div className="max-w-xl mx-auto h-[2px] bg-white/5 rounded-full overflow-hidden mb-12">
            <div 
              className="h-full bg-gradient-to-r from-[#B33F00] to-[#FFD700] transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="glass p-6 sm:p-14 border border-white/5 shadow-2xl">
          {step === 0 && (
            <div className="space-y-10 animate-fade-in">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-1.5 h-12 bg-[#B33F00]"></div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-widest">Guidelines</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-400 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold leading-loose">
                <div className="space-y-6">
                  <h3 className="text-[#FFD700] text-xs">Required Information</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3"><span className="w-1 h-1 bg-white/20 mt-2 shrink-0"></span> Student Identity Details</li>
                    <li className="flex items-start gap-3"><span className="w-1 h-1 bg-white/20 mt-2 shrink-0"></span> Verified Contact Numbers</li>
                    <li className="flex items-start gap-3"><span className="w-1 h-1 bg-white/20 mt-2 shrink-0"></span> Residential Verification</li>
                  </ul>
                </div>
                <div className="space-y-6">
                  <h3 className="text-[#FFD700] text-xs">Digital Documents</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3"><span className="w-1 h-1 bg-white/20 mt-2 shrink-0"></span> Portrait Photo (JPG/PNG)</li>
                    <li className="flex items-start gap-3"><span className="w-1 h-1 bg-white/20 mt-2 shrink-0"></span> Aadhaar Front & Back</li>
                    <li className="flex items-start gap-3"><span className="w-1 h-1 bg-white/20 mt-2 shrink-0"></span> Medical Clearance</li>
                  </ul>
                </div>
              </div>

              <div className="glass p-10 border-l-4 border-[#B33F00] bg-white/[0.01]">
                <h3 className="text-[#FFD700] text-xs font-black mb-4 uppercase tracking-widest">Enrollment Fee</h3>
                <p className="text-gray-400 text-[10px] tracking-widest font-black leading-relaxed">
                  A non-refundable registration fee of ₹ 500.00 is required to process the application. Ensure digital copies of documents are clear for verification.
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-lg font-black text-white uppercase tracking-widest border-b border-white/5 pb-6">Student Information</h2>
              <StableInput label="Student Full Name" required value={formData.studentFullName} onChange={(v:any)=>updateField('studentFullName', v)} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <StableInput label="Birth Date" type="date" required value={formData.dob} onChange={(v:any)=>updateField('dob', v)} />
                <StableInput label="Gender" value={formData.gender} onChange={(v:any)=>updateField('gender', v)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <StableInput label="Blood Group" value={formData.bloodGroup} onChange={(v:any)=>updateField('bloodGroup', v)} />
                <StableInput label="Aadhaar Number" value={formData.aadhaarNumber} onChange={(v:any)=>updateField('aadhaarNumber', v)} />
              </div>
              <StableInput label="Permanent Address" value={formData.permanentAddress} onChange={(v:any)=>updateField('permanentAddress', v)} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-lg font-black text-white uppercase tracking-widest border-b border-white/5 pb-6">Guardianship</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <StableInput label="Father's Full Name" value={formData.fatherFirstName} onChange={(v:any)=>updateField('fatherFirstName', v)} />
                <StableInput label="Father's Contact" value={formData.fatherContact} onChange={(v:any)=>updateField('fatherContact', v)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <StableInput label="Mother's Full Name" value={formData.motherFirstName} onChange={(v:any)=>updateField('motherFirstName', v)} />
                <StableInput label="Mother's Contact" value={formData.motherContact} onChange={(v:any)=>updateField('motherContact', v)} />
              </div>
              <StableInput label="Guardian/Emergency Name" value={formData.guardianFullName} onChange={(v:any)=>updateField('guardianFullName', v)} />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-lg font-black text-white uppercase tracking-widest border-b border-white/5 pb-6">Athletic History</h2>
              <StableInput label="Martial Arts Experience" placeholder="e.g. 2 years of Judo" value={formData.previousMartialArtsExp} onChange={(v:any)=>updateField('previousMartialArtsExp', v)} />
              <StableInput label="Known Medical Conditions" placeholder="e.g. Asthma, Knee injury" value={formData.medicalConcerns} onChange={(v:any)=>updateField('medicalConcerns', v)} />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-10 animate-fade-in">
              <h2 className="text-lg font-black text-white uppercase tracking-widest border-b border-white/5 pb-6">File Repository</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <FileUploadField label="Student Photo" required file={formData.photoFile} onChange={(f) => updateField('photoFile', f)} />
                <FileUploadField label="Aadhaar Card" required file={formData.aadhaarFile} onChange={(f) => updateField('aadhaarFile', f)} />
              </div>
              <FileUploadField label="Additional Certificates" file={formData.additionalCertificates} onChange={(f) => updateField('additionalCertificates', f)} />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-10 animate-fade-in">
              <h2 className="text-lg font-black text-white uppercase tracking-widest border-b border-white/5 pb-6">Final Verification</h2>
              
              <div className="space-y-6 bg-white/[0.02] p-8 rounded-sm">
                <Checkbox 
                  label={<>Confirm acceptance of <Link to="/rules" target="pages/Rules.tsx" className="text-[#FFD700] hover:text-white transition-colors underline">Rules and Regulations</Link>.</>} 
                  checked={formData.rulesChecked} 
                  onChange={(v) => updateField('rulesChecked', v)} 
                />
                <Checkbox 
                  label="I verify that all submitted documentation is authentic." 
                  checked={formData.declarationChecked} 
                  onChange={(v) => updateField('declarationChecked', v)} 
                />
              </div>

              <div className="glass p-10 border border-[#B33F00]/20 flex flex-col items-center gap-10">
                <div className="text-center">
                  <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-2">Registration Fee Due</p>
                  <p className="text-white text-4xl font-black italic tracking-tighter">INR 500.00</p>
                </div>

                {!paymentInitiated ? (
                  <button 
                    onClick={() => setPaymentInitiated(true)} 
                    className="w-full sm:w-auto bg-[#B33F00] text-white px-16 py-5 font-black uppercase tracking-[0.3em] text-[11px] hover:bg-white hover:text-black transition-all shadow-[0_20px_50px_rgba(179,63,0,0.3)] tap-scale"
                  >
                    Initiate Payment
                  </button>
                ) : (
                  <div className="w-full space-y-10 animate-scale-up flex flex-col items-center">
                    
                    {/* Mobile Tap to Pay Button */}
                    <div className="w-full sm:w-auto mb-2">
                       <a 
                        href={upiLink}
                        className="flex items-center justify-center gap-3 bg-[#FFD700] text-black px-12 py-5 font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-all shadow-xl tap-scale w-full"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                        Tap to Pay (Mobile App)
                      </a>
                    </div>

                    <div className="text-center">
                      <p className="text-gray-700 text-[8px] font-black uppercase tracking-widest">— OR SCAN TO PAY —</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-10 bg-black/40 p-10 border border-white/5 rounded-sm w-full">
                       {/* UPI QR Simulation */}
                       <div className="w-48 h-48 bg-white p-4 rounded-sm flex items-center justify-center shadow-2xl relative group shrink-0">
                          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=academy@upi&pn=AcademyName&am=500&cu=INR" alt="Payment QR" className="w-full h-full" />
                          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       </div>
                       <div className="text-center sm:text-left space-y-4">
                          <h4 className="text-[#FFD700] text-sm font-black uppercase tracking-widest">Scan with UPI App</h4>
                          <p className="text-gray-500 text-[9px] uppercase font-bold leading-relaxed max-w-[200px]">
                            Open Google Pay, PhonePe, or Paytm and scan the QR code to complete the payment.
                          </p>
                       </div>
                    </div>
                    
                    <div className="max-w-sm mx-auto w-full">
                      <StableInput 
                        label="Transaction Ref / UTR Number" 
                        required 
                        placeholder="Enter 12-digit UTR" 
                        value={formData.utrNumber} 
                        onChange={(v:any) => updateField('utrNumber', v)} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-16 flex justify-between gap-6 border-t border-white/5 pt-10">
            {step > 0 && (
              <button onClick={prev} className="px-10 py-4 border border-white/10 text-white uppercase text-[10px] font-black hover:border-[#FFD700] transition-all tap-scale">Back</button>
            )}
            <div className="flex-grow" />
            {step < STEPS.length - 1 ? (
              <button onClick={next} className="px-12 py-4 bg-[#FFD700] text-black uppercase text-[10px] font-black hover:bg-white hover:scale-105 transition-all tap-scale shadow-[0_10px_30px_rgba(255,215,0,0.1)]">
                {step === 0 ? 'Start Form' : 'Next'}
              </button>
            ) : (
              <button 
                onClick={submit} 
                disabled={!formData.rulesChecked || !formData.declarationChecked || !formData.utrNumber || isSubmitting} 
                className="px-12 py-4 bg-[#B33F00] text-white uppercase text-[10px] font-black disabled:opacity-20 hover:scale-105 transition-all tap-scale shadow-[0_10px_30px_rgba(179,63,0,0.2)]"
              >
                {isSubmitting ? 'Verifying...' : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};