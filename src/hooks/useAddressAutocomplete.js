import { useState, useEffect } from 'react';

export function useAddressAutocomplete(initialValue = '') {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Only search if query is at least 3 characters
    if (!query || query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        // Photon API is free, keyless, and works perfectly in France
        const response = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lang=fr&limit=5&countrycode=fr`
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.features) {
            const formatted = data.features.map((f) => {
              const props = f.properties;
              const parts = [];

              // Street number and name
              let mainAddress = '';
              if (props.street) {
                // If it has a house number and a street, join them
                if (props.housenumber) {
                  mainAddress = `${props.housenumber} ${props.street}`;
                } else {
                  mainAddress = props.street;
                }
              } else if (props.name) {
                mainAddress = props.name;
              }

              if (mainAddress) {
                parts.push(mainAddress);
              }

              // Postcode & City
              const cityParts = [];
              if (props.postcode) cityParts.push(props.postcode);
              if (props.city) cityParts.push(props.city);
              if (cityParts.length > 0) {
                parts.push(cityParts.join(' '));
              }

              // Country
              if (props.country) {
                parts.push(props.country);
              }

              return {
                id: `${props.osm_id || Math.random()}-${props.osm_type || 'node'}`,
                label: parts.join(', '),
              };
            });

            // Deduplicate suggestions by label
            const uniqueLabels = [];
            const deduped = [];
            formatted.forEach(item => {
              if (item.label && !uniqueLabels.includes(item.label)) {
                uniqueLabels.push(item.label);
                deduped.push(item);
              }
            });

            setSuggestions(deduped);
          }
        }
      } catch (error) {
        console.error('Address Autocomplete error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  return {
    query,
    setQuery,
    suggestions,
    setSuggestions,
    isLoading,
  };
}
