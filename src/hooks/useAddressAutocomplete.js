import { useState, useEffect } from 'react';

const CITY_COORDS = {
  paris: { lat: 48.8566, lon: 2.3522 },
  london: { lat: 51.5074, lon: -0.1278 },
  'french-riviera': { lat: 43.7102, lon: 7.2620 },
  bordeaux: { lat: 44.8378, lon: -0.5792 },
  suisse: { lat: 46.2044, lon: 6.1432 },
  usa: { lat: 40.7128, lon: -74.0060 },
  italie: { lat: 45.4642, lon: 9.1900 },
  uae: { lat: 25.2048, lon: 55.2708 },
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
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
          query.trim()
        )}&limit=7&lat=${cityBias.lat}&lon=${cityBias.lon}`;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data && data.features) {
            const formatted = data.features.map((f) => {
              const props = f.properties || {};
              const parts = [];

              // Check if place is an airport or VIP transport terminal
              const isAirport =
                props.osm_key === 'aeroway' ||
                props.osm_value === 'aerodrome' ||
                props.osm_value === 'terminal' ||
                (props.name && /a[ée]roport|airport|cdg|orly|roissy|bourget|heathrow|gatwick|terminal/i.test(props.name)) ||
                (props.street && /cdg|roissy/i.test(props.street));

              let mainAddress = '';

              if (isAirport) {
                // Preserve explicit airport identity instead of administrative street (e.g. Place de Dublin)
                if (props.name && /cdg|charles de gaulle/i.test(props.name)) {
                  mainAddress = props.name.includes('Aéroport') ? props.name : `Aéroport CDG - ${props.name}`;
                } else if (/cdg|charles de gaulle|roissy/i.test(query)) {
                  mainAddress = props.name ? `Aéroport CDG (${props.name})` : 'Aéroport Paris-Charles de Gaulle (CDG)';
                } else if (props.name) {
                  mainAddress = props.name;
                } else {
                  mainAddress = 'Aéroport Paris-Charles de Gaulle (CDG)';
                }
              } else if (props.name && (!props.street || props.osm_key !== 'highway')) {
                // Recognised Point of Interest, Hotel, Palace or Monument
                mainAddress = props.name;
                if (props.street && props.housenumber) {
                  mainAddress = `${props.name} (${props.housenumber} ${props.street})`;
                }
              } else if (props.street) {
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
              if (props.country && props.country !== 'France') parts.push(props.country);

              const label = parts.join(', ');
              return {
                id: `${props.osm_id || Math.random()}-${props.osm_type || 'node'}`,
                label,
                description: label,
                isAirport,
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

  const selectSuggestion = (suggestion) => {
    if (!suggestion) return;
    const label = suggestion.label || suggestion.description || '';
    setQuery(label);
    if (suggestion.coordinates) {
      setSelectedCoords(suggestion.coordinates);
    }
    setSuggestions([]);
  };

  return {
    query,
    setQuery,
    suggestions,
    setSuggestions,
    selectedCoords,
    setSelectedCoords,
    selectSuggestion,
    isLoading,
  };
}
