// app/page.tsx
import { Suspense } from 'react'
import Header from '@/components/Header'
import SearchSection from '../components/SearchSection'
import ListingGrid from '@/components/istingGrid'
import Footer from '@/components/Footer'
import { AuthCheck } from '@/components/AuthCheck'

async function getListings() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch listings')
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching listings:', error)
    return []
  }
}

export default async function LandingPage() {
  const listings = await getListings()

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main>
          <SearchSection />
          <section className="section md:bg-black/15 bg-skyblue-600 pt-10 xl:pb-[151px] md:pb-[100px] pb-[50px]">
            <div className="max-w-[1360px] px-[26px] w-full mx-auto">
              <Suspense fallback={<ListingsLoadingSkeleton />}>
                <ListingGrid initialListings={listings} />
              </Suspense>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </AuthCheck>
  )
}

function ListingsLoadingSkeleton() {
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-5 xl:gap-y-9 gap-y-5">
      {[...Array(12)].map((_, i) => (
        <div 
          key={i}
          className="animate-pulse bg-white rounded-xl p-4"
        >
          <div className="bg-gray-200 h-64 rounded-lg" />
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}