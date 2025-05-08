"use client";
import React, { useEffect, useState } from "react";
import {
  getReservations,
  approveReservation,
  rejectReservation,
} from "@/lib/reservations";
import { fetchAllUsers } from "@/lib/users";
import SpinLoader from "@/components/SpinLoader";

export default function ReservasPage() {
  const [reservas, setReservas] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState(new Set());
  const [fDate, setFDate] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [term, setTerm] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // traemos reservas + usuarios en paralelo
        const [rs, us] = await Promise.all([
          getReservations(),
          fetchAllUsers(),
        ]);
        setReservas(rs);
        // montamos mapa id→usuario
        const m = {};
        us.forEach((u) => { m[u._id] = u; });
        setUsersMap(m);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const mostradas = reservas.filter(r => {
    if (fDate && r.date !== fDate) return false;
    if (fStatus && r.status !== fStatus) return false;
    if (term && !r.title.toLowerCase().includes(term.toLowerCase()))
      return false;
    return true;
  });

  const toggleSel = id => setSel(s => {
    const next = new Set(s);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const toggleAll = () =>
    mostradas.length > 0 && sel.size === mostradas.length
      ? setSel(new Set())
      : setSel(new Set(mostradas.map(r => r._id)));

  const onBulk = async act => {
    if (!sel.size) return;
    setLoading(true);
    try {
      await Promise.all(
        Array.from(sel).map(id =>
          act === "approve"
            ? approveReservation(id)
            : rejectReservation(id)
        )
      );
      const fresh = await getReservations();
      setReservas(fresh);
      setSel(new Set());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="flex items-center justify-center h-screen"><SpinLoader /></div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestión de Reservas</h1>

      {/* filtros */}
      <div className="flex flex-wrap gap-4">
        <input
          type="date"
          value={fDate}
          onChange={e => setFDate(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <select
          value={fStatus}
          onChange={e => setFStatus(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Estado</option>
          <option value="pending">Pendiente</option>
          <option value="approved">Aceptada</option>
          <option value="rejected">Rechazada</option>
        </select>
        <input
          type="text"
          placeholder="Buscar..."
          value={term}
          onChange={e => setTerm(e.target.value)}
          className="border rounded px-3 py-2 ml-auto w-64"
        />
      </div>

      {/* masivas */}
      <div className="flex items-center justify-between mt-4">
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            checked={mostradas.length > 0 && sel.size === mostradas.length}
            onChange={toggleAll}
            className="w-4 h-4"
          />
          <span>Seleccionar todo</span>
        </label>
        <div className="space-x-2">
          <button
            onClick={() => onBulk("approve")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Aceptar seleccionadas
          </button>
          <button
            onClick={() => onBulk("reject")}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Rechazar seleccionadas
          </button>
        </div>
      </div>

      {/* tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {mostradas.length > 0 ? mostradas.map(r => {
          const u = usersMap[r.user] || {};
          const name = u.name || "Usuario desconocido";
          const avatar = u.avatar || "/avatar-placeholder.png";
          const screens = r.resources?.screens ?? 0;
          const printers = r.resources?.printers ?? 0;
          const [txt, bg, fg] = {
            pending: ["Pendiente", "bg-yellow-100", "text-yellow-800"],
            approved: ["Aceptada", "bg-green-100", "text-green-800"],
            rejected: ["Rechazada", "bg-red-100", "text-red-800"],
          }[r.status] || [];

          return (
            <div key={r._id} className="relative bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <label className="absolute top-4 left-4">
                <input
                  type="checkbox"
                  checked={sel.has(r._id)}
                  onChange={() => toggleSel(r._id)}
                  className="w-5 h-5"
                />
              </label>

              <div className="flex items-center space-x-3 mb-4 pl-8">
                <img src={avatar} alt={name} className="w-8 h-8 rounded-full" />
                <span className="font-medium">{name}</span>
                <span className={`${bg} ${fg} ml-auto px-2 rounded-full text-xs font-semibold`}>
                  {txt}
                </span>
              </div>

              <h2 className="text-lg font-bold mb-1">{r.title}</h2>
              <p className="text-sm text-gray-600 mb-4">{r.location}</p>

              <div className="flex items-center space-x-6 text-gray-600 text-sm mb-2 pl-8">
                <CalendarIcon />
                <span>{new Date(r.date).toLocaleDateString("es-ES")}</span>
                <ClockIcon />
                <span>{r.startTime || "–"} – {r.endTime || "–"}</span>
              </div>

              <div className="flex items-center space-x-6 text-gray-600 text-sm mb-6 pl-8">
                <ScreensIcon /><span>{screens} pant.</span>
                <PrinterIcon /><span>{printers} impr.</span>
              </div>

              <button className="w-full border border-gray-300 rounded-lg py-2 hover:bg-gray-50">
                Ver Detalles
              </button>
            </div>
          );
        }) : (
          <p className="col-span-full text-center text-gray-500">
            No hay reservas que mostrar.
          </p>
        )}
      </div>
    </div>
  );
}

// íconos…
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
    viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14…" />
  </svg>
);
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
    viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9…" />
  </svg>
);
const ScreensIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
    viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 17v-6m6 6v-4…" />
  </svg>
);
const PrinterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
    viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M6 9V2h12v7…" />
  </svg>
);
