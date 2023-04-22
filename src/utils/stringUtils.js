export const convertStringToNumber = (str) => {
  return parseFloat(str.replace(/,/g, ''));
}

export const containPhoneNumbers = (string) => {
  const regex = new RegExp(/(?:[-+() ]*\d){10,13}/gm);
  while (regex.exec(string)) {
    return true;
  }
  return false;
};

export const getLocation = (item) => {
  if (!item || !item.state) {
    return 'Not specified';
  }
  let location = '';
  if (item.city) {
    location += item.city + ', ';
  }
  location += item.state;
  return location;
}

export const parseContent = (content) => {
  const pos = content.indexOf('.');
  if (pos === -1) {
    return ({ num: '', text: content });
  }

  const num = content.substr(0, pos);
  if (isNaN(num)) {
    return ({ num: '', text: content });
  }

  return ({ num: num, text: content.substr(pos + 1, content.length - pos - 1)});
}

export const parseAddress = (address) => {
  var street = '', city = '', state = '', country = '',  zipcode = '';
  for (var i = 0; i < address.length; i++) {
    const type = address[i].types[0];
    if (type === 'locality') {
      city = address[i].short_name;
    } else if (type === 'administrative_area_level_1') {
      state = address[i].long_name;
    } else if (type === 'country') {
      country = address[i].short_name;
    } else if (type === 'postal_code') {
      zipcode = address[i].short_name;
    } else if (type === 'establishment' || type === 'street_number' || type === 'street_address') {
      street = address[i].short_name;
    } else if (type === 'route') {
      street = street.length > 0 ? `${street} ${address[i].short_name}` : address[i].short_name;
    }
  }
  return { street, city, state, zipcode, country };
}

export const getTripsString = (count) => {
  return (+count) === 0 ? 'no trips' : (+count) === 1 ? '1 trip' : `${count} trips`;
}

export const getIdString = (ids) => {
  if (ids.length > 0) {
    return ids.reduce((a, b) => `${a}, ${b}`);
  }
  return '';
}
