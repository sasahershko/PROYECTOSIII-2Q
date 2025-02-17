"use client";

import Card from "@/components/Card";
import SpinLoader from "@/components/SpinLoader";
import { getProfile } from "@lib/profile";
import { useEffect, useState } from "react";

export default function Page() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!profile) {
      async function fetchProfile() {
        const data = await getProfile();
        setProfile(data);
      }
      fetchProfile();
    }
  }, [profile]);

  return (
    <div className="flex justify-center items-center h-screen">
      {!profile ? (
        <SpinLoader size="64px" />
      ) : (
        <Card className="text-2xl">
          <p>Nombre: {profile.nombre}</p>
          <p>Email: {profile.correo}</p>
          <p>Username: {profile.grado}</p>
          {/* Render other profile fields as needed */}
        </Card>
      )}
    </div>
  );
}
