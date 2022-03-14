
export const listingService = {
    formattedPrice,
}

function formattedPrice(price) {
    const options = { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }
    return new Intl.NumberFormat('en-US', options).format(price)
}