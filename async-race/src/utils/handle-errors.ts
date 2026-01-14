import { errorPopup } from '@/components/error/error';

export async function handleErrors<T>(
  function_: () => Promise<T>,
  message: string,
): Promise<T | undefined> {
  try {
    return await function_();
  } catch (error) {
    console.error(error);
    errorPopup.show(message);
    return undefined;
  }
}
