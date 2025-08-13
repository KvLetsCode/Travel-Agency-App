import { Header, StatsCard, TripCard } from "components"

import { dahsboardStats,user,allTrips } from "~/constants"
 


const Dashboard = () => {
 
  const {totalUsers,usersJoined,totalTrips,tripsCreated,userRole} = dahsboardStats
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
          {allTrips.slice(0,4).map(({id,name,imageUrls,itinerary,tags,estimatedPrice}) =>(
            <TripCard
              key={id}
              id={id.toString()}
              name={name}
              imageUrl={imageUrls[0]}
              location={itinerary?.[0]?.location ?? ''}
              tags={tags}
              price={estimatedPrice}
          
            />
          ))}
        </div>
        
      </section>
      
      
    </main>
  )
}

export default Dashboard