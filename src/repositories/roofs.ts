import { ref, computed } from 'vue';
import api, { type RoofDTO } from '/@/services/supabase';
import { adaptRoof, mergeRoofs, adaptBuilding } from './adapters';
import { getMeanPrice, groupBy } from '/@/utils';
import type { Roof, Building } from '/@/types';
import config from '/@/config.yaml';

const { panel, tariffs } = config.constants;

export const TARIFF_C = getMeanPrice(tariffs.C_BASE, tariffs.INCREASE, panel.LIFESPAN);
export const TARIFF_BLUE = getMeanPrice(tariffs.BLUE_BASE, tariffs.INCREASE, panel.LIFESPAN);

export const useRoofsRepository = () => {
  const roofs = ref<Roof[]>([]);
  const loading = ref<boolean>(false);

  const buildings = computed(() => {
    const buildBuilding = (group: Roof[]): Building => adaptBuilding(mergeRoofs(group));
    return groupBy(roofs.value, 'cesi').map(buildBuilding);
  });

  const loadRoofs = async () => {
    const data = await api.get<RoofDTO[]>(config.api.tables.ROOFS);
    roofs.value = data.map(adaptRoof);
  };

  return { roofs, buildings, loadRoofs, loading };
};
