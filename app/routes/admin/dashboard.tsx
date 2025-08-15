import { Header, StatsCard, TripCard } from "components"

import { dahsboardStats, user } from "~/constants"
import { parseTripData } from "lib/utils"
import { getTripsByTravelStyle,getUsersAndTripsStats } from "./dashboard"
import { getAllTrips } from "~/appwrite/trips"
import {ColumnDirective, ColumnsDirective, GridComponent, Inject} from "@syncfusion/ej2-react-grids";
import {
    Category,
    ChartComponent,
    ColumnSeries,
    DataLabel, SeriesCollectionDirective, SeriesDirective,
    SplineAreaSeries,
    Tooltip
} from "@syncfusion/ej2-react-charts";

import { tripXAxis, tripyAxis, userXAxis, useryAxis } from "~/constants"
import { redirect } from "react-router";
import { users } from '~/constants'
 
const { totalUsers, usersJoined, totalTrips, tripsCreated, userRole } = dahsboardStats
 
export const clientLoader = async () => {
    const [
        trips,
        tripsByTravelStyle,
    ] = await Promise.all([
        await getAllTrips(4, 0),
        await getTripsByTravelStyle(),
    ])

    const allTrips = trips.allTrips.map(({ $id, tripDetail, imageUrls }) => ({
        id: $id,
        ...parseTripData(tripDetail),
        imageUrls: imageUrls ?? []
    }))

    

    return {
        
        allTrips,
        tripsByTravelStyle,
        
    }
}


const Dashboard = ({loaderData} :React.ComponentProps) => {
 

  const { allTrips, tripsByTravelStyle } = loaderData;

  const trips = allTrips.map((trip) => ({
        imageUrl: trip.imageUrls[0],
        name: trip.name,
        interest: trip.interests,
    }))

  
  const usersAndTrips = [
        // {
        //     title: 'Latest user signups',
        //     dataSource: users,
        //     field: 'count',
        //     headerText: 'Trips created'
        // },
        {
            title: 'Trips based on interests',
            dataSource: trips,
            field: 'interest',
            headerText: 'Interests'
        }
    ]
 
  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome ${user?.name ?? 'Guest'} 🙌 `}
        description = "Track activity , trends and popular destination in real time "
      />
      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          <StatsCard
            headerTitle='Total Users'
            total={totalUsers}
            lastMonthCount={usersJoined.lastMonth}
            currentMonthCount = {usersJoined.currentMonth}
          
          
          />
          <StatsCard
            headerTitle='Total Users'
            total={totalTrips}
            lastMonthCount={tripsCreated.lastMonth}
            currentMonthCount = {tripsCreated.currentMonth}
          
          />
          <StatsCard
            headerTitle='Active Users'
            total={userRole.total}
            lastMonthCount={userRole.lastMonth}
            currentMonthCount = {userRole.currentMonth}
          
          />
        </div>
      </section>
      <section className="container">
        <h1 className="text-xl font-semibold">Created Trips</h1>
        <div className="trip-grid">
          {allTrips.map(
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
                location={itinerary?.[0]?.location ?? ""}
                imageUrl={imageUrls?.[0] ?? ""}
                tags={[interests, travelStyle]}
                price={estimatedPrice}
                />
            )
            )}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
         <ChartComponent
                    id="chart-1"
                    primaryXAxis={tripXAxis}
                    primaryYAxis={tripyAxis}
                    title="Trip Trends"
                    tooltip={{ enable: true}}
                >
                    <Inject services={[ColumnSeries, SplineAreaSeries, Category, DataLabel, Tooltip]} />

                    <SeriesCollectionDirective>
                        <SeriesDirective
                            dataSource={tripsByTravelStyle}
                            xName="travelStyle"
                            yName="count"
                            type="Column"
                            name="day"
                            columnWidth={0.3}
                            cornerRadius={{topLeft: 10, topRight: 10}}
                        />
                    </SeriesCollectionDirective>
        </ChartComponent>
        
      </section>

      <section className="user-trip wrapper">
                {usersAndTrips.map(({ title, dataSource, field, headerText}, i) => (
                    <div key={i} className="flex flex-col gap-5">
                        <h3 className="p-20-semibold text-dark-100">{title}</h3>

                        <GridComponent dataSource={dataSource} gridLines="None">
                            <ColumnsDirective>
                                <ColumnDirective
                                    field="name"
                                    headerText="Name"
                                    width="200"
                                    textAlign="Left"
                                    template={(props: UserData) => (
                                        <div className="flex items-center gap-1.5 px-4">
                                            <img src={props.imageUrl} alt="user" className="rounded-full size-8 aspect-square" referrerPolicy="no-referrer" />
                                            <span>{props.name}</span>
                                        </div>
                                    )}
                                />

                                <ColumnDirective
                                field={field}
                                headerText={headerText}
                                width="150"
                                textAlign="Left"
                                />
                                </ColumnsDirective>
                        </GridComponent>
                    </div>
                ))}
            </section>
    </main>
  )
}

export default Dashboard