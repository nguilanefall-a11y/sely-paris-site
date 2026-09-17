import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';

export function useCity() {
  const { t, i18n } = useTranslation();
  const { city } = useParams();
  const location = useLocation();

  const pathParts = location.pathname.split('/');
  const firstSegment = pathParts[1];
  const validCities = ['paris', 'bordeaux', 'french-riviera', 'london'];
  
  const currentCity = validCities.includes(city)
    ? city
    : validCities.includes(firstSegment)
      ? firstSegment
      : 'paris';

  const getCityPath = (path) => {
    if (!path) return `/${currentCity}`;
    if (path.startsWith('/sely-office')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (cleanPath === '/') return `/${currentCity}`;
    // If path already starts with one of the valid city names, don't prepend again
    const secondSegment = cleanPath.split('/')[1];
    if (validCities.includes(secondSegment)) return cleanPath;
    return `/${currentCity}${cleanPath}`;
  };

  const cityT = (key, defaultValue) => {
    const cityKey = `${currentCity}.${key}`;
    if (i18n.exists(cityKey)) {
      return t(cityKey);
    }
    return t(key, defaultValue);
  };

  return {
    city: currentCity,
    getCityPath,
    t: cityT,
    i18n
  };
}
