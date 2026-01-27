import { VALIDATION_RULES } from '@/data/validation-rules';
import { userStore } from '@/store/user-store';

export function validateField(field: 'login' | 'password', value: string): boolean {
  const rules = VALIDATION_RULES[field];
  for (const rule of rules) {
    if (!rule.test(value, userStore.state.login)) {
      userStore.showError(field, rule.error);
      return false;
    }
  }
  userStore.removeError(field);
  return true;
}
