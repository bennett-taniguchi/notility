import React from "react";
import Layout from "../components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import Link from "next/link";

const SimplifiedLanding = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="min-h-screen bg-gradient-to-r from-purple-200 via-sky-300 to-cyan-300">
        
        {/* Hero Content */}
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <h1 className="font-roboto text-6xl md:text-8xl font-extrabold text-center text-slate-800 mb-8 drop-shadow-lg">
            Notility
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 text-center max-w-2xl mb-12">
            Transform your notes with AI-powered insights and collaborative tools
          </p>
          <div className="flex gap-4">
            <Link href="/notespace">
              <Button className="px-8 py-3 text-lg bg-slate-800 hover:bg-slate-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Get Started
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="px-8 py-3 text-lg border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white rounded-lg shadow-lg transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
          
          {/* Feature 1: Notespace */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="flex flex-col justify-center">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-3xl font-bold text-slate-800 mb-4">
                    Rich Text Editing
                  </CardTitle>
                  <CardDescription className="text-lg text-slate-600">
                    Take your notes online with a powerful rich text editor that adapts to your workflow.
                  </CardDescription>
                </CardHeader>
                <Link href="/notespace">
                  <Button className="w-fit bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Try Notespace
                  </Button>
                </Link>
              </div>
              
              <div className="relative">
                {/* Optimized Video */}
                <video
                  className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata" // Changed from "auto"
                >
                  <source src="/videos/editor-demo.mp4" type="video/mp4" />
                </video>
                {/* Fallback poster */}
               
              </div>
            </div>
          </Card>

          {/* Feature 2: AI Chat */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              
              <div className="relative order-2 md:order-1">
                <video
                  className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src="/videos/cursorful-chat.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <p className="text-slate-600">AI Chat Demo</p>
                </div>
              </div>
              
              <div className="flex flex-col justify-center order-1 md:order-2">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-3xl font-bold text-slate-800 mb-4">
                    AI-Powered Insights
                  </CardTitle>
                  <CardDescription className="text-lg text-slate-600">
                    Chat with an AI expert about your notes. Get explanations, insights, and answers tailored to your content.
                  </CardDescription>
                </CardHeader>
                <Link href="/premium">
                  <Button className="w-fit bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Go Premium
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Feature 3: Learning Tools */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden">
            <div className="text-center p-12">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="text-3xl font-bold text-slate-800 mb-4">
                  Enhanced Learning
                </CardTitle>
                <CardDescription className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Create flashcards, take quizzes, and track your progress. Transform your notes into interactive learning experiences.
                </CardDescription>
              </CardHeader>
              <Link href="/learn">
                <Button className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Start Learning
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Footer CTA */}
        <div className="text-center py-16 px-4">
          <h2 className="text-4xl font-bold text-slate-800 mb-6">
            Ready to transform your notes?
          </h2>
          <Link href="/notespace">
            <Button className="bg-slate-800 hover:bg-slate-700 text-white px-12 py-4 text-xl rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default SimplifiedLanding;