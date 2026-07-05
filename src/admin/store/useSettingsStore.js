import { create } from 'zustand';
import { supabase } from '../../lib/supabase';

const defaultSettings = {
  companyName: 'SELY',
  legalForm: 'Service de chauffeur privé',
  capital: '',
  address: '161 B Rue Emile Combes, 33270 Floirac – France',
  siret: '944 023 514 00010',
  rcs: '',
  vat: 'FR63 944023514',
  phone: '',
  email: 'direction@sely.pro',
  iban: '',
  bic: '',
  cancellationPolicy: 'Toute annulation à moins de 24h sera facturée à 100%.',
  exploitePar: 'AM AUTO',
  website: 'www.selyprive.com'
};

export const useSettingsStore = create((set, get) => ({
  settings: defaultSettings,
  isLoading: false,

  fetchSettings: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;
      
      if (data) {
        // Map snake_case from DB to camelCase for the app
        const mappedSettings = {
          companyName: data.company_name,
          legalForm: data.legal_form,
          capital: data.capital,
          address: data.address,
          siret: data.siret,
          rcs: data.rcs,
          vat: data.vat,
          phone: data.phone,
          email: data.email,
          iban: data.iban,
          bic: data.bic,
          cancellationPolicy: data.cancellation_policy,
          exploitePar: data.exploite_par,
          website: data.website
        };
        set({ settings: mappedSettings });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateSettings: async (newSettings) => {
    const updatedSettings = { ...get().settings, ...newSettings };
    set({ settings: updatedSettings });

    try {
      // Map camelCase to snake_case for DB
      const dbSettings = {
        company_name: updatedSettings.companyName,
        legal_form: updatedSettings.legalForm,
        capital: updatedSettings.capital,
        address: updatedSettings.address,
        siret: updatedSettings.siret,
        rcs: updatedSettings.rcs,
        vat: updatedSettings.vat,
        phone: updatedSettings.phone,
        email: updatedSettings.email,
        iban: updatedSettings.iban,
        bic: updatedSettings.bic,
        cancellation_policy: updatedSettings.cancellationPolicy,
        exploite_par: updatedSettings.exploitePar,
        website: updatedSettings.website,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('settings')
        .update(dbSettings)
        .eq('id', 1);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  },
}));
