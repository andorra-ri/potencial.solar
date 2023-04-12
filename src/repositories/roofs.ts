import api, { type RoofDTO } from '/@/services/supabase';
import { adaptRoof, mergeRoofs, adaptBuilding } from './adapters';
import { getMeanPrice, groupBy } from '/@/utils';
import config from '/@/config.yaml';

const { panel, tariffs } = config.constants;

export const TARIFF_C = getMeanPrice(tariffs.C_BASE, tariffs.INCREASE, panel.LIFESPAN);
export const TARIFF_BLUE = getMeanPrice(tariffs.BLUE_BASE, tariffs.INCREASE, panel.LIFESPAN);

export async function useRoofsRepository() {
  const data = await api.get<RoofDTO[]>(config.api.tables.ROOFS);

  const roofs = data.map(adaptRoof);

  const buildings = groupBy(roofs, 'cesi').map(group => {
    const building = mergeRoofs(group);
    return adaptBuilding(building);
  });

  return { roofs, buildings };
}
