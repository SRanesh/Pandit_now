import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function PanditSignUpForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    experience: '',
    location: '',
    bio: '',
    languages: [] as string[],
    specializations: [] as string[]
  });
  const [newLanguage, setNewLanguage] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const predefinedLanguages = ['Hindi', 'Sanskrit', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati'];
  const predefinedSpecializations = [
    'Puja', 'Wedding Ceremony', 'House Warming', 'Baby Naming', 
    'Mundan Ceremony', 'Satyanarayan Katha', 'Griha Pravesh', 
    'Upanayana', 'Funeral Rites', 'Pitru Paksha', 'Navratri Puja'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLanguageAdd = (language: string) => {
    if (!language.trim()) return;
    
    const formattedLanguage = language.trim();
    if (!formData.languages.includes(formattedLanguage)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, formattedLanguage]
      }));
    }
    setNewLanguage('');
  };

  const handleLanguageRemove = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== language)
    }));
  };

  const handleSpecializationAdd = (specialization: string) => {
    if (!specialization.trim()) return;
    
    const formattedSpecialization = specialization.trim();
    if (!formData.specializations.includes(formattedSpecialization)) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, formattedSpecialization]
      }));
    }
    setNewSpecialization('');
  };

  const handleSpecializationRemove = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter(spec => spec !== specialization)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate all required fields
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (formData.languages.length === 0) {
      setError("Please add at least one language");
      return;
    }

    if (formData.specializations.length === 0) {
      setError("Please add at least one specialization");
      return;
    }

    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: 'pandit',
            phone: formData.phone,
            location: formData.location,
            experience: formData.experience,
            languages: formData.languages,
            specializations: formData.specializations,
            bio: formData.bio
          }
        }
      });
      
      if (error) throw error;

    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create pandit account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <Input
            id="location"
            name="location"
            type="text"
            required
            value={formData.location}
            onChange={handleChange}
            placeholder="City, State"
          />
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
            Years of Experience
          </label>
          <Input
            id="experience"
            name="experience"
            type="number"
            min="0"
            required
            value={formData.experience}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Languages Spoken
        </label>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Type a language..."
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleLanguageAdd(newLanguage);
                }
              }}
            />
            <Button
              type="button"
              onClick={() => handleLanguageAdd(newLanguage)}
            >
              Add
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {predefinedLanguages.map(lang => (
              <button
                key={lang}
                type="button"
                onClick={() => handleLanguageAdd(lang)}
                className={`px-3 py-1 rounded-full text-sm ${
                  formData.languages.includes(lang)
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {formData.languages.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.languages.map(lang => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-orange-500 text-white"
                >
                  {lang}
                  <button
                    type="button"
                    onClick={() => handleLanguageRemove(lang)}
                    className="p-0.5 hover:bg-orange-600 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Specializations
        </label>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              value={newSpecialization}
              onChange={(e) => setNewSpecialization(e.target.value)}
              placeholder="Type a specialization..."
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSpecializationAdd(newSpecialization);
                }
              }}
            />
            <Button
              type="button"
              onClick={() => handleSpecializationAdd(newSpecialization)}
            >
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {predefinedSpecializations.map(spec => (
              <button
                key={spec}
                type="button"
                onClick={() => handleSpecializationAdd(spec)}
                className={`px-3 py-1 rounded-full text-sm ${
                  formData.specializations.includes(spec)
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

          {formData.specializations.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.specializations.map(spec => (
                <span
                  key={spec}
                  className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-gray-900 rounded-full text-sm"
                >
                  {spec}
                  <button
                    type="button"
                    onClick={() => handleSpecializationRemove(spec)}
                    className="hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
          About Me
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          required
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell devotees about your expertise and approach to ceremonies..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <Button type="submit" isLoading={isLoading} className="w-full">
        Create Pandit Account
      </Button>
    </form>
  );
}