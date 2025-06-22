import { Item } from "./item";

/**
 * Transforms the price 25,40 $ -> 25.40
 * @param price {string} - The price string to transform.
 * @returns {number} - The transformed price as a number.
 */
function getRawPrice(price: string): number {
    // Remove the dollar sign and any whitespace
    const cleanedPrice = price.replace(/[$\s]/g, '');
    
    // Replace comma with a dot for decimal conversion
    const normalizedPrice = cleanedPrice.replace(',', '.');
    
    // Convert to number
    return parseFloat(normalizedPrice);
}

function getStringPriceFromPage(): string {
    // Get the price element from the page
    const priceElement = document.querySelector('span.price') as HTMLElement;
    
    // Return the text content of the price element
    return priceElement ? priceElement.textContent || '' : '';
}

function getAlcoolRateFromPage(): string {
    // get inside of <strong data-th="Degré d'alcool">
    const alcoolElement = document.querySelector('strong[data-th="Degré d\'alcool"]') as HTMLElement;
    // Return the text content of the alcohol element
    return alcoolElement ? alcoolElement.textContent || '' : '';
}

function getRawAlcoolRate(alcool: string): number {
    // transform the alcohol rate from "12,5 %" to 12.5
    const cleanedAlcool = alcool.replace(/[%\s]/g, ''); // Remove percentage sign and whitespace
    const normalizedAlcool = cleanedAlcool.replace(',', '.'); // Replace comma with dot
    // Convert to number
    return parseFloat(normalizedAlcool);
}

function convertNumberToStringWithTwoDecimals(value: number): string {
    // Convert the number to a string with two decimal places
    return value.toFixed(2);
}

function getVolumeFromPage(): number {
    const volumeElement = document.querySelector('div.product.attribute.format > span.value > strong.type') as HTMLElement;
    if (volumeElement) {
        const volumeText = volumeElement.textContent?.trim() || '';

        // Match un nombre entier ou décimal (virgule ou point), suivi de "ml" ou "L"
        const volumeMatch = volumeText.match(/([\d,.]+)\s*(ml|l)?/i);
        if (volumeMatch) {
            // Remplace virgule par point pour pouvoir parser
            const rawValue = volumeMatch[1].replace(',', '.');
            const volumeValue = parseFloat(rawValue);

            const unit = volumeMatch[2]?.toLowerCase();
            if (unit === 'l') {
                return Math.round(volumeValue * 1000); // Convertit L → mL
            }
            return Math.round(volumeValue); // ml ou rien
        }
    }
    return 0;
}

function getDisplayablePriceWithTax(priceWithTax: number): string {
    return convertNumberToStringWithTwoDecimals(priceWithTax) + ' $ TTC';
}

function getDisplayablePricePerLiterOfAlcohol(pricePerLiterOfAlcohol: number): string {
    return convertNumberToStringWithTwoDecimals(pricePerLiterOfAlcohol) + ' $/L d\'alcool';
}

function getDisplayablePricePerLiter(pricePerLiter: number): string {
    return convertNumberToStringWithTwoDecimals(pricePerLiter) + ' $/L';
}

/**
 * Add the price with tax to the page. in a div located in the first div.product-info-price if there is one
 */
function addPriceWithTaxToPage(priceWithTax: string): void {
    const priceDiv = document.querySelector('div.product-info-price');
    if (priceDiv) {
        const priceWithTaxDiv = document.createElement('div');
        priceWithTaxDiv.className = 'price-with-tax';
        priceWithTaxDiv.textContent = `${priceWithTax}`;
        priceDiv.appendChild(priceWithTaxDiv);
    }
}

function addPricePerLiterOfAlcoholToPage(pricePerLiterOfAlcohol: string): void {
    const priceDiv = document.querySelector('div.product-info-price');
    if (priceDiv) {
        const pricePerLiterOfAlcoholDiv = document.createElement('div');
        pricePerLiterOfAlcoholDiv.className = 'price-per-liter-of-alcohol';
        pricePerLiterOfAlcoholDiv.textContent = `${pricePerLiterOfAlcohol}`;
        priceDiv.appendChild(pricePerLiterOfAlcoholDiv);
    }
}

function addPricePerLiterToPage(pricePerLiter: string): void {
    const priceDiv = document.querySelector('div.product-info-price');
    if (priceDiv) {
        const pricePerLiterDiv = document.createElement('div');
        pricePerLiterDiv.className = 'price-per-liter';
        pricePerLiterDiv.textContent = `${pricePerLiter}`;
        priceDiv.appendChild(pricePerLiterDiv);
    }
}

function isAProductPage(): boolean {
    // Check if the page has a div.product.info.container
    const productInfoContainer = document.querySelector('div.product.info.container');
    return productInfoContainer !== null;
}

let productLog = isAProductPage() ? "This is a product page." : "This is not a product page.";
console.log(productLog);
if(isAProductPage() === true) {
    let item = new Item(getVolumeFromPage(), getRawPrice(getStringPriceFromPage()), getRawAlcoolRate(getAlcoolRateFromPage()));
    
    let priceWithTax = convertNumberToStringWithTwoDecimals(item.getPriceWithTax());
    let pricePerLiterOfAlcohol = convertNumberToStringWithTwoDecimals(item.getPricePerLiterOfAlcohol());
    let pricePerLiter = convertNumberToStringWithTwoDecimals(item.getPricePerLiter());

    // log an error if any of the prices are NaN
    if(isNaN(item.getPriceWithTax())) {
        console.error("Error: Price with tax is NaN. Please check the price format on the page.");
    }

    if(isNaN(item.getPricePerLiterOfAlcohol())) {
        console.error("Error: Price per liter of alcohol is NaN. Please check the alcohol rate format on the page.");
    }

    if(isNaN(item.getPricePerLiter())) {
        console.error("Error: Price per liter is NaN. Please check the volume format on the page.");
    }
    // Add the price with tax to the page
    addPriceWithTaxToPage(getDisplayablePriceWithTax(item.getPriceWithTax()));
    // Add the price per liter of alcohol to the page
    addPricePerLiterOfAlcoholToPage(getDisplayablePricePerLiterOfAlcohol(item.getPricePerLiterOfAlcohol()));
    // Add the price per liter to the page
    addPricePerLiterToPage(getDisplayablePricePerLiter(item.getPricePerLiter()));
}
