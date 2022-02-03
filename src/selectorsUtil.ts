import { countryCodes, defaultSelectedCountries } from './data';
import { compareValues } from './util';

function getCheckedCheckboxes() {
  const activeCheckboxes = document.querySelectorAll(
    'pk-checkbox',
  ) as NodeListOf<HTMLPkCheckboxElement>;
  const list: HTMLPkCheckboxElement[] = [];
  activeCheckboxes.forEach((ac) => {
    if (ac.checked) list.push(ac);
  });
  return list;
}
export const makeCountryChips = () => {
  const pkChip = document.querySelector('#pk-codes-chips');
  pkChip.textContent = '';
  const activeCheckboxes = getCheckedCheckboxes();
  activeCheckboxes.forEach((ac) => {
    const chip = document.createElement('pk-chip');
    chip.style.fontSize = 'var(--pk-font-size-xs2';
    chip.style.border = '0.4px var(--pk-interaction) solid';
    chip.style.borderRadius = '50%';
    chip.style.margin = 'var(--pk-spacing-xxs)';
    chip.style.padding = 'var(--pk-spacing-xxs)';
    chip.textContent = ac.value;
    pkChip.appendChild(chip);
  });
};

const setupCheckboxEventListeners = () => {
  const checkboxContainer = document.querySelector('#countryCheckboxes');
  const checkboxes = checkboxContainer.querySelectorAll('pk-checkbox');
  checkboxes.forEach((ck) => {
    ck.addEventListener('checkboxChange', makeCountryChips);
  });
};

export const createCountryCheckboxes = () => {
  const checkboxContainer = document.querySelector('#countryCheckboxes');
  const sortedCc = countryCodes.sort(compareValues('isoCode'));
  sortedCc.forEach((p) => {
    const e = document.createElement('span');
    e.slot = 'suffix';
    const pkCheckbox = document.createElement('pk-checkbox');
    pkCheckbox.name = p.name;
    pkCheckbox.value = p.isoCode;
    if (defaultSelectedCountries.includes(p.isoCode)) pkCheckbox.checked = true;
    const id = document.createElement('pk-identifier');
    // badge
    const prefix = document.createElement('span');
    prefix.setAttribute('slot', 'prefix');
    const badge = document.createElement('pk-badge');
    badge.src = `http://purecatamphetamine.github.io/country-flag-icons/3x2/${p.isoCode}.svg`;
    prefix.appendChild(badge);
    // content slots
    const primary = document.createElement('span');
    primary.setAttribute('slot', 'primary');
    primary.textContent = p.name;
    const secondary = document.createElement('span');
    secondary.setAttribute('slot', 'secondary');
    secondary.textContent = p.isoCode;
    e.appendChild(pkCheckbox);
    // appends
    id.appendChild(prefix);
    id.appendChild(primary);
    id.appendChild(secondary);
    id.appendChild(e);
    checkboxContainer.appendChild(id);
  });
  setupCheckboxEventListeners();
};

export const updateCustomInput = (
  event: CustomEvent<{ item: HTMLPkMenuItemElement }>,
  selectorID: string,
) => {
  const tE = event.target as HTMLElement;
  for (let i = 0; i < tE.children.length; i += 1) {
    const child = tE.children[i];
    if (child.tagName.toLowerCase() === 'pk-menu-item')
      tE.children[i].setAttribute('selected', 'false');
  }

  const targetElement = event.detail.item;
  targetElement.setAttribute('selected', 'true');
  const itemValue = targetElement.getAttribute('value');
  if (itemValue) {
    const baseUrl = document.querySelector(selectorID);
    baseUrl.setAttribute('pk-value', itemValue);
    const textSection = baseUrl.querySelector(`${selectorID}Selection`);
    textSection.textContent = targetElement.getAttribute('printValue');
  }
};

export const extractInputData = () => {
  //get values from inputs
  const inputValue = document
    .querySelector<HTMLInputElement>('#competitionId')
    .getAttribute('pk-value');
  const inputCountryCodes = getCheckedCheckboxes().map((p) => p.value);
  const baseUrl = document
    .querySelector<HTMLInputElement>('#baseUrl')
    .getAttribute('pk-value');
  const competitionIdArray = [inputValue].filter(Boolean);

  const countryCodesArray = inputCountryCodes
    .map((cc) => cc.trim().toUpperCase())
    .filter(Boolean);
  return {
    cupArray: competitionIdArray,
    countries: countryCodesArray,
    url: baseUrl,
  };
};
