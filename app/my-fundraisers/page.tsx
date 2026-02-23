"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { Edit, Eye, ArrowLeft } from "lucide-react";

interface Fundraiser {
  _id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  category: string;
  image: string;
  status: string;
  createdAt: string;
}

export default function MyFundraisersPage() {
  const { user } = useUser();
  const router = useRouter();
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFundraisers();
    }
  }, [user]);

  const fetchFundraisers = async () => {
    try {
      const response = await fetch(`/api/fundraisers?creator=${user?.id}`);
      const data = await response.json();
      setFundraisers(data.fundraisers || []);
    } catch (error) {
      console.error("Error fetching fundraisers:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-background py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">
                  Loading your fundraisers...
                </p>
              </div>
            ) : fundraisers.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-6">
                  You haven't created any fundraisers yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fundraisers.map((fundraiser) => (
                  <div
                    key={fundraiser._id}
                    className="bg-card rounded-xl shadow-sm overflow-hidden border hover:border-primary/20"
                  >
                    <div className="aspect-video bg-muted relative">
                      {fundraiser.image ? (
                        <img
                          src={fundraiser.image}
                          alt={fundraiser.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-foreground line-clamp-2">
                          {fundraiser.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            fundraiser.status === "active"
                              ? "bg-green-100 text-green-800"
                              : fundraiser.status === "completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {fundraiser.status}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                        {fundraiser.description}
                      </p>
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Raised
                          </p>
                          <p className="text-2xl font-bold text-primary">
                            ${fundraiser.raised.toLocaleString()} / $
                            {fundraiser.goal.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Category
                          </p>
                          <p className="text-sm font-medium capitalize text-foreground">
                            {fundraiser.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Link
                          href={`/fundraisers/${fundraiser._id}`}
                          className="flex-1"
                        >
                          <Button className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SignedIn>
    </>
  );
}
