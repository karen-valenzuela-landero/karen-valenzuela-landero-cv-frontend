"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Profile = {
  name: string;
  role: string;
  devExperience: string[];
  qaExperience: string[];
  languages: string[];
  technologies: string[];
  coreSkills: string[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  /**
    fetch(`${API_URL}/api/v1/profile`)
      .then(res => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      //.then(data => setProfile(data))
      .then(data => {
        if (!data.name || !data.role) throw new Error("Invalid profile data");
        setProfile(data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  if (!profile) return <Loader />;
  */
    const fetchProfile = async (attempt = 1) => {
      try {
        const res = await fetch(`${API_URL}/api/v1/profile`);
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();

        // Validar estructura
        if (!data.name || !data.role) {
          throw new Error("Invalid profile structure");
        }

        setProfile(data);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        
        if (attempt < MAX_RETRIES) {
          console.warn(`Retry ${attempt}/${MAX_RETRIES} in ${RETRY_DELAY}ms...`);
          setTimeout(() => fetchProfile(attempt + 1), RETRY_DELAY);
        } else {
          console.error("Final error:", message);
          setError(message);
        }
      }
    };

    fetchProfile();
  }, []);

  if (error) return <ErrorScreen message={error} />;
  if (!profile) return <Loader />;

  return (
    <main className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white min-h-screen p-8">
      
      {/* HERO */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-5xl font-bold">{profile.name}</h1>
        <p className="text-xl text-gray-400 mt-2">{profile.role}</p>

        <div className="mt-6 flex gap-4">
          <a
            href={`${API_URL}/swagger-ui.html`}
            target="_blank"
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition"
          >
            🔗 API Docs
          </a>
        </div>
      </motion.div>

      {/* SECTIONS */}
      <Grid>
        <Card title="💻 Skills" items={profile.coreSkills} />
        <Card title="🌐 Languages" items={profile.languages} />
        <Card title="⚙️ Technologies" items={profile.technologies} />
        <Card title="💼 Dev Experience" items={profile.devExperience} />
        <Card title="🧪 QA Experience" items={profile.qaExperience} />
      </Grid>
    </main>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {children}
    </div>
  );
}

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      className="bg-gray-800/60 backdrop-blur-lg border border-gray-700 p-5 rounded-2xl shadow-lg"
    >
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="bg-gray-700 px-3 py-1 rounded-full text-sm hover:bg-blue-500 transition"
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <p className="text-red-500 text-lg mb-4">❌ Error loading profile</p>
        <p className="text-gray-400">{message}</p>
      </motion.div>
    </div>
  );
}
function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
      />
    </div>
  );
  
}