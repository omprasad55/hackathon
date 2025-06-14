import React, { useState } from 'react';

const EligibilityForm = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    location: '',
    income: '',
    symptoms: ''
  });

  const [showResults, setShowResults] = useState(false);
  const [matchingSchemes, setMatchingSchemes] = useState([]);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate matching schemes
    const schemes = [
      {
        name: 'Arogya Yojana',
        benefits: 'Free medical checkups and discounted treatments',
        details: 'Applicable in government hospitals and select private clinics.',
        description: 'A health scheme for low-income families providing essential care.',
        eligibility: 'Income below ₹2,00,000/year, Age 18-60',
        documents: 'Aadhar card, Income certificate, Medical prescription'
      },
      {
        name: 'Swasthya Suraksha',
        benefits: 'Cashless hospitalization up to ₹5,00,000',
        details: 'Covers major surgeries and critical illness.',
        description: 'National-level scheme for serious health conditions.',
        eligibility: 'All citizens aged 21-65 with valid ID',
        documents: 'Aadhar, Voter ID, Recent medical reports'
      }
    ];

    // Simulate hospital/clinic data
    const allHospitals = [
      { name: 'City Hospital', location: 'Delhi', services: '24x7 Emergency, Cardiology, Surgery', contact: '011-22223333' },
      { name: 'Green Care Clinic', location: 'Mumbai', services: 'General Practice, Diagnostics', contact: '022-44332211' },
      { name: 'Lifeline Medical Center', location: 'Delhi', services: 'Orthopedics, Pediatrics, ICU', contact: '011-88887777' },
      { name: 'Healing Touch Hospital', location: 'Bangalore', services: 'Multi-specialty, OPD', contact: '080-12345678' },
      { name: 'Sunrise Hospital', location: 'Delhi', services: 'Maternity, ENT, Surgery', contact: '011-44556677' }
    ];

    const matchedHospitals = allHospitals.filter(h => h.location.toLowerCase() === formData.location.toLowerCase());

    setMatchingSchemes(schemes);
    setNearbyHospitals(matchedHospitals);
    setShowResults(true);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-150 to-purple-300'>

      {/* Form */}
      <form onSubmit={handleSubmit} className='bg-slate-900 p-8 m-10 rounded-lg shadow-lg w-150 text-sm mb-6'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Eligibilities</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter Your Eligibilities Below.</p>

        <div className='mb-4'>
          <label className='block text-white mb-1'>Age</label>
          <input type='number' name='age' value={formData.age} onChange={handleChange}
            className='w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none' required />
        </div>

        <div className='mb-4'>
          <label className='block text-white mb-1'>Gender</label>
          <select name='gender' value={formData.gender} onChange={handleChange}
            className='w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none' required>
            <option value='' disabled>Select gender</option>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
            <option value='other'>Other</option>
          </select>
        </div>

        <div className='mb-4'>
          <label className='block text-white mb-1'>Location</label>
          <input type='text' name='location' value={formData.location} onChange={handleChange}
            className='w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none' required />
        </div>

        <div className='mb-4'>
          <label className='block text-white mb-1'>Monthly Income (INR)</label>
          <input type='number' name='income' value={formData.income} onChange={handleChange}
            className='w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none' required />
        </div>

        <div className='mb-6'>
          <label className='block text-white mb-1'>Medical Needs or Symptoms</label>
          <textarea name='symptoms' value={formData.symptoms} onChange={handleChange}
            rows='3' className='w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none' required />
        </div>

        <button type='submit'
          className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer hover:opacity-90 transition'>
          Submit
        </button>
      </form>

      {/* Scheme Display */}
      {showResults && (
        <div className='w-full max-w-3xl space-y-6 mb-10'>

          {/* Matching Schemes */}
          <div>
            <h2 className='text-white text-xl font-semibold text-center mb-2'>Matching Schemes</h2>
            {matchingSchemes.map((scheme, index) => (
              <div key={index} className='bg-white rounded-xl p-6 shadow-md mb-4'>
                <h3 className='text-lg font-bold text-indigo-800'>{scheme.name}</h3>
                <p><span className='font-semibold'>Benefits:</span> {scheme.benefits}</p>
                <p><span className='font-semibold'>Details:</span> {scheme.details}</p>
                <p><span className='font-semibold'>Description:</span> {scheme.description}</p>
                <p><span className='font-semibold'>Eligibility:</span> {scheme.eligibility}</p>
                <p><span className='font-semibold'>Required Documents:</span> {scheme.documents}</p>
              </div>
            ))}
          </div>

          {/* Nearby Hospitals */}
          <div>
            <h2 className='text-white text-xl font-semibold text-center mb-2'>Nearby Medical Care</h2>
            {nearbyHospitals.length > 0 ? (
              nearbyHospitals.map((hospital, idx) => (
                <div key={idx} className='bg-gray-100 rounded-xl p-5 shadow-md mb-3'>
                  <h3 className='text-md font-bold text-blue-900'>{hospital.name}</h3>
                  <p><span className='font-semibold'>Services:</span> {hospital.services}</p>
                  <p><span className='font-semibold'>Contact:</span> {hospital.contact}</p>
                </div>
              ))
            ) : (
              <p className='text-center text-white'>No hospitals found near "{formData.location}".</p>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default EligibilityForm;
