import { create } from 'zustand';
import { supabase } from '../../lib/supabase';

export const useQuotesStore = create((set, get) => ({
  quotes: [],
  isLoading: false,

  fetchQuotes: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Map snake_case from DB to camelCase for the app
        const mappedQuotes = data.map(q => ({
          id: q.id,
          createdAt: q.created_at,
          status: q.status,
          quoteNumber: q.quote_number,
          clientType: q.client_type,
          clientFirstName: q.client_first_name,
          clientLastName: q.client_last_name,
          clientCompany: q.client_company,
          clientEmail: q.client_email,
          clientPhone: q.client_phone,
          clientAddress: q.client_address,
          clientVat: q.client_vat,
          tvaRate: q.tva_rate,
          items: q.items,
          conditions: q.conditions
        }));
        set({ quotes: mappedQuotes });
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addQuote: async (quote) => {
    try {
      const year = new Date().getFullYear();
      const currentQuotes = get().quotes;
      const number = (currentQuotes.filter(q => q.quoteNumber?.includes(year)).length + 1).toString().padStart(4, '0');
      const quoteNumber = quote.quoteNumber || `DEV-${year}-${number}`;

      const dbQuote = {
        quote_number: quoteNumber,
        status: 'pending',
        client_type: quote.clientType,
        client_first_name: quote.clientFirstName,
        client_last_name: quote.clientLastName,
        client_company: quote.clientCompany,
        client_email: quote.clientEmail,
        client_phone: quote.clientPhone,
        client_address: quote.clientAddress,
        client_vat: quote.clientVat,
        tva_rate: quote.tvaRate,
        items: quote.items,
        conditions: quote.conditions
      };

      const { data, error } = await supabase
        .from('quotes')
        .insert([dbQuote])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newQuote = {
          id: data.id,
          createdAt: data.created_at,
          status: data.status,
          quoteNumber: data.quote_number,
          clientType: data.client_type,
          clientFirstName: data.client_first_name,
          clientLastName: data.client_last_name,
          clientCompany: data.client_company,
          clientEmail: data.client_email,
          clientPhone: data.client_phone,
          clientAddress: data.client_address,
          clientVat: data.client_vat,
          tvaRate: data.tva_rate,
          items: data.items,
          conditions: data.conditions
        };
        set({ quotes: [newQuote, ...currentQuotes] });
      }
    } catch (error) {
      console.error('Error adding quote:', error);
    }
  },

  updateQuote: async (id, updatedQuote) => {
    try {
      // Map camelCase to snake_case for DB
      const dbQuote = {};
      if (updatedQuote.quoteNumber) dbQuote.quote_number = updatedQuote.quoteNumber;
      if (updatedQuote.status) dbQuote.status = updatedQuote.status;
      if (updatedQuote.clientType) dbQuote.client_type = updatedQuote.clientType;
      if (updatedQuote.clientFirstName !== undefined) dbQuote.client_first_name = updatedQuote.clientFirstName;
      if (updatedQuote.clientLastName !== undefined) dbQuote.client_last_name = updatedQuote.clientLastName;
      if (updatedQuote.clientCompany !== undefined) dbQuote.client_company = updatedQuote.clientCompany;
      if (updatedQuote.clientEmail !== undefined) dbQuote.client_email = updatedQuote.clientEmail;
      if (updatedQuote.clientPhone !== undefined) dbQuote.client_phone = updatedQuote.clientPhone;
      if (updatedQuote.clientAddress !== undefined) dbQuote.client_address = updatedQuote.clientAddress;
      if (updatedQuote.clientVat !== undefined) dbQuote.client_vat = updatedQuote.clientVat;
      if (updatedQuote.tvaRate !== undefined) dbQuote.tva_rate = updatedQuote.tvaRate;
      if (updatedQuote.items) dbQuote.items = updatedQuote.items;
      if (updatedQuote.conditions !== undefined) dbQuote.conditions = updatedQuote.conditions;

      const { error } = await supabase
        .from('quotes')
        .update(dbQuote)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        quotes: state.quotes.map((q) => (q.id === id ? { ...q, ...updatedQuote } : q))
      }));
    } catch (error) {
      console.error('Error updating quote:', error);
    }
  },

  deleteQuote: async (id) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        quotes: state.quotes.filter((q) => q.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting quote:', error);
    }
  },

  duplicateQuote: async (id) => {
    const quoteToDuplicate = get().quotes.find(q => q.id === id);
    if (!quoteToDuplicate) return;

    const { id: _, createdAt: __, quoteNumber: ___, ...rest } = quoteToDuplicate;
    await get().addQuote(rest);
  },
}));
