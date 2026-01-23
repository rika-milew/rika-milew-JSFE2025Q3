import { createPageInfo } from '@/components/page-info/page-info';
import { appState } from '@/state/app-state';
import { carState } from '@/state/car-state';
import { eventState } from '@/state/events/event-state';

export const infoElements = createPageInfo({
  title: 'Garage',
  page: appState.garagePage,
  total: carState.cars.length,
  totalText: 'Total Cars',
});

eventState.on('garage:refresh', () => {
  infoElements.totalInfo.textContent = `Total Cars: ${carState.totalCount}`;
});

eventState.on('garage:pagination:update', (data) => {
  if (!data) {
    return;
  }

  const { currentPage, totalCount } = data;
  infoElements.totalInfo.textContent = `Total Cars: ${totalCount}`;
  infoElements.pageInfo.textContent = `Page: ${currentPage} / ${Math.ceil(totalCount / appState.perPage) || 1}`;
});
