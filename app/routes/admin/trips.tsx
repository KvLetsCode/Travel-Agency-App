import { Header } from 'components'
import { useSearchParams, type LoaderFunctionArgs } from "react-router";
import { getAllTrips, getTripById } from "~/appwrite/trips";
import type { Route } from './+types/trips';
import { parseTripData } from 'lib/utils';
import { TripCard } from 'components';
import { useState } from 'react';
import { PagerComponent } from '@syncfusion/ej2-react-grids';



export const loader = async ({ request }: LoaderFunctionArgs) => {
  const limit = 8 
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get("page") || "1", 10)
  const offset = (page-1) * limit
   
  const {allTrips,total} = await getAllTrips(limit,offset)
    

    
    

  return {
        trips: allTrips.map(({ $id, tripDetail, imageUrls }) => ({
        id: $id,
        ...parseTripData(tripDetail),
        imageUrls: imageUrls ?? [],
        })),
        total
  };
};


const trips = ({ loaderData }: Route.ComponentProps) => {

  const trips = loaderData?.trips as Trip[] || []
  const [searchParams] = useSearchParams()

  const initialPage = Number(searchParams.get('page' || '1'))

  const [CurrentPage, setCurrentPage] = useState(initialPage)

  const handlePageChange = (page: Number) => {
    setCurrentPage(page)
    window.location.search = `?page=${page}`
  }
  return (
    <main className='all-users wrapper'
    >
      <Header
            title="Trips"
              description='View and edit AI-generated trvel plans'
              ctaText='Create a trip'
              ctaUrl='/trips/create'
          
      />
      <section>
        <h1 className='p-24-semibold text-dark-100 mb-4'>
          Manage Created Trips
        </h1>

        <div className="trip-grid mb-4">
            {trips.map(
            ({
                id,
                name,
                imageUrls,
                itinerary,
                interests,
                travelStyle,
                estimatedPrice,
                location
            }) => (
                <TripCard
                key={id}
                id={id}
                name={name}
                  // location={location?.city ?? ""} // Or itinerary?.[0]?.title
                location={itinerary?.[0]?.location ?? ""}
                imageUrl={imageUrls?.[0] ?? ""}
                tags={[interests, travelStyle]}
                price={estimatedPrice}
                />
            )
            )}

        </div>
        
        <PagerComponent
          totalRecordsCount={loaderData.total}
          pageSize={8}
          currentPage={CurrentPage}
          click={(args) => handlePageChange(args.currentPage)}
          className='!mb-4'
        />
      </section>
    </main>
  )
}

export default trips