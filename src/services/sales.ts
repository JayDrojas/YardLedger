import { supabase } from '../config/supabase';

interface CreateSaleParams {
  metalId: string;
  metalName: string;
  weight: number;
  salePricePerLb: number;
  costBasisPerLb: number;
  buyerName?: string;
  workerId: string;
}

export async function createSale(params: CreateSaleParams) {
  const totalRevenue = params.weight * params.salePricePerLb;
  const profit =
    params.weight * (params.salePricePerLb - params.costBasisPerLb);

  const { data, error } = await supabase
    .from('sales')
    .insert({
      metal_id: params.metalId,
      metal_name: params.metalName,
      weight: params.weight,
      sale_price_per_lb: params.salePricePerLb,
      cost_basis_per_lb: params.costBasisPerLb,
      total_revenue: totalRevenue,
      profit,
      buyer_name: params.buyerName,
      worker_id: params.workerId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchSales() {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
