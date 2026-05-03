import { useState } from 'react';
import { exampleCases } from '../data/cases';

export default function CaseForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    presenter: '',
    board_date: '',
    demographics: '',
    diagnosis: '',
    pathology: '',
    molecular: '',
    imaging: '',
    treatment_timeline: '',
    current_status_summary: '',
    clinical_question: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleLoadExample = (e) => {
    const caseKey = e.target.value;
    if (!caseKey) return;

    const selectedCase = exampleCases[caseKey];
    if (selectedCase) {
      const caseData = selectedCase.data;
      setFormData({
        presenter: caseData.presenter || '',
        board_date: caseData.board_date || '',
        demographics: caseData.demographics || '',
        diagnosis: caseData.diagnosis || '',
        pathology: caseData.pathology || '',
        molecular: caseData.molecular || '',
        imaging: caseData.imaging || '',
        treatment_timeline: caseData.treatment_timeline || '',
        current_status_summary: caseData.current_status_summary || '',
        clinical_question: caseData.clinical_question || ''
      });
      setErrors({});
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.presenter.trim()) newErrors.presenter = 'Presenter is required';
    if (formData.presenter.length > 80) newErrors.presenter = 'Presenter must be 80 characters or less';
    
    if (!formData.board_date.trim()) newErrors.board_date = 'Board date is required';
    
    if (!formData.demographics.trim()) newErrors.demographics = 'Demographics is required';
    if (!formData.diagnosis.trim()) newErrors.diagnosis = 'Diagnosis is required';
    if (!formData.pathology.trim()) newErrors.pathology = 'Pathology report is required';
    if (formData.pathology.length > 3000) newErrors.pathology = 'Pathology report must be 3000 characters or less';
    
    if (formData.molecular.length > 3000) newErrors.molecular = 'Molecular report must be 3000 characters or less';
    
    if (!formData.imaging.trim()) newErrors.imaging = 'Imaging report is required';
    if (formData.imaging.length > 3000) newErrors.imaging = 'Imaging report must be 3000 characters or less';
    
    if (!formData.treatment_timeline.trim()) newErrors.treatment_timeline = 'Treatment timeline is required';
    if (formData.treatment_timeline.length > 3000) newErrors.treatment_timeline = 'Treatment timeline must be 3000 characters or less';
    
    if (!formData.current_status_summary.trim()) newErrors.current_status_summary = 'Current status is required';
    if (formData.current_status_summary.length > 2000) newErrors.current_status_summary = 'Current status must be 2000 characters or less';
    
    if (!formData.clinical_question.trim()) newErrors.clinical_question = 'Clinical question is required';
    if (formData.clinical_question.length > 800) newErrors.clinical_question = 'Clinical question must be 800 characters or less';
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Case Information</h3>
        <div className="flex items-center gap-2">
          <label htmlFor="load-example" className="text-sm text-slate-600">Load example:</label>
          <select
            id="load-example"
            onChange={handleLoadExample}
            className="border border-slate-200 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          >
            <option value="">Select a case...</option>
            {Object.entries(exampleCases).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="presenter" className="block text-sm font-medium text-slate-700 mb-1">
            Presenter <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="presenter"
            name="presenter"
            value={formData.presenter}
            onChange={handleChange}
            maxLength={80}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.presenter ? 'border-red-500' : 'border-slate-200'
            }`}
            placeholder="Dr. M. Patel, Heme/Onc Fellow"
            disabled={loading}
          />
          {errors.presenter && <p className="text-sm text-red-600 mt-1">{errors.presenter}</p>}
        </div>

        <div>
          <label htmlFor="board_date" className="block text-sm font-medium text-slate-700 mb-1">
            Board date <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            id="board_date"
            name="board_date"
            value={formData.board_date}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.board_date ? 'border-red-500' : 'border-slate-200'
            }`}
            disabled={loading}
          />
          {errors.board_date && <p className="text-sm text-red-600 mt-1">{errors.board_date}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="demographics" className="block text-sm font-medium text-slate-700 mb-1">
          Demographics + comorbidities <span className="text-red-600">*</span>
        </label>
        <textarea
          id="demographics"
          name="demographics"
          value={formData.demographics}
          onChange={handleChange}
          rows={3}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.demographics ? 'border-red-500' : 'border-slate-200'
          }`}
          placeholder="Age, sex, ECOG performance status, smoking history, key comorbidities. One short paragraph."
          disabled={loading}
        />
        {errors.demographics && <p className="text-sm text-red-600 mt-1">{errors.demographics}</p>}
      </div>

      <div>
        <label htmlFor="diagnosis" className="block text-sm font-medium text-slate-700 mb-1">
          Diagnosis + staging <span className="text-red-600">*</span>
        </label>
        <textarea
          id="diagnosis"
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          rows={3}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.diagnosis ? 'border-red-500' : 'border-slate-200'
          }`}
          placeholder="Cancer type, histology, initial stage (TNM/AJCC), date of diagnosis, current stage if different."
          disabled={loading}
        />
        {errors.diagnosis && <p className="text-sm text-red-600 mt-1">{errors.diagnosis}</p>}
      </div>

      <div>
        <label htmlFor="pathology" className="block text-sm font-medium text-slate-700 mb-1">
          Pathology report <span className="text-red-600">*</span>
        </label>
        <textarea
          id="pathology"
          name="pathology"
          value={formData.pathology}
          onChange={handleChange}
          rows={4}
          maxLength={3000}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.pathology ? 'border-red-500' : 'border-slate-200'
          }`}
          placeholder="Paste relevant pathology report excerpts. Include initial biopsy and any re-biopsy."
          disabled={loading}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.pathology && <p className="text-sm text-red-600">{errors.pathology}</p>}
          <p className="text-sm text-slate-500 ml-auto">{formData.pathology.length}/3000</p>
        </div>
      </div>

      <div>
        <label htmlFor="molecular" className="block text-sm font-medium text-slate-700 mb-1">
          Molecular / NGS
        </label>
        <textarea
          id="molecular"
          name="molecular"
          value={formData.molecular}
          onChange={handleChange}
          rows={4}
          maxLength={3000}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.molecular ? 'border-red-500' : 'border-slate-200'
          }`}
          placeholder="Paste NGS report excerpts. Include initial profile and any repeat / liquid biopsy."
          disabled={loading}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.molecular && <p className="text-sm text-red-600">{errors.molecular}</p>}
          <p className="text-sm text-slate-500 ml-auto">{formData.molecular.length}/3000</p>
        </div>
      </div>

      <div>
        <label htmlFor="imaging" className="block text-sm font-medium text-slate-700 mb-1">
          Recent imaging <span className="text-red-600">*</span>
        </label>
        <textarea
          id="imaging"
          name="imaging"
          value={formData.imaging}
          onChange={handleChange}
          rows={4}
          maxLength={3000}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.imaging ? 'border-red-500' : 'border-slate-200'
          }`}
          placeholder="Paste most recent imaging report(s). Include comparison to prior if available."
          disabled={loading}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.imaging && <p className="text-sm text-red-600">{errors.imaging}</p>}
          <p className="text-sm text-slate-500 ml-auto">{formData.imaging.length}/3000</p>
        </div>
      </div>

      <div>
        <label htmlFor="treatment_timeline" className="block text-sm font-medium text-slate-700 mb-1">
          Treatment timeline <span className="text-red-600">*</span>
        </label>
        <textarea
          id="treatment_timeline"
          name="treatment_timeline"
          value={formData.treatment_timeline}
          onChange={handleChange}
          rows={4}
          maxLength={3000}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.treatment_timeline ? 'border-red-500' : 'border-slate-200'
          }`}
          placeholder="Chronological bullets: surgeries, chemo regimens with cycles, radiation, targeted/IO, response at each step."
          disabled={loading}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.treatment_timeline && <p className="text-sm text-red-600">{errors.treatment_timeline}</p>}
          <p className="text-sm text-slate-500 ml-auto">{formData.treatment_timeline.length}/3000</p>
        </div>
      </div>

      <div>
        <label htmlFor="current_status_summary" className="block text-sm font-medium text-slate-700 mb-1">
          Current clinical status <span className="text-red-600">*</span>
        </label>
        <textarea
          id="current_status_summary"
          name="current_status_summary"
          value={formData.current_status_summary}
          onChange={handleChange}
          rows={3}
          maxLength={2000}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.current_status_summary ? 'border-red-500' : 'border-slate-200'
          }`}
          placeholder="Current symptoms, recent CBC/CMP/tumor markers, current performance status, anything new since last visit."
          disabled={loading}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.current_status_summary && <p className="text-sm text-red-600">{errors.current_status_summary}</p>}
          <p className="text-sm text-slate-500 ml-auto">{formData.current_status_summary.length}/2000</p>
        </div>
      </div>

      <div>
        <label htmlFor="clinical_question" className="block text-sm font-medium text-slate-700 mb-1">
          Question for the board <span className="text-red-600">*</span>
        </label>
        <textarea
          id="clinical_question"
          name="clinical_question"
          value={formData.clinical_question}
          onChange={handleChange}
          rows={3}
          maxLength={800}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.clinical_question ? 'border-red-500' : 'border-slate-200'
          }`}
          placeholder="What decision does the presenter want the board to make? Be specific."
          disabled={loading}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.clinical_question && <p className="text-sm text-red-600">{errors.clinical_question}</p>}
          <p className="text-sm text-slate-500 ml-auto">{formData.clinical_question.length}/800</p>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate Case Card'}
        </button>
      </div>
    </form>
  );
}

// Made with Bob
