export const getInsuranceDeposit = (category_id) => {
  var security_deposit = 0,
    insurance_rate_per_day = 0,
    insurance_tax_rate_per_day = 0;
  switch (category_id) {
    case 39: //Snowmobiles
      security_deposit = 500;
      insurance_rate_per_day = 50;
      insurance_tax_rate_per_day = 2;
      break;
    case 42: //UTV's
      security_deposit = 1500;
      insurance_rate_per_day = 85;
      insurance_tax_rate_per_day = 5;
      break;
    case 43: //ATV's
      security_deposit = 500;
      insurance_rate_per_day = 40;
      insurance_tax_rate_per_day = 2;
      break;
    case 45: //Dirt Bikes
      security_deposit = 500;
      insurance_rate_per_day = 40;
      insurance_tax_rate_per_day = 2;
      break;
    case 46: //Motorcycles
      security_deposit = 500;
      insurance_rate_per_day = 72;
      insurance_tax_rate_per_day = 5;
      break;
    case 47: //Jet Skis
      security_deposit = 500;
      insurance_rate_per_day = 40;
      insurance_tax_rate_per_day = 2;
      break;
    case 48: //Boats
      security_deposit = 1000;
      insurance_rate_per_day = 72;
      insurance_tax_rate_per_day = 4;
      break;
    case 51: //RV's
      security_deposit = 750;
      insurance_rate_per_day = 85;
      insurance_tax_rate_per_day = 5;
      break;
    case 52: //Kayaks
      security_deposit = 50;
      insurance_rate_per_day = 15;
      insurance_tax_rate_per_day = 1;
      break;
    case 53: //Canoes
      security_deposit = 20;
      insurance_rate_per_day = 15;
      insurance_tax_rate_per_day = 1;
      break;
    case 54: //Bicycles
      security_deposit = 50;
      insurance_rate_per_day = 18;
      insurance_tax_rate_per_day = 1;
      break;
    case 55: //Utility Trailers
      security_deposit = 250;
      insurance_rate_per_day = 15;
      insurance_tax_rate_per_day = 1;
      break;
    case 57: //Luxury Automobiles
      security_deposit = 2000;
      insurance_rate_per_day = 85;
      insurance_tax_rate_per_day = 5;
      break;
    default:
      security_deposit = 500;
      insurance_rate_per_day = 35;
      insurance_tax_rate_per_day = 2;
      break;
  }
  return {
    security_deposit,
    insurance_rate_per_day,
    insurance_tax_rate_per_day,
  };
}