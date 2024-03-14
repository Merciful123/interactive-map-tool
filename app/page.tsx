"use client"
import Image from "next/image";
import MapComponent from "./components/MapComponent";

// import MapComponent from "./components/MapComponent";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 mt-0">
      <MapComponent/>
    </main>
  );
}
