"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Heart, TrendingUp } from "lucide-react";
import { Header } from "@/components/header";

interface Fundraiser {
  _id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  category: string;
  image: string;
  createdAt: string;
}

export default function FundraisersPage() {
  const router = useRouter();
  const { user } = useUser();
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFundraisers();
  }, [user]);

  const fetchFundraisers = async () => {
    try {
      // Fetch active fundraisers
      const activeResponse = await fetch("/api/fundraisers");
      const activeData = await activeResponse.json();
      let allFundraisers = activeData.fundraisers || [];

      // If user is logged in, also fetch their own fundraisers (including pending)
      if (user?.id) {
        const myResponse = await fetch(`/api/fundraisers?creator=${user.id}`);
        const myData = await myResponse.json();
        const myFundraisers = myData.fundraisers || [];

        // Combine and deduplicate (user's fundraisers might already be in active list)
        const combined = [...allFundraisers];
        myFundraisers.forEach((myFund: Fundraiser) => {
          if (!combined.find(f => f._id === myFund._id)) {
            combined.push(myFund);
          }
        });
        allFundraisers = combined;
      }

      setFundraisers(allFundraisers);
    } catch (error) {
      console.error("Error fetching fundraisers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFundraisers = fundraisers.filter(
    (fundraiser) =>
      fundraiser.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fundraiser.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fundraiser.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Header />
      
      {/* Header хэсгийн өнгийг ногоон болгож өөрчлөв */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Бүх хандив тусламжийн аянууд
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Сайн үйлсийн төлөөх зорилтуудтай танилцаж, дэлхий ертөнцийг илүү сайн сайхан болгоход хувь нэмрээ оруулаарай.
            </p>
          </div>
          
          {/* Search Bar-ын border-ийг ногоон болгов */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search fundraisers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading fundraisers...</p>
          </div>
        ) : filteredFundraisers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No fundraisers available.</p>
            <Link href="/donate">
              <Button className="bg-green-600 hover:bg-green-700">Start Your Own Fundraiser</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFundraisers.map((fundraiser, index) => (
              <Link
                key={fundraiser._id}
                href={`/fundraisers/${fundraiser._id}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 transform hover:-translate-y-2 block border border-gray-100"
              >
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  <img
                    src={fundraiser.image || "/placeholder.svg"}
                    alt={fundraiser.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-4 h-4 text-red-500" />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1 group-hover:text-green-600 transition-colors">
                      {fundraiser.title}
                    </h3>
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full ml-2 capitalize font-medium">
                      {fundraiser.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {fundraiser.description}
                  </p>

                  <div className="mb-5">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-600">Raised</span>
                      <span className="font-bold text-green-600">
                        ${fundraiser.raised.toLocaleString()} / ${fundraiser.goal.toLocaleString()}
                      </span>
                    </div>
                    
                    {/* Progress Bar: Илүү тод ногоон болгосон */}
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-50">
                      <div
                        className="bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 h-3 rounded-full transition-all duration-1000"
                        style={{
                          width: `${Math.min((fundraiser.raised / fundraiser.goal) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-xs text-green-600 mt-2 font-medium">
                      <span>{Math.round((fundraiser.raised / fundraiser.goal) * 100)}% funded</span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Товчлуур: Blue/Purple-аас Green/Emerald руу шилжүүлсэн */}
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-green-200 transition-all duration-300">
                    Donate Now
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

  