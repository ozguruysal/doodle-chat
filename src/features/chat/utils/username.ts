/**
 * This function checks if the user has a username in localStorage.
 *
 * This is not really a login function but it serves the purpose of checking if the user has entered a username before.
 *
 */

const USERNAME_KEY = "username";

export const getUsername = (): string | null => {
  return localStorage.getItem(USERNAME_KEY);
};

export function isUsernameSet(): boolean {
  return Boolean(getUsername());
}

export const saveUsername = (username: string) => {
  localStorage.setItem(USERNAME_KEY, username);
};

export const removeUsername = () => {
  localStorage.removeItem(USERNAME_KEY);
};
