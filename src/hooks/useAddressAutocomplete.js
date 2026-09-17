import { useState, useEffect } from 'react';

const CITY_COORDS = {
  paris: { lat: 48.8566, lon: 2.3522 },
  london: { lat: 51.5074, lon: -0.1278 },
  'french-riviera': { lat: 43.7102, lon: 7.2620 },
  bordeaux: { lat: 44.8378, lon: -0.5792 },
};

export function useAddressAutocomplete(initialValue = '', city = 'paris') {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const cityBias = CITY_COORDS[city] || CITY_COORDS.paris;
        // Search without restricting to a single country: works across all France, UK (England, London), Monaco, Switzerland, etc.
        // lat & lon provide proximity bias to the active city
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
          query.trim()
        )}&limit=7&lat=${cityBias.lat}&lon=${cityBias.lon}`;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data && data.features) {
            const formatted = data.features.map((f) => {
              const props = f.properties;
              const parts = [];

              // Street number and name
              let mainAddress = '';
              if (props.street) {
                if (props.housenumber) {
                  mainAddress = `${props.housenumber} ${props.street}`;
                } else {
                  mainAddress = props.street;
                }
              } else if (props.name) {
                mainAddress = props.name;
              }

              if (mainAddress) parts.push(mainAddress);

              // Postcode & City
              const cityParts = [];
              if (props.postcode) cityParts.push(props.postcode);
              if (props.city) cityParts.push(props.city);
              if (cityParts.length > 0) parts.push(cityParts.join(' '));

              // State / County / Region
              if (props.state && !props.city) parts.push(props.state);

              // Country
              if (props.country) parts.push(props.country);

              return {
                id: `${props.osm_id || Math.random()}-${props.osm_type || 'node'}`,
                label: parts.join(', '),
                coordinates: f.geometry && f.geometry.coordinates ? f.geometry.coordinates : null, // [lon, lat]
              };
            });

            // Deduplicate suggestions by label
            const uniqueLabels = new Set();
            const deduped = [];
            formatted.forEach((item) => {
              if (item.label && !uniqueLabels.has(item.label)) {
                uniqueLabels.add(item.label);
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
    }, 280);

    return () => clearTimeout(timer);
  }, [query, city]);

  return {
    query,
    setQuery,
    suggestions,
    setSuggestions,
    selectedCoords,
    setSelectedCoords,
    isLoading,
  };
}
