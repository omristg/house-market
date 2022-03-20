import { ListingPreview } from "./ListingPreview"

export const ListingList = ({ listings, lastFetchListing, onFetchMore, isOffers, categoryName }) => {

    return (
        <div className="listing-list">
            <header>
                <p className="page-header">
                    {isOffers ? 'Offers' : `Places for ${categoryName}`}
                </p>
            </header>
            {listings && listings.length > 0 ?
                <main>
                    <ul>
                        {listings.map(listing => {
                            const { id } = listing
                            return <ListingPreview key={id} listing={listing} />

                        })}
                    </ul>
                </main>
                :
                <>
                    {isOffers ? (
                        <p>There are no  offers avialable</p>
                    ) : (
                        <p>No listings for {categoryName}</p>
                    )}
                </>
            }
            {lastFetchListing && (
                <p className="loadMore" onClick={onFetchMore}>Load More</p>
            )}
        </div>
    )
}