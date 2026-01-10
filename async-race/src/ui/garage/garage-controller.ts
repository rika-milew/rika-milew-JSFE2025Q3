import { updateCar } from '../../api//garage/update-car';
import { createCar } from '../../api/garage/create-car';
import { deleteCar } from '../../api/garage/delete-car';
import { appState } from '../../state/app-state';
import { carState } from '../../state/car-state';
import { eventState } from '../../state/event-state';
import { garageList } from '../garage/garage-list';

let isControllerStarted = false;

export function startGarageController(): void {
  if (isControllerStarted) {
    return;
  }

  isControllerStarted = true;
  eventState.on('car:create', async (payload) => {
    if (!payload) {
      return;
    }

    const created = await createCar(payload.name, payload.color);
    if (!created) {
      console.warn('Failed to create a new car');
      return;
    }

    carState.add(created);
    eventState.emit('updateform:reset');
    eventState.emit('garage:refresh');
  });

  eventState.on('car:update', async (payload) => {
    if (!payload) {
      return;
    }

    const updated = await updateCar(payload.id, payload.name, payload.color);
    if (!updated) {
      console.warn('Failed to update the chosen car');
      return;
    }

    carState.update(updated);
  });

  eventState.on('car:delete', async (payload) => {
    if (!payload) {
      return;
    }

    const deleted = await deleteCar(payload.id);
    if (!deleted) {
      console.warn('Failed to delete the chosen car');
      return;
    }

    carState.remove(payload.id);

    const maxPage = Math.ceil(carState.totalCount / appState.perPage);
    if (appState.garagePage > maxPage) {
      appState.garagePage = maxPage > 0 ? maxPage : 1;
    }

    await garageList.render();
    eventState.emit('car:deleted', payload.id);
  });
}
