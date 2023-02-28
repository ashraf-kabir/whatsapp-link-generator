import React, { useState, useEffect } from 'react';
import './App.css';
import data from './countryList.json';

function App() {
  const [countries, setCountries] = useState([]);
  const [countryCode, setCountryCode] = useState('+880');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCountries();
  }, []);

  async function fetchCountries() {
    const countries = data.map((country) => ({
      name: country.name.common,
      code: country.idd.root + country.idd.suffixes,
    }));

    countries.map((country) => {
      if (country.name === 'United States') {
        country.code = '+1';
      }
      return country;
    });

    countries.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    const filteredCountries = countries.filter((country) => {
      return !isNaN(country.code);
    });

    setCountries(filteredCountries);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const link = `https://wa.me/${countryCode}${phoneNumber}`;
    setGeneratedLink(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setSuccess(true);
  };

  const handleOpenLink = () => {
    window.open(generatedLink, '_blank');
  };
  return (
    <div className='container'>
      <h1>WhatsApp Link Generator</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-wrapper'>
          <select
            value={countryCode}
            onChange={(event) => setCountryCode(event.target.value)}
          >
            <option>Select a country</option>
            {countries.map((country, index) => (
              <option key={index} value={country.code}>
                {country.name} ({country.code})
              </option>
            ))}
          </select>

          <input
            type='tel'
            placeholder='Phone Number'
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            onKeyDown={(event) => {
              if (
                !(
                  (event.keyCode > 95 && event.keyCode < 106) ||
                  (event.keyCode > 47 && event.keyCode < 58) ||
                  event.keyCode === 8
                )
              ) {
                event.preventDefault();
              }
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
          }}
        >
          <button
            type='submit'
            disabled={phoneNumber === '' || countryCode === ''}
          >
            Generate Link
          </button>
        </div>
      </form>

      {success && (
        <div className='success-toast'>
          <span>Link copied to clipboard!</span>
        </div>
        // hide the toast after 5 seconds
      )}

      {generatedLink && (
        <div className='result'>
          <span>Generated link:</span>
          <div className='generated-link'>
            <a
              href={generatedLink}
              target='_blank'
              rel='noreferrer'
              onClick={handleOpenLink}
              style={{ textDecoration: 'none' }}
            >
              {generatedLink}
            </a>
            <button className='copy' onClick={handleCopyLink}>
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
