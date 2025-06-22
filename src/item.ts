export class Item {
  /** Volume in mL */
  private volume: number;
  private price: number;
  private alcoholRate: number;

  private static readonly TAX_RATE = 0.14975;

  constructor(volume: number, price: number, alcoholRate: number) {
    this.volume = volume;
    this.price = price;
    this.alcoholRate = alcoholRate;
  }

  public getPriceWithTax(): number {
    const salesTax = this.price * Item.TAX_RATE;

    return this.price + salesTax;
  }

  public getPricePerLiterOfAlcohol(): number {
    const priceWithTax = this.getPriceWithTax();
    const litersOfAlcohol = (this.volume * (this.alcoholRate / 100)) / 1000;

    return litersOfAlcohol > 0 ? priceWithTax / litersOfAlcohol : 0;
  }

  public getPricePerLiter(): number {
    const priceWithTax = this.getPriceWithTax();
    const liters = this.volume / 1000;

    return liters > 0 ? priceWithTax / liters : 0;
  }
}
