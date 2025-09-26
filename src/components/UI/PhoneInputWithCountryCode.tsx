import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';

interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

const COUNTRY_CODES: CountryCode[] = [
  { code: '+39', country: 'Italia', flag: '🇮🇹' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '+44', country: 'Regno Unito', flag: '🇬🇧' },
  { code: '+33', country: 'Francia', flag: '🇫🇷' },
  { code: '+49', country: 'Germania', flag: '🇩🇪' },
  { code: '+34', country: 'Spagna', flag: '🇪🇸' },
  { code: '+41', country: 'Svizzera', flag: '🇨🇭' },
  { code: '+43', country: 'Austria', flag: '🇦🇹' },
  { code: '+31', country: 'Paesi Bassi', flag: '🇳🇱' },
  { code: '+32', country: 'Belgio', flag: '🇧🇪' },
];

interface PhoneInputWithCountryCodeProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  id?: string;
  name?: string;
}

export function PhoneInputWithCountryCode({
  value = '',
  onChange,
  error,
  disabled = false,
  placeholder = "123 456 7890",
  required = false,
  id,
  name,
}: PhoneInputWithCountryCodeProps) {
  const [countryCode, setCountryCode] = useState('+39');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Initialize values from prop on mount or when value changes
  useEffect(() => {
    if (value) {
      // Find matching country code
      const matchingCode = COUNTRY_CODES.find(cc => value.startsWith(cc.code));
      if (matchingCode) {
        setCountryCode(matchingCode.code);
        setPhoneNumber(value.substring(matchingCode.code.length));
      } else {
        // If no matching country code found, try to extract a reasonable default
        if (value.startsWith('+')) {
          const spaceIndex = value.indexOf(' ');
          if (spaceIndex > 0) {
            setCountryCode(value.substring(0, spaceIndex));
            setPhoneNumber(value.substring(spaceIndex + 1));
          } else {
            // Assume first 3-4 characters are country code
            const code = value.substring(0, Math.min(4, value.length));
            setCountryCode(code);
            setPhoneNumber(value.substring(code.length));
          }
        } else {
          // No + prefix, assume it's just the number part
          setPhoneNumber(value);
        }
      }
    } else {
      setPhoneNumber('');
    }
  }, [value]);

  const handleCountryCodeChange = (newCode: string) => {
    setCountryCode(newCode);
    const fullNumber = phoneNumber ? `${newCode}${phoneNumber}` : newCode;
    onChange(fullNumber);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow only numeric characters, spaces, dashes, and parentheses for formatting
    const cleanValue = inputValue.replace(/[^\d\s\-\(\)]/g, '');
    
    setPhoneNumber(cleanValue);
    const fullNumber = cleanValue ? `${countryCode}${cleanValue}` : countryCode;
    onChange(fullNumber);
  };

  const handlePhoneNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }
    
    // Ensure that it is a number, space, dash, or parentheses
    if (!((e.keyCode >= 48 && e.keyCode <= 57) || // 0-9
          (e.keyCode >= 96 && e.keyCode <= 105) || // numpad 0-9
          e.keyCode === 32 || // space
          e.keyCode === 189 || // dash
          e.keyCode === 173 || // dash (Firefox)
          e.keyCode === 57 || // parentheses
          e.keyCode === 48)) { // parentheses
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex rounded-md shadow-sm">
        {/* Country Code Selector */}
        <div className="relative">
          <select
            value={countryCode}
            onChange={(e) => handleCountryCodeChange(e.target.value)}
            disabled={disabled}
            className={`h-full rounded-l-md border-0 bg-transparent py-0 pl-3 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm ${
              error
                ? 'border-red-300 dark:border-red-600'
                : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50`}
            aria-label="Country code"
          >
            {COUNTRY_CODES.map((cc) => (
              <option key={cc.code} value={cc.code}>
                {cc.flag} {cc.code}
              </option>
            ))}
          </select>
        </div>

        {/* Phone Number Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Phone className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="tel"
            id={id}
            name={name}
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            onKeyDown={handlePhoneNumberKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`block w-full rounded-none rounded-r-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
              error
                ? 'ring-red-300 dark:ring-red-600 focus:ring-red-500'
                : 'ring-gray-300 dark:ring-gray-600 focus:ring-indigo-600'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50`}
            autoComplete="tel"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Formato: {countryCode} seguita dal numero locale (es. {countryCode} 320 1234567)
      </p>
    </div>
  );
}