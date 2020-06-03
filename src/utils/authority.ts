import { reloadAuthorized } from './Authorized';

const storageKey: string = 'x-site-authority';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str?: string): string | string[] {
  const authorityString =
    typeof str === 'undefined' && sessionStorage ? sessionStorage.getItem(storageKey) : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }

  return authority;
}

export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  sessionStorage.setItem(storageKey, JSON.stringify(proAuthority));
  // auto reload
  reloadAuthorized();
}
