import { create } from 'zustand';
import { supabase } from '../../lib/supabase';

export const useInvoicesStore = create((set, get) => ({
  invoices: [],
  isLoading: false,

  fetchInvoices: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedInvoices = data.map(i => ({
          id: i.id,
          createdAt: i.created_at,
          status: i.status,
          invoiceNumber: i.invoice_number,
          clientType: i.client_type,
          clientFirstName: i.client_first_name,
          clientLastName: i.client_last_name,
          clientCompany: i.client_company,
          clientEmail: i.client_email,
          clientPhone: i.client_phone,
          clientAddress: i.client_address,
          clientVat: i.client_vat,
          tvaRate: i.tva_rate,
          items: i.items,
          deposit: i.deposit
        }));
        set({ invoices: mappedInvoices });
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addInvoice: async (invoice) => {
    try {
      const year = new Date().getFullYear();
      const currentInvoices = get().invoices;
      const number = (currentInvoices.filter(i => i.invoiceNumber?.includes(year)).length + 1).toString().padStart(4, '0');
      const invoiceNumber = `FAC-${year}-${number}`;

      const dbInvoice = {
        invoice_number: invoiceNumber,
        status: 'pending',
        client_type: invoice.clientType,
        client_first_name: invoice.clientFirstName,
        client_last_name: invoice.clientLastName,
        client_company: invoice.clientCompany,
        client_email: invoice.clientEmail,
        client_phone: invoice.clientPhone,
        client_address: invoice.clientAddress,
        client_vat: invoice.clientVat,
        tva_rate: invoice.tvaRate,
        items: invoice.items,
        deposit: invoice.deposit || 0
      };

      const { data, error } = await supabase
        .from('invoices')
        .insert([dbInvoice])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newInvoice = {
          id: data.id,
          createdAt: data.created_at,
          status: data.status,
          invoiceNumber: data.invoice_number,
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
          deposit: data.deposit
        };
        set({ invoices: [newInvoice, ...currentInvoices] });
      }
    } catch (error) {
      console.error('Error adding invoice:', error);
    }
  },

  updateInvoiceStatus: async (id, status) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        invoices: state.invoices.map((i) => (i.id === id ? { ...i, status } : i))
      }));
    } catch (error) {
      console.error('Error updating invoice status:', error);
    }
  },

  deleteInvoice: async (id) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        invoices: state.invoices.filter((i) => i.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  },
}));
